import React, { useState, useEffect, useMemo } from 'react';
import "tailwindcss";
import { initializeApp } from 'firebase/app';
// Trazendo de volta o signInWithCustomToken
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth'; 
import { 
    getFirestore, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot, 
    collection, 
    query,
    setLogLevel
} from 'firebase/firestore';



// --- Configuração do Firebase (Lida do Netlify) ---
// Você DEVE configurar estas variáveis no painel do Netlify
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  
  // Validação simples para garantir que as variáveis foram carregadas
  if (!firebaseConfig.apiKey) {
      console.error("Erro: Variáveis de ambiente do Firebase (VITE_FIREBASE_...) não foram carregadas.");
      // Você pode querer mostrar um erro na UI aqui
  } 


// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
setLogLevel('Debug');

// --- CREDENCIAIS DE ADMIN "COZIDAS" ---
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

/**
 * Embaralha um array (Algoritmo Fisher-Yates)
 */
const shuffle = (array) => {
    let newArray = [...array]; // Evita mutação do estado original
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

/**
 * Valida e normaliza a posição
 */
const validatePosition = (pos) => {
    const validPositions = ['Ataque', 'Meio', 'Defesa', 'Goleiro'];
    if (!pos) return null;
    const normalizedPos = pos.trim();
    // Tenta capitalizar (ex: "ataque" -> "Ataque")
    const capitalized = normalizedPos.charAt(0).toUpperCase() + normalizedPos.slice(1).toLowerCase();
    if (validPositions.includes(capitalized)) return capitalized;
    if (validPositions.includes(normalizedPos)) return normalizedPos;
    return null;
};

/**
 * Valida e normaliza o nível
 */
const validateLevel = (lvl) => {
    const validLevels = ['A', 'B', 'C', 'D', 'E'];
    if (!lvl) return null;
    const normalizedLvl = lvl.trim().toUpperCase();
    if (validLevels.includes(normalizedLvl)) return normalizedLvl;
    return null;
};


/**
 * Componente principal do aplicativo
 */
export default function App() {
    // --- Estados do Componente ---
    const [players, setPlayers] = useState([]); // Lista de jogadores
    const [isLoading, setIsLoading] = useState(true); // Status de carregamento dos dados
    const [userId, setUserId] = useState(null); // ID do usuário autenticado
    
    // --- Estados de Autenticação Local ---
    const [firebaseAuthStatus, setFirebaseAuthStatus] = useState('pending'); // 'pending' | 'authed'
    const [authMode, setAuthMode] = useState(null); // null | 'guest' | 'admin'
    const [loginError, setLoginError] = useState(null);
    
    // --- NOVO ESTADO DE TELA (ABAS) ---
    const [activeTab, setActiveTab] = useState('gerenciamento'); // gerenciamento | adicionar | importar | sorteio

    // --- Estado do Formulário ---
    const [newPlayer, setNewPlayer] = useState({
        name: '',
        position: 'Ataque',
        level: 'A'
    });

    // --- Estados da Importação ---
    const [fileToImport, setFileToImport] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState(null);
    const [importSuccess, setImportSuccess] = useState(null);

    // --- Estados do Sorteio ---
    const [drawnTeams, setDrawnTeams] = useState(null);
    const [drawError, setDrawError] = useState(null);

    // Flag de "somente leitura"
    const isReadOnly = authMode !== 'admin';

    // Referência da coleção (memoizada para estabilidade)
    const playersCollectionRef = useMemo(() => {
        if (!userId) return null;
        // Revertendo para o caminho da coleção que usa o appId
        const collectionPath = `artifacts/${firebaseConfig.appId}/users/${userId}/players`;
        console.log("Caminho da coleção:", collectionPath);
        return collection(db, collectionPath);
    }, [userId]); // Adicionado appId como dependência

    // --- Efeito: Autenticação Firebase ---
    useEffect(() => {
        // Revertendo para a lógica de login que usa o token ou anônimo
        const signIn = async () => {
            try {
                if (firebaseConfig.initialToken) {
                    console.log("Autenticando com token customizado...");
                    await signInWithCustomToken(auth, firebaseConfig.initialToken);
                } else {
                    console.log("Autenticando anonimamente...");
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Erro durante o login Firebase:", error);
            }
        };

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
            setFirebaseAuthStatus('authed');
        });

        signIn(); // Chama a função de login
        return () => unsubscribeAuth();
    }, []); // Dependência vazia, roda apenas uma vez

    // --- Efeito: Carregamento de Dados (Firestore) ---
    useEffect(() => {
        if (!playersCollectionRef) {
            if (firebaseAuthStatus === 'authed') {
                 setIsLoading(false);
            }
            return;
        }

        setIsLoading(true);
        const q = query(playersCollectionRef);

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            const playersData = [];
            snapshot.forEach((doc) => {
                playersData.push({ id: doc.id, ...doc.data() });
            });
            playersData.sort((a, b) => a.name.localeCompare(b.name));
            setPlayers(playersData);
            setIsLoading(false);
        }, (error) => {
            console.error("Erro ao carregar jogadores:", error);
            setIsLoading(false);
        });

        return () => unsubscribeSnapshot();

    }, [playersCollectionRef, firebaseAuthStatus]); // Depende da ref da coleção

    // --- Manipuladores de Login Local ---

    const handleAdminLogin = (username, password) => {
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            setAuthMode('admin');
            setLoginError(null);
        } else {
            setLoginError('Usuário ou senha inválidos.');
        }
    };

    const handleGuestLogin = () => {
        setAuthMode('guest');
        setActiveTab('gerenciamento'); // Visitantes sempre começam aqui
    };
    
    const handleLogout = () => {
        setAuthMode(null);
        setLoginError(null);
    };

    // --- Manipuladores de Eventos (Ações do App) ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlayer(prev => ({ ...prev, [name]: value }));
    };

    const handleAddPlayer = async (e) => {
        e.preventDefault();
        if (isReadOnly || !playersCollectionRef || !newPlayer.name.trim()) return;

        const playerToAdd = {
            ...newPlayer,
            paymentStatus: 'pending',
            attendance: 'absent'
        };

        try {
            await addDoc(playersCollectionRef, playerToAdd);
            setNewPlayer({ name: '', position: 'Ataque', level: 'A' });
            setActiveTab('gerenciamento'); // Volta para a lista após adicionar
        } catch (error) {
            console.error("Erro ao adicionar jogador: ", error);
        }
    };

    const handleImport = () => {
        if (isReadOnly || !fileToImport || !playersCollectionRef) {
            if(isReadOnly) setImportError("Modo visitante não pode importar.");
            else setImportError("Selecione um arquivo.");
            return;
        }

        setImportError(null);
        setImportSuccess(null);
        setIsImporting(true);

        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const content = e.target.result;
                const lines = content.split('\n');
                let addedCount = 0;
                let errorLines = [];

                const importPromises = lines.map(async (line, index) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return; 

                    const parts = trimmedLine.split('|');
                    if (parts.length < 3) {
                        errorLines.push(index + 1); return;
                    }
                    const name = parts[0].trim();
                    const position = validatePosition(parts[1]);
                    const level = validateLevel(parts[2]);

                    if (!name || !position || !level) {
                        errorLines.push(index + 1); return;
                    }
                    
                    await addDoc(playersCollectionRef, {
                        name, position, level,
                        paymentStatus: 'pending', attendance: 'absent'
                    });
                    addedCount++;
                });

                await Promise.all(importPromises);

                setImportSuccess(`${addedCount} jogadores importados.`);
                if (errorLines.length > 0) {
                    setImportError(`Falha em ${errorLines.length} linhas (ex: ${errorLines.slice(0, 5).join(', ')}).`);
                }
            } catch (error) {
                setImportError("Ocorreu um erro ao processar o arquivo." + error);
            } finally {
                setIsImporting(false);
                setFileToImport(null);
                const fileInput = document.getElementById('import-file');
                if (fileInput) fileInput.value = null;
            }
        };
        reader.readAsText(fileToImport);
    };

    const handleDrawTeams = () => {
        if (isReadOnly) return;
        
        setDrawError(null);
        setDrawnTeams(null);

        const confirmedPlayers = players.filter(p => p.attendance === 'confirmed');
        const levels = ['A', 'B', 'C', 'D', 'E'];
        
        const groups = { A: [], B: [], C: [], D: [], E: [] };
        const others = [];

        for (const player of confirmedPlayers) {
            if (groups[player.level]) {
                groups[player.level].push(player);
            } else {
                others.push(player);
            }
        }

        for (const level of levels) {
            if (groups[level].length < 4) {
                setDrawError(`Não há jogadores confirmados suficientes. Precisa de pelo menos 4 do nível ${level}.`);
                return;
            }
            groups[level] = shuffle(groups[level]);
        }

        const newTeams = { team1: [], team2: [], team3: [], team4: [] };
        for (const level of levels) {
            newTeams.team1.push(groups[level].pop());
            newTeams.team2.push(groups[level].pop());
            newTeams.team3.push(groups[level].pop());
            newTeams.team4.push(groups[level].pop());
        }

        const reserves = [
            ...groups.A, ...groups.B, ...groups.C, ...groups.D, ...groups.E,
            ...others
        ].sort((a,b) => a.name.localeCompare(b.name));

        newTeams.reserves = reserves;
        setDrawnTeams(newTeams);
    };


    const togglePayment = async (id, currentStatus) => {
        if (isReadOnly) return;
        const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
        const playerDoc = doc(db, playersCollectionRef.path, id);
        try { await updateDoc(playerDoc, { paymentStatus: newStatus }); }
        catch (error) { console.error("Erro ao atualizar pagamento:", error); }
    };

    const toggleAttendance = async (id, currentAttendance) => {
        if (isReadOnly) return;
        const newAttendance = currentAttendance === 'confirmed' ? 'absent' : 'confirmed';
        const playerDoc = doc(db, playersCollectionRef.path, id);
        try { await updateDoc(playerDoc, { attendance: newAttendance }); }
        catch (error) { console.error("Erro ao atualizar presença:", error); }
    };

    const deletePlayer = async (id) => {
        if (isReadOnly) return;
        const playerDoc = doc(db, playersCollectionRef.path, id);
        try { await deleteDoc(playerDoc); }
        catch (error) { console.error("Erro ao excluir jogador:", error); }
    };

    // --- Renderização Condicional ---

    // 1. Esperando o Firebase autenticar
    if (firebaseAuthStatus === 'pending') {
        return <FullScreenLoader text="Conectando ao Firebase..." />;
    }

    // 2. Firebase OK, mostrar tela de login local
    if (!authMode) {
        return (
            <LoginScreen 
                onAdminLogin={handleAdminLogin}
                onGuestLogin={handleGuestLogin}
                error={loginError}
            />
        );
    }
    
    // 3. Login local (Admin ou Visitante) OK, mostrar o App com Abas
    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl font-sans">
            <header className="mb-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold text-blue-700">Gerenciador do Time</h1>
                    <div className="text-right">
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${isReadOnly ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-800'}`}>
                            {isReadOnly ? 'Modo Visitante' : 'Modo Admin'}
                        </span>
                        <button 
                            onClick={handleLogout} 
                            className="ml-2 text-sm text-blue-600 hover:underline"
                        >
                            Sair
                        </button>
                    </div>
                </div>
                <p className="text-left text-gray-600 text-sm mt-2">
                    ID do Time: 
                    <span className="font-mono bg-gray-200 px-2 py-1 rounded ml-1">
                        {userId || "N/A"}
                    </span>
                </p>
            </header>

            {/* Navegação das Abas */}
            <TabNavigation 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isReadOnly={isReadOnly}
            />

            {/* Conteúdo das Abas */}
            <main className="mt-6">
                
                {/* Aba: Gerenciamento do Time */}
                {activeTab === 'gerenciamento' && (
                    <section className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Meu Time</h2>
                        
                        {isLoading && <Loader text="Carregando jogadores..." />}
                        {!isLoading && !userId && <p className="text-center text-red-500">Erro de autenticação Firebase.</p>}
                        {!isLoading && userId && players.length === 0 && <p className="text-center text-gray-500">Nenhum jogador cadastrado.</p>}

                        {!isLoading && userId && players.length > 0 && (
                            <div className="space-y-4">
                                {players.map(player => (
                                    <PlayerCard 
                                        key={player.id} 
                                        player={player} 
                                        onTogglePayment={togglePayment}
                                        onToggleAttendance={toggleAttendance}
                                        onDeletePlayer={deletePlayer}
                                        isReadOnly={isReadOnly}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Aba: Adicionar Jogador (Apenas Admin) */}
                {activeTab === 'adicionar' && !isReadOnly && (
                    <section className={`mb-8 bg-white p-6 rounded-lg shadow-md`}>
                        <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Jogador</h2>
                        <form onSubmit={handleAddPlayer} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="player-name" className="block text-sm font-medium text-gray-700">Nome</label>
                                <input 
                                    type="text" id="player-name" name="name"
                                    value={newPlayer.name}
                                    onChange={handleInputChange}
                                    required 
                                    disabled={isReadOnly}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label htmlFor="player-position" className="block text-sm font-medium text-gray-700">Função</label>
                                <select 
                                    id="player-position" name="position"
                                    value={newPlayer.position}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="Ataque">Ataque</option>
                                    <option value="Meio">Meio</option>
                                    <option value="Defesa">Defesa</option>
                                    <option value="Goleiro">Goleiro</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="player-level" className="block text-sm font-medium text-gray-700">Nível</label>
                                <select 
                                    id="player-level" name="level"
                                    value={newPlayer.level}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="A">A (Craque)</option>
                                    <option value="B">B (Bom)</option>
                                    <option value="C">C (Médio)</option>
                                    <option value="D">D (Iniciante)</option>
                                    <option value="E">E (Precisa treinar)</option>
                                </select>
                            </div>
                            <div className="md:self-end">
                                <button 
                                    type="submit" 
                                    disabled={isReadOnly}
                                    className="w-full mt-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </form>
                    </section>
                )}
                
                {/* Aba: Importar Jogadores (Apenas Admin) */}
                {activeTab === 'importar' && !isReadOnly && (
                     <section className={`mb-8 bg-white p-6 rounded-lg shadow-md`}>
                        <h2 className="text-2xl font-semibold mb-4">Importar Jogadores (.txt)</h2>
                        <p className="text-sm text-gray-600 mb-2">Formato: <code className="bg-gray-200 px-1 rounded">Nome|Função|Nível</code></p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input 
                                type="file" id="import-file" accept=".txt"
                                onChange={(e) => setFileToImport(e.target.files[0])}
                                disabled={isReadOnly}
                                className="block w-full text-sm text-gray-500
                                           file:mr-4 file:py-2 file:px-4
                                           file:rounded-md file:border-0
                                           file:text-sm file:font-semibold
                                           file:bg-blue-50 file:text-blue-700
                                           hover:file:bg-blue-100
                                           disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button 
                                onClick={handleImport}
                                disabled={!fileToImport || isImporting || isReadOnly}
                                className="w-full sm:w-auto bg-green-600 text-white font-bold py-2 px-6 rounded-md shadow-sm hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isImporting ? 'Importando...' : 'Importar'}
                            </button>
                        </div>
                        {importSuccess && <p className="text-green-600 mt-4">{importSuccess}</p>}
                        {importError && <p className="text-red-600 mt-4">{importError}</p>}
                    </section>
                )}

                {/* Aba: Sorteio de Times */}
                {activeTab === 'sorteio' && (
                    <section className={`mb-8 bg-white p-6 rounded-lg shadow-md`}>
                        <h2 className="text-2xl font-semibold mb-4">Sorteio dos Times</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Sorteia 4 times, cada um com 1 jogador (A, B, C, D, E) com base nos "Confirmados".
                        </p>
                        <button 
                            onClick={handleDrawTeams}
                            disabled={isReadOnly}
                            className="w-full sm:w-auto bg-purple-600 text-white font-bold py-2 px-6 rounded-md shadow-sm hover:bg-purple-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Sortear Times
                        </button>
                        {drawError && <p className="text-red-600 mt-4">{drawError}</p>}
                        
                        {drawnTeams && <TeamDrawResults teams={drawnTeams} />}
                    </section>
                )}

            </main>
            
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

/**
 * Componente da Navegação por Abas
 */
function TabNavigation({ activeTab, setActiveTab, isReadOnly }) {
    return (
        <nav className="flex flex-wrap space-x-2 border-b border-gray-200 pb-4">
            <TabButton 
                label="Gerenciamento" 
                isActive={activeTab === 'gerenciamento'} 
                onClick={() => setActiveTab('gerenciamento')} 
            />
            <TabButton 
                label="Sorteio" 
                isActive={activeTab === 'sorteio'} 
                onClick={() => setActiveTab('sorteio')} 
            />
            {!isReadOnly && (
                <>
                    <TabButton 
                        label="Adicionar Jogador" 
                        isActive={activeTab === 'adicionar'} 
                        onClick={() => setActiveTab('adicionar')} 
                    />
                    <TabButton 
                        label="Importar" 
                        isActive={activeTab === 'importar'} 
                        onClick={() => setActiveTab('importar')} 
                    />
                </>
            )}
        </nav>
    );
}

/**
 * Componente de Botão de Aba Reutilizável
 */
function TabButton({ label, isActive, onClick }) {
    const baseStyle = "py-2 px-4 font-medium text-sm rounded-md transition-colors duration-200";
    const activeStyle = "bg-blue-600 text-white shadow-sm";
    const inactiveStyle = "bg-gray-100 text-gray-700 hover:bg-gray-200";
    const className = `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`;
    
    return (
        <button className={className} onClick={onClick}>
            {label}
        </button>
    );
}


/**
 * Componente da Tela de Login Local
 */
function LoginScreen({ onAdminLogin, onGuestLogin, error }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdminLogin(username, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">Usuário</label>
                        <input 
                            type="text" 
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder={ADMIN_USER}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Senha</label>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`(Dica: ${ADMIN_PASS})`}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 transition duration-300"
                    >
                        Entrar (Admin)
                    </button>
                </form>
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">OU</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <button 
                    onClick={onGuestLogin}
                    className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-gray-700 transition duration-300"
                >
                    Entrar como Visitante
                </button>
            </div>
        </div>
    );
}

/**
 * Componente para renderizar um único jogador
 */
function PlayerCard({ player, onTogglePayment, onToggleAttendance, onDeletePlayer, isReadOnly }) {
    const { id, name, position, level, paymentStatus, attendance } = player;

    const isPaid = paymentStatus === 'paid';
    const isConfirmed = attendance === 'confirmed';
    
    const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                <p className="text-sm text-gray-600">
                    Função: <span className="font-semibold">{position}</span> | 
                    Nível: <span className="font-semibold">{level}</span>
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={() => onTogglePayment(id, paymentStatus)}
                    disabled={isReadOnly}
                    className={`py-1 px-3 rounded-full text-xs font-bold text-white transition duration-300 ${isPaid ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} ${disabledClasses}`}
                >
                    {isPaid ? 'Pago' : 'Pendente'}
                </button>
                <button
                    onClick={() => onToggleAttendance(id, attendance)}
                    disabled={isReadOnly}
                    className={`py-1 px-3 rounded-full text-xs font-bold text-white transition duration-300 ${isConfirmed ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 hover:bg-gray-500'} ${disabledClasses}`}
                >
                    {isConfirmed ? 'Confirmado' : 'Ausente'}
                </button>
                <button
                    onClick={() => onDeletePlayer(id)}
                    disabled={isReadOnly}
                    title={isReadOnly ? "Modo visitante (apenas leitura)" : "Excluir jogador"}
                    className={`py-1 px-3 rounded-full text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition duration-300 leading-none ${disabledClasses}`}
                >
                    &times;
                </button>
            </div>
        </div>
    );
}

/**
 * Componentes de Sorteio
 */
function TeamDrawResults({ teams }) {
    return (
        <div className="mt-6 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TeamColumn title="Time 1" players={teams.team1} color="bg-blue-100" />
                <TeamColumn title="Time 2" players={teams.team2} color="bg-green-100" />
                <TeamColumn title="Time 3" players={teams.team3} color="bg-yellow-100" />
                <TeamColumn title="Time 4" players={teams.team4} color="bg-red-100" />
            </div>
            
            {teams.reserves && teams.reserves.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Reservas</h3>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <ul className="flex flex-wrap gap-x-4 gap-y-1">
                            {teams.reserves.map(p => (
                                <li key={p.id} className="text-sm text-gray-800">
                                    {p.name} <span className="text-xs text-gray-500">({p.level})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

function TeamColumn({ title, players, color }) {
    // Ordena os jogadores por nível (A, B, C, D, E) para exibição
    const sortedPlayers = [...players].sort((a, b) => a.level.localeCompare(b.level));

    return (
        <div className={`${color} p-4 rounded-lg shadow-sm`}>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <ul className="space-y-2">
                {sortedPlayers.map(player => (
                    <li key={player.id} className="flex justify-between items-center bg-white p-2 rounded shadow-xs">
                        <span className="font-medium text-sm text-gray-800">{player.name}</span>
                        <span className="font-bold text-xs text-blue-700 px-2 py-0.5 bg-blue-100 rounded-full">{player.level}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}


/**
 * Componente de Loader simples
 */
function Loader({ text }) {
    return (
        <div className="text-center py-4">
            <div className="loader" style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                margin: '20px auto'
            }}></div>
            <p className="text-gray-500">{text}</p>
        </div>
    );
}

/**
 * Componente de Loader em tela cheia
 */
function FullScreenLoader({ text }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Loader text={text} />
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}