export interface Theme {
  name: string;
  bg: string;
  fg: string;
  fgMuted: string;
  fgDim: string;
  accent: string;
  border: string;
}

export const themes: Theme[] = [
  {
    name: 'asche',
    bg: '#070707',
    fg: '#e8e8e8',
    fgMuted: '#555',
    fgDim: '#2a2a2a',
    accent: '#c8b89a',
    border: '#1c1c1c',
  },
  {
    name: 'tintenblau',
    bg: '#080d14',
    fg: '#d4dde8',
    fgMuted: '#3a5068',
    fgDim: '#18242e',
    accent: '#6a9fbf',
    border: '#111c26',
  },
  {
    name: 'maximalkontrast',
    bg: '#000000',
    fg: '#ffffff',
    fgMuted: '#666',
    fgDim: '#1a1a1a',
    accent: '#ffffff',
    border: '#222',
  },
  {
    name: 'botanisch',
    bg: '#060d08',
    fg: '#d8e8d0',
    fgMuted: '#3a5c3e',
    fgDim: '#141f16',
    accent: '#8aad72',
    border: '#0f1c11',
  },
  {
    name: 'bordeaux',
    bg: '#0d0608',
    fg: '#e8d4d8',
    fgMuted: '#5c3040',
    fgDim: '#1c0e12',
    accent: '#b87090',
    border: '#1c0e12',
  },
  {
    name: 'kupfer',
    bg: '#080603',
    fg: '#e8ddd0',
    fgMuted: '#5c4a32',
    fgDim: '#1c1508',
    accent: '#c87840',
    border: '#1c1508',
  },
];

export function pickTheme(): Theme {
  const idx = Math.floor(Math.random() * themes.length);
  return themes[idx];
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty('--bg', theme.bg);
  root.style.setProperty('--fg', theme.fg);
  root.style.setProperty('--fg-muted', theme.fgMuted);
  root.style.setProperty('--fg-dim', theme.fgDim);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--border', theme.border);
}
