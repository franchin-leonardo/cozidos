/* eslint-disable react-hooks/static-components */
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  serverTimestamp
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';

// --- ÍCONES SVG (Mantidos) ---
const Shield = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const LogOut = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
const Users = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const RefreshCw = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
);
const Upload = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const DollarSign = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const Trash2 = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);

const firebaseConfig = {
  apiKey: "AIzaSyBIJBGFdDPr-p4_gVHsLJOv5cIOwSMbB1g",
  authDomain: "cozidos-3f892.firebaseapp.com",
  projectId: "cozidos-3f892",
  storageBucket: "cozidos-3f892.firebasestorage.app",
  messagingSenderId: "57001878936",
  appId: "1:57001878936:web:26bb7b54624697e95bf7ed",
  measurementId: "G-DLZ5T8MXPG"
};

// --- CONFIGURAÇÃO FIREBASE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? firebaseConfig.appId : 'default-app-id';

// --- HELPERS DE ESTILO (TAILWIND) ---
const getLevelBadgeClass = (level) => {
  switch(level) {
    case 'A': return 'bg-green-100 text-green-800 border border-green-200';
    case 'B': return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'C': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'D': return 'bg-orange-100 text-orange-800 border border-orange-200';
    case 'E': return 'bg-gray-100 text-gray-800 border border-gray-200';
    default: return 'bg-gray-50 text-gray-500';
  }
};

