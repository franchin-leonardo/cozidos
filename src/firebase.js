import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBIJBGFdDPr-p4_gVHsLJOv5cIOwSMbB1g",
  authDomain: "cozidos-3f892.firebaseapp.com",
  projectId: "cozidos-3f892",
  storageBucket: "cozidos-3f892.firebasestorage.app",
  messagingSenderId: "57001878936",
  appId: "1:57001878936:web:26bb7b54624697e95bf7ed",
  databaseURL: "https://cozidos-3f892-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export const checkPlayerExists = async (playerName) => {
  try {
    const playersRef = ref(db, 'players');
    const snapshot = await get(playersRef);
    
    if (!snapshot.exists()) {
      return false;
    }
    
    const players = snapshot.val();
    return Object.values(players).some(p => 
      p.name && p.name.toLowerCase() === playerName.toLowerCase()
    );
  } catch (error) {
    console.error('Erro ao verificar jogador:', error);
    return false;
  }
};

export const addPlayerToFirebase = async (player) => {
  try {
    const playersRef = ref(db, 'players');
    const newPlayerRef = await push(playersRef, {
      ...player
    });
    return { ...player, id: newPlayerRef.key };
  } catch (error) {
    console.error('Erro ao adicionar jogador:', error);
    throw error;
  }
};

export const addMultiplePlayersToFirebase = async (players) => {
  try {
    const playersRef = ref(db, 'players');
    const addedPlayers = [];
    
    for (const player of players) {
      const newPlayerRef = await push(playersRef, {
        ...player
      });
      addedPlayers.push({ ...player, id: newPlayerRef.key });
    }
    
    return addedPlayers;
  } catch (error) {
    console.error('Erro ao adicionar múltiplos jogadores:', error);
    throw error;
  }
};

export const loadPlayersFromFirebase = async () => {
  try {
    const playersRef = ref(db, 'players');
    const snapshot = await get(playersRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const playersData = snapshot.val();
    return Object.entries(playersData).map(([key, value]) => ({
      ...value,
      id: key
    }));
  } catch (error) {
    console.error('Erro ao carregar jogadores:', error);
    return [];
  }
};
