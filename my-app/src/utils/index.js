import * as Crypto from 'expo-crypto';
import { OVERALL_WEIGHTS } from '../constants';

export const generateId = () => Crypto.randomUUID();

export const clampAttribute = (val) => Math.round(Math.min(100, Math.max(0, val)));

export const calculateOverall = (attrs) =>
  clampAttribute(
    Object.entries(attrs).reduce(
      (total, [key, val]) => total + (val || 0) * (OVERALL_WEIGHTS[key] || 0),
      0
    )
  );

export const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const getPlayerInitials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const searchPlayers = (players, query) => {
  if (!query?.trim()) return players;
  const q = query.toLowerCase().trim();
  return players.filter((p) =>
    [p.name, p.nickname, p.number?.toString(), p.position].some((field) =>
      field?.toLowerCase().includes(q)
    )
  );
};

export const sortPlayers = (players, sortBy, direction = 'asc') => {
  const sorted = [...players].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'overall': return b.overall - a.overall;
      case 'position': return a.position.localeCompare(b.position);
      case 'number': return (a.number || 0) - (b.number || 0);
      default: return 0;
    }
  });
  return direction === 'desc' ? sorted.reverse() : sorted;
};
