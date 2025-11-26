/* eslint-disable react-hooks/static-components */
import { useState, useEffect } from 'react';
import shieldSvg from './assets/shield.svg';
import { addMultiplePlayersToFirebase, loadPlayersFromFirebase, updatePlayerStatus, deletePlayerFromFirebase } from './firebase';


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

const Play = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="5 3 19 12 5 21 5 3"/></svg>
);

const CheckCircle = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const Shield = ({ size = 24, className = "", ...props }) => (
  <img src={shieldSvg} alt="shield" width={size} height={size} className={className} {...props} />
);

const X = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const AlertCircle = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

// --- COMPONENTE TOAST ---
const Toast = ({ type = 'success', message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  }[type] || 'bg-blue-500';

  const icon = type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />;

  return (
    <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse`}>
      {icon}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto hover:opacity-80">
        <X size={18} />
      </button>
    </div>
  );
};

// --- HELPERS DE ESTILO ---
const getLevelBadgeClass = (level) => {
  switch(level) {
    case 'A': return 'bg-green-100 text-green-800 border border-green-200';
    case 'B': return 'bg-blue-100 text-blue-800 border border-blue-200'; // Mantido azul para contraste de nível
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

// --- CONSTANTES DE TIMES ---
const TEAM_NAMES = ['Branco', 'Preto', 'Azul', 'Laranja'];

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [user, setUser] = useState(null); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [players, setPlayers] = useState([]);
  
  const [currentTab, setCurrentTab] = useState('players');
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teamsLocked, setTeamsLocked] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState({}); // { playerId: { points, goals, assists, cleanSheets } }
  const [finishedRounds, setFinishedRounds] = useState(0);
  
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPos, setNewPlayerPos] = useState('Meio');
  const [newPlayerLevel, setNewPlayerLevel] = useState('C');
  const [importText, setImportText] = useState('');
  
  const [toasts, setToasts] = useState([]);

  // --- FUNÇÃO DE TOAST ---
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- CARREGAMENTO DE DADOS DO FIREBASE ---
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const fbPlayers = await loadPlayersFromFirebase();
        if (fbPlayers && fbPlayers.length > 0) {
          setPlayers(fbPlayers.sort((a, b) => a.name.localeCompare(b.name)));
          console.log('Jogadores carregados do Firebase:', fbPlayers.length);
        }
      } catch (error) {
        console.error('Erro ao carregar jogadores:', error);
      }
    };
    
    loadPlayers();
  }, []);

  // --- FUNÇÕES DE GERENCIAMENTO DE ESTADO (LOCAL) ---
  
  const addPlayer = (name, position, level) => {
    if (!name) return;
    const newPlayer = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), 
      name,
      position,
      level,
      paid: false,
      confirmed: false,
      createdAt: new Date()
    };
    
    setPlayers(prev => {
      const updated = [...prev, newPlayer];
      return updated.sort((a, b) => a.name.localeCompare(b.name));
    });
  };

  const updatePlayerStatusLocal = (id, field, currentValue) => {
    if (user !== 'admin') return;
    const newValue = !currentValue;
    
    setPlayers(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: newValue } : p
    ));
    
    // Salvar no Firebase
    updatePlayerStatus(id, field, newValue).catch(error => {
      console.error('Erro ao salvar status:', error);
      // Reverter em caso de erro
      setPlayers(prev => prev.map(p => 
        p.id === id ? { ...p, [field]: currentValue } : p
      ));
    });
  };

  const deletePlayerLocal = (id) => {
    if (user !== 'admin') return;
    if (window.confirm('Tem certeza que deseja remover este jogador?')) {
      setPlayers(prev => prev.filter(p => p.id !== id));
      
      // Deletar do Firebase
      deletePlayerFromFirebase(id).catch(error => {
        console.error('Erro ao deletar jogador:', error);
        // Se falhar, recarregar lista
        loadPlayersFromFirebase().then(fbPlayers => {
          if (fbPlayers && fbPlayers.length > 0) {
            setPlayers(fbPlayers.sort((a, b) => a.name.localeCompare(b.name)));
          }
        });
      });
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
    
    const lines = importText.split(/\r\n|\n|\r/);
    const newPlayersToAdd = [];
    let validCount = 0;
    
    for (const line of lines) {
      const cleanLine = line.trim();
      if (!cleanLine) continue; 

      const parts = cleanLine.split('|');
      if (parts.length >= 3) {
        const name = parts[0].trim();
        const position = parts[1].trim();
        const level = parts[2].trim().toUpperCase();

        if (name) {
            newPlayersToAdd.push({
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + validCount,
              name,
              position,
              level,
              paid: false,
              confirmed: true,
              createdAt: new Date()
            });
            validCount++;
        }
      }
    }

    if (validCount > 0) {
      try {
        // Salvar no Firebase
        const savedPlayers = await addMultiplePlayersToFirebase(newPlayersToAdd);
        
        // Atualizar estado local
        setPlayers(prev => {
          const updated = [...prev, ...savedPlayers];
          return updated.sort((a, b) => a.name.localeCompare(b.name));
        });
        
        showToast(`${validCount} jogadores adicionados com sucesso!`, 'success');
        setImportText('');
        setCurrentTab('players');
      } catch (error) {
        showToast('Erro ao importar jogadores: ' + error.message, 'error');
      }
    } else {
      showToast('Nenhuma linha válida encontrada. Verifique o formato: Nome|Posição|Nivel', 'warning');
    }
  };

  // --- SORTEIO ---
  const generateTeams = () => {
    const confirmedPlayers = players.filter(p => p.confirmed);
    if (confirmedPlayers.length < 4) {
      showToast("Precisa de pelo menos 4 jogadores confirmados para gerar times.", 'warning');
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

  // Função para criar match com estrutura de gols e assistências
  const createMatch = (id, teamA, teamAIndex, teamB, teamBIndex, round) => ({
    id,
    teamA,
    teamB,
    teamAIndex,
    teamBIndex,
    scoreA: 0,
    scoreB: 0,
    goalsA: [], // [{player: '', assistBy: ''}, ...]
    goalsB: [],
    finished: false,
    round
  });

  const generateMatches = () => {
    if (teams.length !== 4) {
      showToast("Antes sorteie os times!", 'warning');
      return;
    }

    const newMatches = [
      // Rodada 1: A vs B, C vs D
      createMatch(1, teams[0], 0, teams[1], 1, 1),
      createMatch(2, teams[2], 2, teams[3], 3, 1),
      // Rodada 2: A vs C, B vs D
      createMatch(3, teams[0], 0, teams[2], 2, 2),
      createMatch(4, teams[1], 1, teams[3], 3, 2),
      // Rodada 3: A vs D, B vs C
      createMatch(5, teams[0], 0, teams[3], 3, 3),
      createMatch(6, teams[1], 1, teams[2], 2, 3),
      // Rodada 4: B vs A, D vs C (reversos)
      createMatch(7, teams[1], 1, teams[0], 0, 4),
      createMatch(8, teams[3], 3, teams[2], 2, 4),
      // Rodada 5: C vs A, D vs B (reverso)
      createMatch(9, teams[2], 2, teams[0], 0, 5),
      createMatch(10, teams[3], 3, teams[1], 1, 5),
      // Rodada 6: D vs A, C vs B (reverso)
      createMatch(11, teams[3], 3, teams[0], 0, 6),
      createMatch(12, teams[2], 2, teams[1], 1, 6)
    ];

    setMatches(newMatches);
  };

  // --- DRAG AND DROP DE JOGADORES ENTRE TIMES ---
  const handleDragStart = (e, player, fromTeamIdx) => {
    if (teamsLocked) {
      e.preventDefault();
      return;
    }
    setDraggedPlayer({ player, fromTeamIdx });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    if (teamsLocked) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, toTeamIdx) => {
    if (teamsLocked) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    
    if (!draggedPlayer) return;
    
    const { player, fromTeamIdx } = draggedPlayer;
    
    // Se for o mesmo time, não faz nada
    if (fromTeamIdx === toTeamIdx) {
      setDraggedPlayer(null);
      return;
    }
    
    // Atualiza os times
    const newTeams = teams.map((team, idx) => {
      if (idx === fromTeamIdx) {
        return team.filter(p => p.id !== player.id);
      }
      if (idx === toTeamIdx) {
        return [...team, player];
      }
      return team;
    });
    
    // Ordena cada time por nível (A-E)
    const levelOrder = { A: 1, B: 2, C: 3, D: 4, E: 5 };
    const sortedTeams = newTeams.map(team => 
      [...team].sort((a, b) => {
        const levelDiff = (levelOrder[a.level] || 6) - (levelOrder[b.level] || 6);
        if (levelDiff !== 0) return levelDiff;
        // Se mesmo nível, ordena por nome
        return a.name.localeCompare(b.name);
      })
    );
    
    setTeams(sortedTeams);
    setDraggedPlayer(null);
  };

  const toggleTeamsLock = () => {
    if (teams.length === 0) {
      showToast('Sorteie os times primeiro!', 'warning');
      return;
    }
    setTeamsLocked(!teamsLocked);
  };

  const toggleMatchFinished = (matchId) => {
    if (user !== 'admin') return;
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, finished: !match.finished }
        : match
    ));
  };

  const addGoal = (matchId, teamSide, playerName, assistBy = '') => {
    if (user !== 'admin') return;
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { 
            ...match, 
            [teamSide === 'A' ? 'goalsA' : 'goalsB']: [
              ...(teamSide === 'A' ? match.goalsA : match.goalsB),
              { player: playerName, assistBy }
            ],
            [teamSide === 'A' ? 'scoreA' : 'scoreB']: (teamSide === 'A' ? match.scoreA : match.scoreB) + 1
          }
        : match
    ));
  };

  const removeGoal = (matchId, teamSide, goalIndex) => {
    if (user !== 'admin') return;
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { 
            ...match, 
            [teamSide === 'A' ? 'goalsA' : 'goalsB']: (teamSide === 'A' ? match.goalsA : match.goalsB).filter((_, idx) => idx !== goalIndex),
            [teamSide === 'A' ? 'scoreA' : 'scoreB']: Math.max(0, (teamSide === 'A' ? match.scoreA : match.scoreB) - 1)
          }
        : match
    ));
  };

  // --- FINALIZAÇÃO DE TODOS OS JOGOS E PONTUAÇÃO ---
  const finishAllMatches = () => {
    if (!matches.every(m => m.finished)) {
      showToast('Todos os jogos devem estar finalizados!', 'warning');
      return;
    }

    const newStats = { ...playerStats };

    matches.forEach(match => {
      const scoreA = match.scoreA;
      const scoreB = match.scoreB;

      // Determinar resultado
      let pointsA = 0, pointsB = 0;
      if (scoreA > scoreB) {
        pointsA = 3; // Vitória A
      } else if (scoreB > scoreA) {
        pointsB = 3; // Vitória B
      } else {
        pointsA = 1; // Empate
        pointsB = 1;
      }

      // Gols (1 ponto por gol)
      pointsA += scoreA;
      pointsB += scoreB;

      // Clean sheet (+2 pontos)
      if (scoreA === 0) pointsB += 2;
      if (scoreB === 0) pointsA += 2;

      // Adicionar pontos aos jogadores
      match.teamA.forEach(player => {
        if (!newStats[player.id]) {
          newStats[player.id] = { 
            name: player.name, 
            points: 0, 
            goals: 0, 
            assists: 0, 
            cleanSheets: 0,
            matches: 0
          };
        }
        newStats[player.id].points += pointsA;
        newStats[player.id].matches += 1;
      });

      match.teamB.forEach(player => {
        if (!newStats[player.id]) {
          newStats[player.id] = { 
            name: player.name, 
            points: 0, 
            goals: 0, 
            assists: 0, 
            cleanSheets: 0,
            matches: 0
          };
        }
        newStats[player.id].points += pointsB;
        newStats[player.id].matches += 1;
      });

      // Contar gols e assistências
      match.goalsA.forEach(goal => {
        const scorer = match.teamA.find(p => p.name === goal.player);
        if (scorer && newStats[scorer.id]) {
          newStats[scorer.id].goals += 1;
        }
        if (goal.assistBy) {
          const assister = match.teamA.find(p => p.name === goal.assistBy);
          if (assister && newStats[assister.id]) {
            newStats[assister.id].assists += 1;
          }
        }
      });

      match.goalsB.forEach(goal => {
        const scorer = match.teamB.find(p => p.name === goal.player);
        if (scorer && newStats[scorer.id]) {
          newStats[scorer.id].goals += 1;
        }
        if (goal.assistBy) {
          const assister = match.teamB.find(p => p.name === goal.assistBy);
          if (assister && newStats[assister.id]) {
            newStats[assister.id].assists += 1;
          }
        }
      });

      // Clean sheets
      if (scoreB === 0) {
        match.teamA.forEach(player => {
          if (newStats[player.id]) newStats[player.id].cleanSheets += 1;
        });
      }
      if (scoreA === 0) {
        match.teamB.forEach(player => {
          if (newStats[player.id]) newStats[player.id].cleanSheets += 1;
        });
      }
    });

    setPlayerStats(newStats);
    setFinishedRounds(matches.length);
    showToast(`Todos os jogos finalizados! Pontuação atualizada.`, 'success');
  };

  // --- LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setUser('admin');
    } else {
      showToast('Credenciais inválidas', 'error');
    }
  };

  const handleGuestLogin = () => {
    setUser('guest');
  };

  // ESTILO GLOBAL
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
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-pink-900 to-pink-700 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center transform transition-all hover:scale-105 duration-300">
            <div className="mb-6 flex justify-center">
               <div className="bg-pink-100 p-3 rounded-full">
                  <Shield size={48} className="text-pink-900" />
               </div>
            </div>
            <h2 className="text-3xl font-bold text-pink-900 mb-2">FutManager</h2>
            <p className="text-gray-500 mb-8">Gerenciamento (Modo Local)</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                placeholder="Usuário (admin)" 
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
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
        <header className="bg-pink-900 text-white shadow-lg shrink-0">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Shield size={32} className="text-yellow-400" />
              <h1 className="text-2xl font-bold tracking-tight">FutManager</h1>
            </div>
            <div className="flex items-center gap-6 bg-pink-800/50 px-4 py-2 rounded-full">
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

        <main className="grow max-w-7xl mx-auto p-4 md:p-8 w-full">
          
          {/* Tabs Navigation (UPDATED TO PINK) */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-1">
            {[
              { id: 'players', label: `Jogadores (${players.length})`, icon: Users },
              { id: 'draw', label: 'Sorteio', icon: RefreshCw },
              { id: 'matches', label: 'Jogos', icon: Play },
              { id: 'ranking', label: 'Ranking', icon: Play },
              ...(user === 'admin' ? [{ id: 'import', label: 'Importar', icon: Upload }] : [])
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all font-medium text-sm md:text-base
                  ${currentTab === tab.id 
                    ? 'bg-white text-pink-600 border-t-2 border-pink-600 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]' 
                    : 'text-gray-500 hover:bg-pink-500 hover:text-white'}
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
                    <div className="grow">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Jogador</label>
                      <input 
                        className="w-full px-4 py-2 rounded border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-pink-500 outline-none" 
                        placeholder="Ex: Ronaldinho Gaúcho"
                        value={newPlayerName}
                        onChange={e => setNewPlayerName(e.target.value)}
                      />
                    </div>
                    <div className="w-full md:w-48">
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Posição</label>
                      <select 
                        className="w-full px-4 py-2 rounded border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-pink-500 outline-none"
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
                        className="w-full px-4 py-2 rounded border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-pink-500 outline-none"
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
                        className="w-full md:w-auto bg-pink-900 hover:bg-pink-800 text-white font-bold px-6 py-2 rounded shadow transition flex items-center justify-center gap-2 h-[42px]"
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
                      <tr key={player.id} className="hover:bg-pink-50/30 transition duration-150">
                        <td className="p-4 font-medium text-gray-900">{player.name}</td>
                        <td className="p-4 text-gray-600">{player.position}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-bold w-8 ${getLevelBadgeClass(player.level)}`}>
                            {player.level}
                          </span>
                        </td>
                        <td className="p-4">
                          <div 
                            onClick={() => updatePlayerStatusLocal(player.id, 'paid', player.paid)}
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
                            onClick={() => updatePlayerStatusLocal(player.id, 'confirmed', player.confirmed)}
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
                              onClick={() => deletePlayerLocal(player.id)}
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
               <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-pink-900 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div>
                   <h3 className="text-lg font-bold text-gray-900">
                      Jogadores Confirmados: <span className="text-pink-600 text-2xl">{players.filter(p => p.confirmed).length}</span>
                   </h3>
                   <p className="text-gray-500 text-sm mt-1">
                     {teamsLocked 
                       ? '🔒 Times fechados - Arraste desabilitado' 
                       : '📌 Arraste jogadores entre times para reorganizar'}
                   </p>
                 </div>
                 {user === 'admin' && (
                   <div className="flex gap-3">
                     {teams.length > 0 && (
                       <button 
                        className={`font-bold px-6 py-3 rounded-lg shadow-lg transition flex items-center gap-2 ${
                          teamsLocked 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        }`}
                        onClick={toggleTeamsLock}
                       >
                         {teamsLocked ? '🔓 Desbloquear Times' : '🔒 Bloquear Times'}
                       </button>
                     )}
                     <button 
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition flex items-center gap-2" 
                      onClick={generateTeams}
                     >
                       <RefreshCw size={20} /> Sortear Equipes
                     </button>
                   </div>
                 )}
               </div>

               {teams.length > 0 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                   {teams.map((team, idx) => (
                     <div 
                       key={idx} 
                       className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full transition ${
                         teamsLocked ? 'opacity-75' : ''
                       }`}
                       onDragOver={handleDragOver}
                       onDrop={(e) => handleDrop(e, idx)}
                     >
                       <div className={`${teamsLocked ? 'bg-gray-600' : 'bg-pink-900'} p-4 flex justify-between items-center`}>
                          <h3 className="text-white font-bold text-lg">{TEAM_NAMES[idx]}</h3>
                          <span className={`text-xs font-mono px-2 py-1 rounded ${
                            teamsLocked ? 'bg-gray-700 text-gray-200' : 'bg-pink-800 text-pink-200'
                          }`}>
                            {team.length} JOG {teamsLocked ? '🔒' : ''}
                          </span>
                       </div>
                       <div className="p-4 grow">
                         <ul className="space-y-2">
                           {team.map(p => (
                             <li 
                               key={p.id}
                               draggable={!teamsLocked}
                               onDragStart={(e) => handleDragStart(e, p, idx)}
                               className={`flex justify-between items-center p-2 rounded border-b border-gray-100 last:border-0 transition ${
                                 teamsLocked 
                                   ? 'cursor-not-allowed' 
                                   : 'cursor-move hover:bg-gray-50 hover:shadow-sm'
                               }`}
                             >
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

               {teams.length > 0 && !teamsLocked && user === 'admin' && (
                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center justify-between">
                   <p className="text-blue-700 text-sm">
                     ✅ Times definidos! Clique em <strong>Bloquear Times</strong> quando terminar a reorganização, então clique em <strong>Gerar Jogos</strong>.
                   </p>
                   <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition" 
                    onClick={generateMatches}
                   >
                     Gerar Jogos →
                   </button>
                 </div>
               )}

               {teams.length > 0 && teamsLocked && user === 'admin' && (
                 <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                   <p className="text-green-700 text-sm">
                     ✅ Times bloqueados! Clique em <strong>Gerar Jogos</strong> para criar o calendário.
                   </p>
                   <button 
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition flex items-center gap-2" 
                    onClick={generateMatches}
                   >
                     <Play size={18} /> Gerar Jogos
                   </button>
                 </div>
               )}
            </div>
          )}

          {/* ABA JOGOS */}
          {currentTab === 'matches' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-pink-900">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Confrontos: <span className="text-pink-600 text-2xl">{matches.length}</span>
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      12 jogos em 6 rodadas - Todos os times se enfrentam
                    </p>
                  </div>
                  {user === 'admin' && (
                    <button 
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition flex items-center gap-2" 
                      onClick={generateMatches}
                    >
                      <Play size={20} /> Gerar Jogos
                    </button>
                  )}
                </div>
              </div>

              {matches.length > 0 && (
                <>
                  {user === 'admin' && matches.some(m => m.finished) && !finishedRounds && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-300 flex items-center justify-between">
                      <p className="text-green-800 font-medium flex items-center gap-2">
                        <span className="text-lg">✅</span> {matches.filter(m => m.finished).length}/{matches.length} jogos finalizados
                      </p>
                      {matches.every(m => m.finished) && (
                        <button
                          onClick={finishAllMatches}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition flex items-center gap-2"
                        >
                          <CheckCircle size={18} /> Finalizar Todos os Jogos
                        </button>
                      )}
                    </div>
                  )}
                  
                  {finishedRounds > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-300">
                      <p className="text-blue-800 font-medium flex items-center gap-2">
                        <span className="text-lg">✓</span> Todos os jogos finalizados! Confira o ranking.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {matches.map((match) => (
                            <div key={match.id} className={`rounded-lg p-4 border-2 transition ${match.finished ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white hover:border-pink-300'}`}>
                              
                              {/* Header com status */}
                              <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
                                <h4 className="font-bold text-gray-800 text-sm">Jogo {match.id}</h4>
                                {user === 'admin' && (
                                  <button 
                                    onClick={() => toggleMatchFinished(match.id)}
                                    className={`text-xs font-bold px-3 py-1 rounded transition ${
                                      match.finished 
                                        ? 'bg-green-200 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                    }`}
                                  >
                                    {match.finished ? '✓ Finalizado' : '⏱ Em Jogo'}
                                  </button>
                                )}
                              </div>

                              {/* Layout: Time A | Placar | Time B */}
                              <div className="flex items-center gap-3 md:gap-4">
                                
                                {/* TIME A */}
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-pink-900 mb-1 truncate">{TEAM_NAMES[match.teamAIndex]}</div>
                                  <div className="space-y-1">
                                    {match.teamA.map(p => (
                                      <div key={p.id} className="text-xs bg-pink-50 px-2 py-1 rounded truncate border border-pink-100">
                                        {p.name}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* PLACAR E GOLS */}
                                <div className="flex flex-col items-center gap-2">
                                  
                                  {/* Placar */}
                                  <div className="bg-linear-to-r from-pink-100 to-pink-50 rounded-lg p-3 border border-pink-200 text-center min-w-20">
                                    <div className="text-2xl font-bold text-pink-900">
                                      {match.scoreA} <span className="text-gray-600">X</span> {match.scoreB}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Atualize adicionando gols</p>
                                  </div>

                                  {/* Gols (Admin) */}
                                  {user === 'admin' && (
                                    <div className="w-full max-w-xs space-y-1">
                                      {/* Gols Time A */}
                                      {match.goalsA.map((goal, idx) => (
                                        <div key={`goalA-${idx}`} className="bg-pink-50 border border-pink-200 rounded px-2 py-1 text-xs flex justify-between items-center">
                                          <span className="truncate">
                                            <span className="font-bold text-pink-900">⚽</span> {goal.player}
                                            {goal.assistBy && <span className="text-gray-600 ml-1">({goal.assistBy})</span>}
                                          </span>
                                          <button 
                                            onClick={() => removeGoal(match.id, 'A', idx)}
                                            className="text-red-500 hover:text-red-700 ml-1 shrink-0"
                                            title="Remover gol"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}

                                      {/* Form para adicionar gol Time A */}
                                      {!match.finished && (
                                        <div className="bg-pink-50 border border-dashed border-pink-300 rounded p-1.5">
                                          <select 
                                            id={`playerA-${match.id}`}
                                            className="w-full text-xs px-1 py-0.5 rounded border border-pink-200 bg-white mb-0.5"
                                            defaultValue=""
                                          >
                                            <option value="">Selecionar jogador...</option>
                                            {match.teamA.map(p => (
                                              <option key={p.id} value={p.name}>{p.name}</option>
                                            ))}
                                          </select>
                                          <select 
                                            id={`assistA-${match.id}`}
                                            className="w-full text-xs px-1 py-0.5 rounded border border-pink-200 bg-white mb-0.5"
                                            defaultValue=""
                                          >
                                            <option value="">Assistência (opcional)</option>
                                            {match.teamA.map(p => (
                                              <option key={p.id} value={p.name}>{p.name}</option>
                                            ))}
                                          </select>
                                          <button 
                                            onClick={() => {
                                              const player = document.getElementById(`playerA-${match.id}`).value;
                                              const assist = document.getElementById(`assistA-${match.id}`).value;
                                              if (!player) {
                                                showToast('Selecione um jogador para marcar o gol!', 'warning');
                                                return;
                                              }
                                              addGoal(match.id, 'A', player, assist);
                                              document.getElementById(`playerA-${match.id}`).value = '';
                                              document.getElementById(`assistA-${match.id}`).value = '';
                                            }}
                                            className="w-full text-xs bg-pink-200 hover:bg-pink-300 text-white font-bold px-1 py-0.5 rounded transition"
                                          >
                                            Adicionar Gol
                                          </button>
                                        </div>
                                      )}
                                      
                                      {/* Separador */}
                                      <div className="border-t border-gray-300 my-1"></div>
                                      
                                      {/* Gols Time B */}
                                      {match.goalsB.map((goal, idx) => (
                                        <div key={`goalB-${idx}`} className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-xs flex justify-between items-center">
                                          <span className="truncate">
                                            <span className="font-bold text-blue-900">⚽</span> {goal.player}
                                            {goal.assistBy && <span className="text-gray-600 ml-1">({goal.assistBy})</span>}
                                          </span>
                                          <button 
                                            onClick={() => removeGoal(match.id, 'B', idx)}
                                            className="text-red-500 hover:text-red-700 ml-1 shrink-0"
                                            title="Remover gol"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}

                                      {/* Form para adicionar gol Time B */}
                                      {!match.finished && (
                                        <div className="bg-blue-50 border border-dashed border-blue-300 rounded p-1.5">
                                          <select 
                                            id={`playerB-${match.id}`}
                                            className="w-full text-xs px-1 py-0.5 rounded border border-blue-200 bg-white mb-0.5"
                                            defaultValue=""
                                          >
                                            <option value="">Selecionar jogador...</option>
                                            {match.teamB.map(p => (
                                              <option key={p.id} value={p.name}>{p.name}</option>
                                            ))}
                                          </select>
                                          <select 
                                            id={`assistB-${match.id}`}
                                            className="w-full text-xs px-1 py-0.5 rounded border border-blue-200 bg-white mb-0.5"
                                            defaultValue=""
                                          >
                                            <option value="">Assistência (opcional)</option>
                                            {match.teamB.map(p => (
                                              <option key={p.id} value={p.name}>{p.name}</option>
                                            ))}
                                          </select>
                                          <button 
                                            onClick={() => {
                                              const player = document.getElementById(`playerB-${match.id}`).value;
                                              const assist = document.getElementById(`assistB-${match.id}`).value;
                                              if (!player) {
                                                showToast('Selecione um jogador para marcar o gol!', 'warning');
                                                return;
                                              }
                                              addGoal(match.id, 'B', player, assist);
                                              document.getElementById(`playerB-${match.id}`).value = '';
                                              document.getElementById(`assistB-${match.id}`).value = '';
                                            }}
                                            className="w-full text-xs bg-blue-200 hover:bg-blue-300 text-white font-bold px-1 py-0.5 rounded transition"
                                          >
                                            Adicionar Gol
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* TIME B */}
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-blue-900 mb-1 truncate text-right">{TEAM_NAMES[match.teamBIndex]}</div>
                                  <div className="space-y-1">
                                    {match.teamB.map(p => (
                                      <div key={p.id} className="text-xs bg-blue-50 px-2 py-1 rounded truncate border border-blue-100 text-right">
                                        {p.name}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                              </div>
                            </div>
                          ))}
                    </div>
                  </>
                )}
            </div>
          )}

          {/* ABA IMPORTAÇÃO */}
          {currentTab === 'import' && user === 'admin' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Upload className="text-pink-600" size={24} /> Importar Jogadores
                </h3>
                
                <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-pink-900 text-sm mb-2">Formato do Arquivo:</h4>
                  <code className="block bg-white border border-pink-200 p-3 rounded text-xs text-gray-600 font-mono">
                    Nome|Posição|Nível<br/>
                    João Silva|Ataque|A<br/>
                    Pedro Santos|Defesa|C
                  </code>
                </div>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-pink-50 transition relative group">
                    <input 
                      type="file" 
                      accept=".txt" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto text-gray-400 mb-2 group-hover:text-pink-500 transition" size={32} />
                    <p className="text-sm font-medium text-gray-600">Clique para enviar o arquivo .txt</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -top-3 left-3 bg-white px-2 text-xs font-bold text-gray-500">Ou cole o texto aqui</span>
                    <textarea 
                      className="w-full h-40 p-4 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-pink-500 outline-none font-mono text-sm"
                      value={importText}
                      onChange={e => setImportText(e.target.value)}
                      placeholder="Cole os dados aqui..."
                    />
                  </div>
                  
                  <button 
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg shadow transition flex justify-center items-center gap-2" 
                    onClick={async () => await handleBulkImport()}
                  >
                    <Upload size={18} /> Adicionar à Base de Dados
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ABA RANKING */}
          {currentTab === 'ranking' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-pink-900">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    Ranking Geral dos Jogadores
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {finishedRounds > 0 
                      ? `Pontuação após ${finishedRounds} rodada(s)` 
                      : 'Nenhuma rodada finalizada ainda'}
                  </p>
                </div>
              </div>

              {Object.keys(playerStats).length > 0 ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-linear-to-r from-pink-600 to-pink-700 text-white text-xs uppercase border-b border-pink-200">
                          <th className="p-4 font-semibold">Posição</th>
                          <th className="p-4 font-semibold">Jogador</th>
                          <th className="p-4 font-semibold text-center">Pontos</th>
                          <th className="p-4 font-semibold text-center">⚽ Gols</th>
                          <th className="p-4 font-semibold text-center">🎯 Assistências</th>
                          <th className="p-4 font-semibold text-center">🛡️ Sem Sofrer</th>
                          <th className="p-4 font-semibold text-center">Jogos</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {Object.entries(playerStats)
                          .sort((a, b) => b[1].points - a[1].points)
                          .map((entry, idx) => {
                            const playerId = entry[0];
                            const stats = entry[1];
                            return (
                              <tr key={playerId} className={`transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-pink-50`}>
                                <td className="p-4 font-bold text-lg text-pink-600 w-12">
                                  {idx === 0 && '🥇'}
                                  {idx === 1 && '🥈'}
                                  {idx === 2 && '🥉'}
                                  {idx > 2 && `#${idx + 1}`}
                                </td>
                                <td className="p-4 font-medium text-gray-900">{stats.name}</td>
                                <td className="p-4 text-center">
                                  <span className="inline-block bg-pink-100 text-pink-900 font-bold px-3 py-1 rounded-full">
                                    {stats.points}
                                  </span>
                                </td>
                                <td className="p-4 text-center font-bold text-gray-700">{stats.goals}</td>
                                <td className="p-4 text-center font-bold text-gray-700">{stats.assists}</td>
                                <td className="p-4 text-center font-bold text-gray-700">{stats.cleanSheets}</td>
                                <td className="p-4 text-center font-bold text-gray-700">{stats.matches}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                  <p className="text-gray-500">Nenhuma pontuação registrada ainda. Finalize rodadas para ver o ranking!</p>
                </div>
              )}
            </div>
          )}

        </main>

        {/* TOASTS */}
        <div className="fixed bottom-4 right-4 space-y-3 z-50 max-w-sm">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}