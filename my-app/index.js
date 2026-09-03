import * as Crypto from 'expo-crypto';
import { OVERALL_WEIGHTS } from '../constants';

export function generateId() {
  return Crypto.randomUUID();
}
// alteracao pra dar revert no pc do rafifa
export function calculateOverall(attributes) {
  const { speed, shooting, stamina, passing, dribbling, defending } = attributes;
  return Math.round(Math.min(100, Math.max(0,
    speed * OVERALL_WEIGHTS.speed + shooting * OVERALL_WEIGHTS.shooting +
    stamina * OVERALL_WEIGHTS.stamina + passing * OVERALL_WEIGHTS.passing +
    dribbling * OVERALL_WEIGHTS.dribbling + defending * OVERALL_WEIGHTS.defending
  )));
}

export function clampAttribute(value) {
  return Math.round(Math.min(100, Math.max(0, value)));
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function getPlayerInitials(name) {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function searchPlayers(players, query) {
  if (!query || query.trim() === '') return players;
  const q = query.toLowerCase().trim();
  return players.filter((p) =>
    p.name?.toLowerCase().includes(q) ||
    p.nickname?.toLowerCase().includes(q) ||
    p.number?.toString() === q ||
    p.position?.toLowerCase().includes(q)
  );
}

export function sortPlayers(players, sortBy, direction = 'asc') {
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
}
