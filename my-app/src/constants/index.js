export const POSITIONS = {
  GK: { label: 'Goleiro', shortLabel: 'GOL', color: '#F59E0B' },
  FIXO: { label: 'Fixo', shortLabel: 'FIX', color: '#3B82F6' },
  ALA_ESQUERDO: { label: 'Ala Esquerdo', shortLabel: 'ALE', color: '#8B5CF6' },
  ALA_DIREITO: { label: 'Ala Direito', shortLabel: 'ALA', color: '#06B6D4' },
  PIVOT: { label: 'Pivô', shortLabel: 'PIV', color: '#EF4444' },
};

export const FORMATIONS = [
  {
    id: '3-1',
    name: '3-1',
    label: '3-1 (Ofensiva)',
    positions: [
      { position: 'GK', x: 0.5, y: 0.88 },
      { position: 'FIXO', x: 0.5, y: 0.65 },
      { position: 'ALA_ESQUERDO', x: 0.2, y: 0.45 },
      { position: 'ALA_DIREITO', x: 0.8, y: 0.45 },
      { position: 'PIVOT', x: 0.5, y: 0.22 },
    ],
  },
  {
    id: '2-2',
    name: '2-2',
    label: '2-2 (Equilibrada)',
    positions: [
      { position: 'GK', x: 0.5, y: 0.88 },
      { position: 'FIXO', x: 0.35, y: 0.65 },
      { position: 'ALA_ESQUERDO', x: 0.2, y: 0.38 },
      { position: 'ALA_DIREITO', x: 0.8, y: 0.38 },
      { position: 'PIVOT', x: 0.65, y: 0.65 },
    ],
  },
  {
    id: '1-2-1',
    name: '1-2-1',
    label: '1-2-1 (Clássica)',
    positions: [
      { position: 'GK', x: 0.5, y: 0.88 },
      { position: 'FIXO', x: 0.5, y: 0.7 },
      { position: 'ALA_ESQUERDO', x: 0.2, y: 0.45 },
      { position: 'ALA_DIREITO', x: 0.8, y: 0.45 },
      { position: 'PIVOT', x: 0.5, y: 0.2 },
    ],
  },
];

export const STORAGE_KEYS = {
  PLAYERS: '@futsal_app_players',
  LINEUPS: '@futsal_app_lineups',
  SETTINGS: '@futsal_app_settings',
};

export const ATTRIBUTES = [
  { key: 'speed', label: 'Velocidade' },
  { key: 'shooting', label: 'Chute' },
  { key: 'stamina', label: 'Fôlego' },
  { key: 'passing', label: 'Passe' },
  { key: 'dribbling', label: 'Drible' },
  { key: 'defending', label: 'Defesa' },
];

export const OVERALL_WEIGHTS = {
  speed: 0.20,
  shooting: 0.20,
  stamina: 0.15,
  passing: 0.15,
  dribbling: 0.15,
  defending: 0.15,
};

export const DEFAULT_LINEUP_NAME = 'Minha escalação';

export const SORT_OPTIONS = [
  { key: 'name', label: 'Nome' },
  { key: 'overall', label: 'Overall' },
  { key: 'position', label: 'Posição' },
  { key: 'number', label: 'Número' },
];
