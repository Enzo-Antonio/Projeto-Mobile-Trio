export const colors = {
  background: '#0B1220',
  surface: '#111827',
  surfaceLight: '#1E293B',
  primary: '#22C55E',
  primaryDark: '#15803D',
  primaryLight: '#4ADE80',
  textPrimary: '#F9FAFB',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#1E293B',
  borderLight: '#334155',
  error: '#EF4444',
  errorDark: '#991B1B',
  warning: '#F59E0B',
  info: '#3B82F6',
  success: '#22C55E',
  overlay: 'rgba(0, 0, 0, 0.6)',
  courtGreen: '#1B5E20',
  courtLines: '#FFFFFF',
  courtGoalArea: 'rgba(255, 255, 255, 0.15)',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };

export const borderRadius = { sm: 6, md: 10, lg: 14, xl: 20, full: 999 };

export const fontSize = { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24, xxxl: 30, hero: 36 };

export const fontWeight = {
  regular: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800',
};

export const shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
};

export function getOverallColor(overall) {
  if (overall >= 90) return '#22C55E';
  if (overall >= 80) return '#84CC16';
  if (overall >= 70) return '#EAB308';
  if (overall >= 60) return '#F97316';
  return '#EF4444';
}

export function getOverallBackgroundColor(overall) {
  if (overall >= 90) return 'rgba(34, 197, 94, 0.15)';
  if (overall >= 80) return 'rgba(132, 204, 22, 0.15)';
  if (overall >= 70) return 'rgba(234, 179, 8, 0.15)';
  if (overall >= 60) return 'rgba(249, 115, 22, 0.15)';
  return 'rgba(239, 68, 68, 0.15)';
}
