export const colors = {
  brand: '#FF2E8B',
  brandDark: '#C2185B',
  ink: '#2A1060',
  surface: '#FFFFFF',
  canvas: '#FFF5FA',
  muted: '#6B6280',
  text: '#1A1025',
  success: '#1B7F4E',
  danger: '#C62828',
  warning: '#F5A524',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  touch: '44px',
} as const;

export const radius = {
  sm: '8px',
  md: '12px',
  pill: '999px',
} as const;

export const fontSize = {
  caption: ['13px', { lineHeight: '18px' }],
  body: ['16px', { lineHeight: '22px' }],
  title: ['24px', { lineHeight: '30px' }],
} as const;
