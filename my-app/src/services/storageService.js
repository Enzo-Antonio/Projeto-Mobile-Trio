import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

export const storageService = {
  async getPlayers() {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.PLAYERS);
      if (!json) return [];
      const players = JSON.parse(json);
      return Array.isArray(players) ? players : [];
    } catch (error) {
      console.error('Failed to load players:', error);
      return [];
    }
  },

  async savePlayers(players) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
      return true;
    } catch (error) {
      console.error('Failed to save players:', error);
      return false;
    }
  },

  async addPlayer(player) {
    const players = await this.getPlayers();
    players.push(player);
    return this.savePlayers(players);
  },

  async updatePlayer(updated) {
    const players = await this.getPlayers();
    const index = players.findIndex((p) => p.id === updated.id);
    if (index === -1) return false;
    players[index] = { ...updated, updatedAt: new Date().toISOString() };
    return this.savePlayers(players);
  },

  async deletePlayer(id) {
    const players = await this.getPlayers();
    return this.savePlayers(players.filter((p) => p.id !== id));
  },

  async getLineups() {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.LINEUPS);
      if (!json) return [];
      const lineups = JSON.parse(json);
      return Array.isArray(lineups) ? lineups : [];
    } catch (error) {
      console.error('Failed to load lineups:', error);
      return [];
    }
  },

  async saveLineups(lineups) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LINEUPS, JSON.stringify(lineups));
      return true;
    } catch (error) {
      console.error('Failed to save lineups:', error);
      return false;
    }
  },

  async addLineup(lineup) {
    const lineups = await this.getLineups();
    lineups.push(lineup);
    return this.saveLineups(lineups);
  },

  async updateLineup(updated) {
    const lineups = await this.getLineups();
    const index = lineups.findIndex((l) => l.id === updated.id);
    if (index === -1) return false;
    lineups[index] = { ...updated, updatedAt: new Date().toISOString() };
    return this.saveLineups(lineups);
  },

  async deleteLineup(id) {
    const lineups = await this.getLineups();
    return this.saveLineups(lineups.filter((l) => l.id !== id));
  },
};