const getConfirmedBadgeClass = (isConfirmed) => {
  return isConfirmed 
    ? 'bg-green-500 text-white shadow-sm' 
    : 'bg-red-100 text-red-600 border border-red-200';
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [user, setUser] = useState(null); 
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentTab, setCurrentTab] = useState('players');
  const [teams, setTeams] = useState([]);
  
  // Form states
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPos, setNewPlayerPos] = useState('Meio');
  const [newPlayerLevel, setNewPlayerLevel] = useState('C');
  const [importText, setImportText] = useState('');

  // --- AUTH INICIAL ---
  useEffect(() => {
    const initAuth = async () => {
      // if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      //   await signInWithCustomToken(auth, __initial_auth_token);
      // } else {
        await signInAnonymously(auth);
      // }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // --- CARREGAR DADOS ---
  useEffect(() => {
    if (!firebaseUser) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'soccer_players'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedPlayers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      loadedPlayers.sort((a, b) => a.name.localeCompare(b.name));
      setPlayers(loadedPlayers);
    }, (error) => {
      console.error("Erro ao carregar jogadores:", error);
    });
    return () => unsubscribe();
  }, [firebaseUser]);

  // --- FUNÇÕES FIRESTORE ---
  const addPlayer = async (name, position, level) => {
    if (!name || !firebaseUser) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'soccer_players'), {
        name,
        position,
        level,
        paid: false,
        confirmed: false,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error(e);
      alert("Erro ao adicionar jogador.");
    }
  };

  const updatePlayerStatus = async (id, field, currentValue) => {
    if (user !== 'admin' || !firebaseUser) return;
    const ref = doc(db, 'artifacts', appId, 'public', 'data', 'soccer_players', id);
    await updateDoc(ref, { [field]: !currentValue });
  };

  const deletePlayer = async (id) => {
    if (user !== 'admin' || !firebaseUser) return;
    if (window.confirm('Tem certeza que deseja remover este jogador?')) {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'soccer_players', id));
    }
  };

  // --- IMPORTAÇÃO ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleBulkImport = async () => {
    if (!importText) return;
    const lines = importText.split(/\r?\n/);
    let count = 0;
    for (const line of lines) {
      const cleanLine = line.trim();
      if (!cleanLine) continue; 
      const parts = cleanLine.split('|');
      if (parts.length >= 3) {
        const name = parts[0].trim();
        const position = parts[1].trim();
        const level = parts[2].trim().toUpperCase();
        if (name) {
            await addPlayer(name, position, level);
            count++;
        }
      }
    }
    alert(`${count} jogadores importados!`);
    setImportText('');
    setCurrentTab('players');
  };

  // --- SORTEIO ---
  const generateTeams = () => {
    const confirmedPlayers = players.filter(p => p.confirmed);
    if (confirmedPlayers.length < 4) {
      alert("Precisa de pelo menos 4 jogadores confirmados para gerar times.");
      return;
    }

    const byLevel = { A: [], B: [], C: [], D: [], E: [] };
    confirmedPlayers.forEach(p => {
      if (byLevel[p.level]) byLevel[p.level].push(p);
      else byLevel['C'].push(p);
    });

    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    Object.keys(byLevel).forEach(k => shuffle(byLevel[k]));

    const newTeams = [[], [], [], []];
    let teamIndex = 0;
    const levels = ['A', 'B', 'C', 'D', 'E'];
    
    levels.forEach(lvl => {
      const levelPlayers = byLevel[lvl];
      levelPlayers.forEach(player => {
        newTeams[teamIndex].push(player);
        teamIndex = (teamIndex + 1) % 4;
      });
    });
    setTeams(newTeams);
  };

  // --- LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setUser('admin');
    } else {
      alert('Credenciais inválidas');
    }
  };

  const handleGuestLogin = () => {
    setUser('guest');
  };

  // ESTILO GLOBAL PARA RESETAR MARGENS E GARANTIR FULL HEIGHT
  const GlobalStyle = () => (
    <style>{`
      html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
        width: 100%;
        overflow-x: hidden;
      }
    `}</style>
  );

  // --- TELA DE LOGIN ---
  if (!user) {
    return (
      <>
        <GlobalStyle />
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center transform transition-all hover:scale-105 duration-300">
            <div className="mb-6 flex justify-center">
               <div className="bg-blue-100 p-3 rounded-full">
                  <Shield size={48} className="text-blue-900" />
               </div>
            </div>
            <h2 className="text-3xl font-bold text-blue-900 mb-2">FutManager</h2>
            <p className="text-gray-500 mb-8">Gerenciamento profissional de peladas</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Usuário (admin)" 
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                type="password" 
                placeholder="Senha" 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md transition transform hover:-translate-y-1">
                Entrar como Admin
              </button>
            </form>
            
            <div className="my-6 border-t border-gray-200"></div>
            
            <button onClick={handleGuestLogin} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition">
              Acessar como Visitante
            </button>
          </div>
        </div>
      </>
    );
  }

  // --- TELA PRINCIPAL ---
  return (
    <>
      <GlobalStyle />
      <div className="min-h-screen w-full flex flex-col bg-gray-100 font-sans text-gray-800">
        {/* Header */}
        <header className="bg-blue-900 text-white shadow-lg flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Shield size={32} className="text-yellow-400" />
              <h1 className="text-2xl font-bold tracking-tight">FutManager</h1>
            </div>
            <div className="flex items-center gap-6 bg-blue-800/50 px-4 py-2 rounded-full">
              <span className="text-sm md:text-base">
                Olá, <strong className="text-yellow-300">{user === 'admin' ? 'Administrador' : 'Visitante'}</strong>
              </span>
              <button 
                onClick={() => setUser(null)} 
                className="flex items-center gap-2 text-white hover:text-red-300 transition"
              >
                <LogOut size={18} /> Sair
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto p-4 md:p-8 w-full">
          
          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-1">
            {[
              { id: 'players', label: `Jogadores (${players.length})`, icon: Users },
              { id: 'draw', label: 'Sorteio', icon: RefreshCw },
              ...(user === 'admin' ? [{ id: 'import', label: 'Importar', icon: Upload }] : [])
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all font-medium text-sm md:text-base
                  ${currentTab === tab.id 
                    ? 'bg-white text-blue-900 border-t-2 border-blue-900 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]' 
                    : 'text-gray-500 hover:text-blue-700 hover:bg-white/50'}
                `}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>

          {/* ABA JOGADORES */}
          {currentTab === 'players' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {user === 'admin' && (
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Jogador</label>
                      <input 
                        className="w-full px-4 py-2 rounded border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Ex: Ronaldinho Gaúcho"
                        value={newPlayerName}
                        onChange={e => setNewPlayerName(e.target.value)}
                      />
                    </div>
                    <div className="w-full md:w-48">
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Posição</label>
                      <select 
                        className="w-full px-4 py-2 rounded border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newPlayerPos}
                        onChange={e => setNewPlayerPos(e.target.value)}
                      >
                        <option>Ataque</option>
                        <option>Meio</option>
                        <option>Defesa</option>
                        <option>Goleiro</option>
                      </select>
                    </div>
                    <div className="w-full md:w-24">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nível</label>
                      <select 
                        className="w-full px-4 py-2 rounded border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newPlayerLevel}
                        onChange={e => setNewPlayerLevel(e.target.value)}
                      >
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                        <option>D</option>
                        <option>E</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button 
                        className="w-full md:w-auto bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded shadow transition flex items-center justify-center gap-2 h-[42px]"
                        onClick={() => {
                          addPlayer(newPlayerName, newPlayerPos, newPlayerLevel);
                          setNewPlayerName('');
                        }}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
                      <th className="p-4 font-semibold">Nome</th>
                      <th className="p-4 font-semibold">Posição</th>
                      <th className="p-4 font-semibold text-center">Nível</th>
                      <th className="p-4 font-semibold">Pagamento</th>
                      <th className="p-4 font-semibold text-center">Presença</th>
                      {user === 'admin' && <th className="p-4 font-semibold text-right">Ações</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {players.map(player => (
                      <tr key={player.id} className="hover:bg-blue-50/30 transition duration-150">
                        <td className="p-4 font-medium text-gray-900">{player.name}</td>
                        <td className="p-4 text-gray-600">{player.position}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-bold w-8 ${getLevelBadgeClass(player.level)}`}>
                            {player.level}
                          </span>
                        </td>
                        <td className="p-4">
                          <div 
                            onClick={() => updatePlayerStatus(player.id, 'paid', player.paid)}
                            className={`
                              flex items-center gap-2 text-sm font-medium select-none
                              ${user === 'admin' ? 'cursor-pointer hover:opacity-80' : ''}
                              ${player.paid ? 'text-green-700' : 'text-red-500'}
                            `}
                          >
                            <div className={`p-1 rounded-full ${player.paid ? 'bg-green-100' : 'bg-red-100'}`}>
                              <DollarSign size={14} />
                            </div>
                            {player.paid ? 'Pago' : 'Pendente'}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                           <button
                            onClick={() => updatePlayerStatus(player.id, 'confirmed', player.confirmed)}
                            disabled={user !== 'admin'}
                            className={`
                              px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all
                              ${user === 'admin' ? 'hover:shadow-md' : 'cursor-default'}
                              ${getConfirmedBadgeClass(player.confirmed)}
                            `}
                          >
                             {player.confirmed ? 'CONFIRMADO' : 'AUSENTE'}
                          </button>
                        </td>
                        {user === 'admin' && (
                          <td className="p-4 text-right">
                            <button 
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition" 
                              onClick={() => deletePlayer(player.id)}
                              title="Remover Jogador"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {players.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-12 text-center text-gray-400 italic">
                          Nenhum jogador na lista. Adicione alguém acima!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABA SORTEIO */}
          {currentTab === 'draw' && (
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-900 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div>
                   <h3 className="text-lg font-bold text-gray-900">
                      Jogadores Confirmados: <span className="text-blue-600 text-2xl">{players.filter(p => p.confirmed).length}</span>
                   </h3>
                   <p className="text-gray-500 text-sm mt-1">
                     O algoritmo distribui equitativamente os níveis (A-E) entre os times.
                   </p>
                 </div>
                 {user === 'admin' && (
                   <button 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition flex items-center gap-2" 
                    onClick={generateTeams}
                   >
                     <RefreshCw size={20} /> Sortear Equipes
                   </button>
                 )}
               </div>

               {teams.length > 0 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                   {teams.map((team, idx) => (
                     <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
                       <div className="bg-blue-900 p-4 flex justify-between items-center">
                          <h3 className="text-white font-bold text-lg">Time {idx + 1}</h3>
                          <span className="text-blue-200 text-xs font-mono bg-blue-800 px-2 py-1 rounded">
                            {team.length} JOG
                          </span>
                       </div>
                       <div className="p-4 flex-grow">
                         <ul className="space-y-2">
                           {team.map(p => (
                             <li key={p.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border-b border-gray-100 last:border-0">
                               <div className="flex flex-col">
                                 <span className="font-semibold text-gray-800 text-sm">{p.name}</span>
                                 <span className="text-xs text-gray-500">{p.position}</span>
                               </div>
                               <span className={`text-xs font-bold px-2 py-1 rounded ${getLevelBadgeClass(p.level)}`}>
                                 {p.level}
                               </span>
                             </li>
                           ))}
                         </ul>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}

          {/* ABA IMPORTAÇÃO */}
          {currentTab === 'import' && user === 'admin' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Upload className="text-blue-600" size={24} /> Importar Jogadores
                </h3>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 text-sm mb-2">Formato do Arquivo:</h4>
                  <code className="block bg-white border border-blue-200 p-3 rounded text-xs text-gray-600 font-mono">
                    Nome|Posição|Nível<br/>
                    João Silva|Ataque|A<br/>
                    Pedro Santos|Defesa|C
                  </code>
                </div>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition relative group">
                    <input 
                      type="file" 
                      accept=".txt" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto text-gray-400 mb-2 group-hover:text-blue-500 transition" size={32} />
                    <p className="text-sm font-medium text-gray-600">Clique para enviar o arquivo .txt</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -top-3 left-3 bg-white px-2 text-xs font-bold text-gray-500">Ou cole o texto aqui</span>
                    <textarea 
                      className="w-full h-40 p-4 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                      value={importText}
                      onChange={e => setImportText(e.target.value)}
                      placeholder="Cole os dados aqui..."
                    />
                  </div>
                  
                  <button 
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg shadow transition flex justify-center items-center gap-2" 
                    onClick={handleBulkImport}
                  >
                    Processar Importação
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}