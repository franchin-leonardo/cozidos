import { ref, push, get } from 'firebase/database';
import { db } from './firebase';

// --- SALVAR TIMES ---
export const saveTeamsToFirebase = async (teams, teamNames) => {
  try {
    const timestamp = new Date().toISOString();
    const teamsData = teams.map((team, idx) => ({
      name: teamNames[idx],
      players: team.map(p => ({ id: p.id, name: p.name, level: p.level, position: p.position }))
    }));

    const historyRef = ref(db, 'history/teams');
    const newRef = await push(historyRef, {
      teams: teamsData,
      timestamp,
      totalPlayers: teams.reduce((sum, t) => sum + t.length, 0)
    });

    return { id: newRef.key, timestamp };
  } catch (error) {
    console.error('Erro ao salvar times:', error);
    throw error;
  }
};

// --- SALVAR JOGOS ---
export const saveMatchesToFirebase = async (matches) => {
  try {
    const timestamp = new Date().toISOString();
    const matchesData = matches.map(m => ({
      id: m.id,
      teamA: m.teamA.map(p => ({ id: p.id, name: p.name })),
      teamB: m.teamB.map(p => ({ id: p.id, name: p.name })),
      scoreA: m.scoreA,
      scoreB: m.scoreB,
      goalsA: m.goalsA,
      goalsB: m.goalsB,
      finished: m.finished,
      round: m.round
    }));

    const historyRef = ref(db, 'history/matches');
    const newRef = await push(historyRef, {
      matches: matchesData,
      timestamp,
      totalMatches: matches.length,
      finishedMatches: matches.filter(m => m.finished).length
    });

    return { id: newRef.key, timestamp };
  } catch (error) {
    console.error('Erro ao salvar jogos:', error);
    throw error;
  }
};

// --- SALVAR RANKING ---
export const saveRankingToFirebase = async (playerStats) => {
  try {
    const timestamp = new Date().toISOString();
    const rankingData = Object.entries(playerStats)
      .sort((a, b) => b[1].points - a[1].points)
      .map((entry, idx) => ({
        rank: idx + 1,
        playerId: entry[0],
        ...entry[1]
      }));

    const historyRef = ref(db, 'history/rankings');
    const newRef = await push(historyRef, {
      ranking: rankingData,
      timestamp,
      totalPlayers: rankingData.length
    });

    return { id: newRef.key, timestamp };
  } catch (error) {
    console.error('Erro ao salvar ranking:', error);
    throw error;
  }
};

// --- CARREGAR HISTÓRICO DE TIMES ---
export const loadTeamsHistory = async () => {
  try {
    const historyRef = ref(db, 'history/teams');
    const snapshot = await get(historyRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    return Object.entries(data).map(([key, value]) => ({
      id: key,
      ...value
    })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Erro ao carregar histórico de times:', error);
    return [];
  }
};

// --- CARREGAR HISTÓRICO DE JOGOS ---
export const loadMatchesHistory = async () => {
  try {
    const historyRef = ref(db, 'history/matches');
    const snapshot = await get(historyRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    return Object.entries(data).map(([key, value]) => ({
      id: key,
      ...value
    })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Erro ao carregar histórico de jogos:', error);
    return [];
  }
};

// --- CARREGAR HISTÓRICO DE RANKINGS ---
export const loadRankingsHistory = async () => {
  try {
    const historyRef = ref(db, 'history/rankings');
    const snapshot = await get(historyRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    return Object.entries(data).map(([key, value]) => ({
      id: key,
      ...value
    })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Erro ao carregar histórico de rankings:', error);
    return [];
  }
};

export const deleteTeamsHistoryEntry = async (entryId) => {
  try {
    const { remove: removeItem } = await import('firebase/database');
    const entryRef = ref(db, `history/teams/${entryId}`);
    await removeItem(entryRef);
  } catch (error) {
    console.error('Erro ao deletar entrada de histórico:', error);
    throw error;
  }
};

export const deleteMatchesHistoryEntry = async (entryId) => {
  try {
    const { remove: removeItem } = await import('firebase/database');
    const entryRef = ref(db, `history/matches/${entryId}`);
    await removeItem(entryRef);
  } catch (error) {
    console.error('Erro ao deletar entrada de histórico:', error);
    throw error;
  }
};

export const deleteRankingsHistoryEntry = async (entryId) => {
  try {
    const { remove: removeItem } = await import('firebase/database');
    const entryRef = ref(db, `history/rankings/${entryId}`);
    await removeItem(entryRef);
  } catch (error) {
    console.error('Erro ao deletar entrada de histórico:', error);
    throw error;
  }
};
