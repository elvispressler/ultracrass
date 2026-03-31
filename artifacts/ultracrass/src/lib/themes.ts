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
    bg: '#0e0e0e',
    fg: '#e8e8e8',
    fgMuted: '#7a7a7a',
    fgDim: '#3e3e3e',
    accent: '#c8b89a',
    border: '#282828',
  },
  {
    name: 'tintenblau',
    bg: '#0c1420',
    fg: '#d4dde8',
    fgMuted: '#5a7a96',
    fgDim: '#243448',
    accent: '#6a9fbf',
    border: '#1a2c3e',
  },
  {
    name: 'maximalkontrast',
    bg: '#0a0a0a',
    fg: '#ffffff',
    fgMuted: '#888888',
    fgDim: '#333333',
    accent: '#ffffff',
    border: '#2e2e2e',
  },
  {
    name: 'botanisch',
    bg: '#0c160e',
    fg: '#d8e8d0',
    fgMuted: '#5a8060',
    fgDim: '#1e301e',
    accent: '#8aad72',
    border: '#1a2e1a',
  },
  {
    name: 'bordeaux',
    bg: '#140a0e',
    fg: '#e8d4d8',
    fgMuted: '#7a4458',
    fgDim: '#2e1620',
    accent: '#b87090',
    border: '#2e1620',
  },
  {
    name: 'kupfer',
    bg: '#100c06',
    fg: '#e8ddd0',
    fgMuted: '#7c6040',
    fgDim: '#2e2010',
    accent: '#c87840',
    border: '#2e2010',
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
