import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

const getItems = async (key) => {
  try {
    const json = await AsyncStorage.getItem(key);
    const parsed = json ? JSON.parse(json) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Falha ao carregar ${key}:`, error);
    return [];
  }
};

const saveItems = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Falha ao salvar ${key}:`, error);
    return false;
  }
};

const createStorageHandlers = (key) => ({
  getAll: () => getItems(key),
  saveAll: (items) => saveItems(key, items),
  add: async (item) => {
    const items = await getItems(key);
    items.push(item);
    return saveItems(key, items);
  },
  update: async (updated) => {
    const items = await getItems(key);
    const index = items.findIndex((i) => i.id === updated.id);
    if (index === -1) return false;
    items[index] = { ...updated, updatedAt: new Date().toISOString() };
    return saveItems(key, items);
  },
  delete: async (id) => {
    const items = await getItems(key);
    return saveItems(key, items.filter((i) => i.id !== id));
  },
});

const playerStorage = createStorageHandlers(STORAGE_KEYS.PLAYERS);
const lineupStorage = createStorageHandlers(STORAGE_KEYS.LINEUPS);

export const storageService = {
  getPlayers: playerStorage.getAll,
  savePlayers: playerStorage.saveAll,
  addPlayer: playerStorage.add,
  updatePlayer: playerStorage.update,
  deletePlayer: playerStorage.delete,

  getLineups: lineupStorage.getAll,
  saveLineups: lineupStorage.saveAll,
  addLineup: lineupStorage.add,
  updateLineup: lineupStorage.update,
  deleteLineup: lineupStorage.delete,
};
