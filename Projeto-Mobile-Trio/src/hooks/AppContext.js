import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';

const AppContext = createContext(undefined);

function reducer(state, action) {
  switch (action.type) {
    case 'INITIALIZE':
      return { ...state, players: action.payload.players, lineups: action.payload.lineups, isLoading: false };
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] };
    case 'UPDATE_PLAYER':
      return { ...state, players: state.players.map((p) => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PLAYER':
      return { ...state, players: state.players.filter((p) => p.id !== action.payload) };
    case 'ADD_LINEUP':
      return { ...state, lineups: [...state.lineups, action.payload] };
    case 'UPDATE_LINEUP':
      return { ...state, lineups: state.lineups.map((l) => l.id === action.payload.id ? action.payload : l) };
    case 'DELETE_LINEUP':
      return { ...state, lineups: state.lineups.filter((l) => l.id !== action.payload) };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { players: [], lineups: [], isLoading: true });

  useEffect(() => {
    (async () => {
      const [players, lineups] = await Promise.all([storageService.getPlayers(), storageService.getLineups()]);
      dispatch({ type: 'INITIALIZE', payload: { players, lineups } });
    })();
  }, []);

  const addPlayer = useCallback(async (player) => {
    dispatch({ type: 'ADD_PLAYER', payload: player });
    await storageService.addPlayer(player);
  }, []);

  const updatePlayer = useCallback(async (player) => {
    const updated = { ...player, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_PLAYER', payload: updated });
    await storageService.updatePlayer(updated);
  }, []);

  const deletePlayer = useCallback(async (id) => {
    dispatch({ type: 'DELETE_PLAYER', payload: id });
    await storageService.deletePlayer(id);
  }, []);

  const addLineup = useCallback(async (lineup) => {
    dispatch({ type: 'ADD_LINEUP', payload: lineup });
    await storageService.addLineup(lineup);
  }, []);

  const updateLineup = useCallback(async (lineup) => {
    const updated = { ...lineup, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_LINEUP', payload: updated });
    await storageService.updateLineup(updated);
  }, []);

  const deleteLineup = useCallback(async (id) => {
    dispatch({ type: 'DELETE_LINEUP', payload: id });
    await storageService.deleteLineup(id);
  }, []);

  const getPlayerById = useCallback((id) => state.players.find((p) => p.id === id), [state.players]);
  const getLineupById = useCallback((id) => state.lineups.find((l) => l.id === id), [state.lineups]);

  return (
    <AppContext.Provider value={{ ...state, addPlayer, updatePlayer, deletePlayer, addLineup, updateLineup, deleteLineup, getPlayerById, getLineupById }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
