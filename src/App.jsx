import { useState, useEffect } from 'react';
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
import { getAuth, signInAnonymously } from 'firebase/auth';

// --- ÍCONES SVG (Substituindo lucide-react) ---
const Shield = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const LogOut = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
const Users = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const RefreshCw = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
);
const Upload = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const DollarSign = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const Trash2 = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);
// Ícones adicionais definidos para evitar erros caso sejam usados futuramente
const UserCheck = ({ size = 24, ...props }) => <Users size={size} {...props} />; 
const UserX = ({ size = 24, ...props }) => <Users size={size} {...props} />;
const FileText = ({ size = 24, ...props }) => <Upload size={size} {...props} />;


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
// const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? firebaseConfig.appId : 'default-app-id';

// --- ESTILOS CSS PURO (Sem Tailwind) ---
const styles = {
  app: {
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    backgroundColor: '#f0f2f5',
    minHeight: '100vh', // Garante altura total
    width: '100vw',     // Garante largura total da viewport
    color: '#333',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    overflowX: 'hidden' // Evita scroll horizontal indesejado
  },
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', // Mudado de height para minHeight para evitar cortes
    width: '100vw',     // Garante largura total
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    margin: 0,
    padding: '20px',    // Padding para evitar que o box toque as bordas em mobile
    boxSizing: 'border-box'
  },
  loginBox: {
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  btnPrimary: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  btnSecondary: {
    background: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '10px',
  },
  header: {
    background: '#1e3c72',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',      // Garante largura total
    boxSizing: 'border-box'
  },
  main: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',      // Garante que o container principal ocupe o espaço
    boxSizing: 'border-box'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  tab: (active) => ({
    padding: '10px 20px',
    background: active ? '#1e3c72' : 'white',
    color: active ? 'white' : '#333',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: active ? 'bold' : 'normal',
  }),
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    width: '100%',     // Garante largura dentro do container
    boxSizing: 'border-box'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #eee',
    color: '#666',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  badge: (type, value) => {
    let bg = '#eee';
    let color = '#333';
    
    if (type === 'level') {
      if (value === 'A') bg = '#d4edda'; color = '#155724';
      if (value === 'B') bg = '#cce5ff'; color = '#004085';
      if (value === 'C') bg = '#fff3cd'; color = '#856404';
      if (value === 'D') bg = '#f8d7da'; color = '#721c24';
      if (value === 'E') bg = '#e2e3e5'; color = '#383d41';
    }
    
    if (type === 'paid') {
      bg = value ? '#d4edda' : '#f8d7da';
      color = value ? '#155724' : '#721c24';
    }

    if (type === 'confirmed') {
        bg = value ? '#c3e6cb' : '#f5c6cb';
        color = value ? '#155724' : '#721c24';
    }

    return {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      backgroundColor: bg,
      color: color,
      display: 'inline-block',
      textAlign: 'center',
      minWidth: '25px'
    };
  },
  gridTeams: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  teamCard: {
    background: 'white',
    borderTop: '4px solid #1e3c72',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    marginRight: '5px',
  },
  textArea: {
    width: '100%',
    height: '150px',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  }
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [user, setUser] = useState(null); // null, 'admin', 'guest'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentTab, setCurrentTab] = useState('players'); // players, draw, import
  const [teams, setTeams] = useState([]);
  
  // Form states
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPos, setNewPlayerPos] = useState('Meio');
  const [newPlayerLevel, setNewPlayerLevel] = useState('C');
  const [importText, setImportText] = useState('');

  // --- AUTH INICIAL (ANÔNIMO FIREBASE PARA DADOS) ---
  useEffect(() => {
    const init = async () => {
      await signInAnonymously(auth);
    };
    init();
  }, []);

  // --- CARREGAR DADOS DO FIRESTORE ---
  useEffect(() => {
    // Usando caminho public/data para que todos vejam os mesmos dados
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'soccer_players'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedPlayers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Ordenar localmente por nome
      loadedPlayers.sort((a, b) => a.name.localeCompare(b.name));
      setPlayers(loadedPlayers);
    }, (error) => {
      console.error("Erro ao carregar jogadores:", error);
    });
    return () => unsubscribe();
  }, []);

  // --- FUNÇÕES DE AÇÃO (FIRESTORE) ---
  
  const addPlayer = async (name, position, level) => {
    if (!name) return;
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
      alert("Erro ao adicionar" + " jogador: " + e.message);
    }
  };

  const updatePlayerStatus = async (id, field, currentValue) => {
    if (user !== 'admin') return;
    const ref = doc(db, 'artifacts', appId, 'public', 'data', 'soccer_players', id);
    await updateDoc(ref, { [field]: !currentValue });
  };

  const deletePlayer = async (id) => {
    if (user !== 'admin') return;
    if (window.confirm('Tem certeza que deseja remover este jogador?')) {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'soccer_players', id));
    }
  };

  const handleBulkImport = async () => {
    if (!importText) return;
    const lines = importText.split('\n');
    let count = 0;
    for (let line of lines) {
      // Formato: Nome|Posição|Nivel
      const parts = line.split('|');
      if (parts.length >= 3) {
        await addPlayer(parts[0].trim(), parts[1].trim(), parts[2].trim().toUpperCase());
        count++;
      }
    }
    alert(`${count} jogadores importados!`);
    setImportText('');
    setCurrentTab('players');
  };

  // --- LÓGICA DE SORTEIO ---
  const generateTeams = () => {
    const confirmedPlayers = players.filter(p => p.confirmed);
    
    if (confirmedPlayers.length < 4) {
      alert("Precisa de pelo menos 4 jogadores confirmados para gerar times.");
      return;
    }

    // Agrupar por nível
    const byLevel = { A: [], B: [], C: [], D: [], E: [] };
    confirmedPlayers.forEach(p => {
      if (byLevel[p.level]) byLevel[p.level].push(p);
      else byLevel['C'].push(p); // Fallback
    });

    // Embaralhar cada nível
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    Object.keys(byLevel).forEach(k => shuffle(byLevel[k]));

    // Criar 4 times
    const newTeams = [[], [], [], []];
    let teamIndex = 0;

    // Distribuir snake draft ou round-robin por nível (A -> B -> C -> D -> E)
    // A ordem dos níveis garante que cada time pegue 1 A, depois 1 B, etc.
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

  // --- HANDLERS DE UI ---
  const handleLogin = (e) => {
    e.preventDefault();
    // Senha HARDCODED "cozida" como solicitado
    if (username === 'admin' && password === 'admin123') {
      setUser('admin');
    } else {
      alert('Credenciais inválidas');
    }
  };

  const handleGuestLogin = () => {
    setUser('guest');
  };

  // --- TELAS ---

  if (!user) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h2 style={{color: '#1e3c72', marginBottom: '20px'}}>⚽ FutManager</h2>
          <p style={{color: '#666', marginBottom: '20px'}}>Gerenciamento de Time</p>
          
          <form onSubmit={handleLogin}>
            <input 
              style={styles.input} 
              placeholder="Usuário (admin)" 
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input 
              style={styles.input} 
              type="password" 
              placeholder="Senha" 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" style={styles.btnPrimary}>Entrar como Admin</button>
          </form>
          
          <div style={{margin: '15px 0', borderTop: '1px solid #eee'}}></div>
          
          <button onClick={handleGuestLogin} style={styles.btnSecondary}>
            Acessar como Visitante
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <Shield size={24} />
          <h1 style={{margin: 0, fontSize: '1.5rem'}}>FutManager</h1>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <span>Olá, <strong>{user === 'admin' ? 'Administrador' : 'Visitante'}</strong></span>
          <button 
            onClick={() => setUser(null)} 
            style={{...styles.actionBtn, color: 'white', display: 'flex', alignItems: 'center', gap: '5px'}}
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </header>

      <main style={styles.main}>
        
        {/* Abas de Navegação */}
        <div style={styles.tabs}>
          <button style={styles.tab(currentTab === 'players')} onClick={() => setCurrentTab('players')}>
            <Users size={16} style={{marginRight: 5}}/> Jogadores ({players.length})
          </button>
          <button style={styles.tab(currentTab === 'draw')} onClick={() => setCurrentTab('draw')}>
            <RefreshCw size={16} style={{marginRight: 5}}/> Sorteio de Times
          </button>
          {user === 'admin' && (
            <button style={styles.tab(currentTab === 'import')} onClick={() => setCurrentTab('import')}>
              <Upload size={16} style={{marginRight: 5}}/> Importar TXT
            </button>
          )}
        </div>

        {/* CONTEÚDO: LISTA DE JOGADORES */}
        {currentTab === 'players' && (
          <div style={styles.card}>
            {user === 'admin' && (
              <div style={{marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '15px', background: '#f8f9fa', borderRadius: '5px'}}>
                <input 
                  style={{...styles.input, width: 'auto', flex: 2, margin: 0}} 
                  placeholder="Nome do Jogador"
                  value={newPlayerName}
                  onChange={e => setNewPlayerName(e.target.value)}
                />
                <select 
                  style={{...styles.input, width: 'auto', flex: 1, margin: 0}} 
                  value={newPlayerPos}
                  onChange={e => setNewPlayerPos(e.target.value)}
                >
                  <option>Ataque</option>
                  <option>Meio</option>
                  <option>Defesa</option>
                  <option>Goleiro</option>
                </select>
                <select 
                  style={{...styles.input, width: 'auto', flex: 1, margin: 0}} 
                  value={newPlayerLevel}
                  onChange={e => setNewPlayerLevel(e.target.value)}
                >
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                  <option>E</option>
                </select>
                <button 
                  style={{...styles.btnPrimary, width: 'auto', marginTop: 0, background: '#1e3c72'}}
                  onClick={() => {
                    addPlayer(newPlayerName, newPlayerPos, newPlayerLevel);
                    setNewPlayerName('');
                  }}
                >
                  Adicionar
                </button>
              </div>
            )}

            <div style={{overflowX: 'auto'}}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nome</th>
                    <th style={styles.th}>Posição</th>
                    <th style={styles.th}>Nível</th>
                    <th style={styles.th}>Pagamento</th>
                    <th style={styles.th}>Presença</th>
                    {user === 'admin' && <th style={styles.th}>Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {players.map(player => (
                    <tr key={player.id}>
                      <td style={styles.td}><strong>{player.name}</strong></td>
                      <td style={styles.td}>{player.position}</td>
                      <td style={styles.td}>
                        <span style={styles.badge('level', player.level)}>{player.level}</span>
                      </td>
                      <td style={styles.td}>
                        <div 
                          onClick={() => updatePlayerStatus(player.id, 'paid', player.paid)}
                          style={{
                            cursor: user === 'admin' ? 'pointer' : 'default',
                            opacity: player.paid ? 1 : 0.5,
                            display: 'flex', alignItems: 'center', gap: '5px'
                          }}
                        >
                          <DollarSign size={18} color={player.paid ? 'green' : 'red'} />
                          {player.paid ? 'Pago' : 'Pendente'}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div 
                          onClick={() => updatePlayerStatus(player.id, 'confirmed', player.confirmed)}
                          style={{
                            cursor: user === 'admin' ? 'pointer' : 'default',
                            ...styles.badge('confirmed', player.confirmed)
                          }}
                        >
                           {player.confirmed ? 'Confirmado' : 'Ausente'}
                        </div>
                      </td>
                      {user === 'admin' && (
                        <td style={styles.td}>
                          <button style={{...styles.actionBtn, color: '#dc3545'}} onClick={() => deletePlayer(player.id)}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {players.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{textAlign: 'center', padding: '20px', color: '#999'}}>
                        Nenhum jogador cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTEÚDO: SORTEIO */}
        {currentTab === 'draw' && (
          <div>
             <div style={styles.card}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                 <h3>Jogadores Confirmados: {players.filter(p => p.confirmed).length}</h3>
                 {user === 'admin' && (
                   <button style={{...styles.btnPrimary, width: 'auto', marginTop: 0}} onClick={generateTeams}>
                     Sortear 4 Times
                   </button>
                 )}
               </div>
               <p style={{color: '#666', fontSize: '14px'}}>
                 O sistema irá distribuir os jogadores confirmados tentando colocar 1 de cada nível (A,B,C,D,E) em cada time.
               </p>
             </div>

             {teams.length > 0 && (
               <div style={styles.gridTeams}>
                 {teams.map((team, idx) => (
                   <div key={idx} style={styles.teamCard}>
                     <h3 style={{margin: '0 0 10px 0', color: '#1e3c72'}}>Time {idx + 1}</h3>
                     <ul style={{listStyle: 'none', padding: 0}}>
                       {team.map(p => (
                         <li key={p.id} style={{borderBottom: '1px solid #eee', padding: '8px 0', display: 'flex', justifyContent: 'space-between'}}>
                           <span>{p.name} <small>({p.position})</small></span>
                           <span style={styles.badge('level', p.level)}>{p.level}</span>
                         </li>
                       ))}
                     </ul>
                     <div style={{marginTop: '10px', fontSize: '12px', color: '#666', textAlign: 'right'}}>
                       Total: {team.length} jogadores
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* CONTEÚDO: IMPORTAÇÃO */}
        {currentTab === 'import' && user === 'admin' && (
          <div style={styles.card}>
            <h3>Importar Jogadores em Massa</h3>
            <p>Cole a lista abaixo no formato: <code>Nome|Posição|Nível</code> (um por linha)</p>
            <p style={{fontSize: '12px', color: '#666'}}>Exemplo: <br/>João Silva|Ataque|A<br/>Pedro Santos|Defesa|C</p>
            
            <textarea 
              style={styles.textArea}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Cole aqui..."
            />
            
            <button style={{...styles.btnPrimary, background: '#17a2b8'}} onClick={handleBulkImport}>
              Processar Importação
            </button>
          </div>
        )}

      </main>
    </div>
  );
}