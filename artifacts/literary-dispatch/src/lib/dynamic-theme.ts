import { ArtistTheme } from "@workspace/api-client-react";

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function applyDynamicTheme(theme: ArtistTheme) {
  const root = document.documentElement;

  const bgHsl = hexToHsl(theme.colorBackground);
  const textHsl = hexToHsl(theme.colorText);
  const primaryHsl = hexToHsl(theme.colorPrimary);
  const accentHsl = hexToHsl(theme.colorAccent);
  const secondaryHsl = hexToHsl(theme.colorSecondary);

  root.style.setProperty('--background', bgHsl);
  root.style.setProperty('--foreground', textHsl);
  root.style.setProperty('--primary', primaryHsl);
  root.style.setProperty('--primary-foreground', textHsl);
  root.style.setProperty('--accent', accentHsl);
  root.style.setProperty('--accent-foreground', textHsl);
  root.style.setProperty('--secondary', secondaryHsl);
  root.style.setProperty('--secondary-foreground', textHsl);
  root.style.setProperty('--muted', secondaryHsl);
  root.style.setProperty('--muted-foreground', `${Math.round(hexToHsl(theme.colorText).split(' ')[0])} 30% 60%`);
  root.style.setProperty('--card', secondaryHsl);
  root.style.setProperty('--card-foreground', textHsl);
  root.style.setProperty('--border', accentHsl);
  root.style.setProperty('--input', secondaryHsl);
  root.style.setProperty('--ring', primaryHsl);
  root.style.setProperty('--popover', bgHsl);
  root.style.setProperty('--popover-foreground', textHsl);

  root.style.setProperty('--theme-bg', theme.colorBackground);
  root.style.setProperty('--theme-text', theme.colorText);
  root.style.setProperty('--theme-primary', theme.colorPrimary);
  root.style.setProperty('--theme-secondary', theme.colorSecondary);
  root.style.setProperty('--theme-accent', theme.colorAccent);
  root.style.setProperty('--theme-font-heading', `"${theme.fontHeading}", serif`);
  root.style.setProperty('--theme-font-body', `"${theme.fontBody}", sans-serif`);
  root.style.setProperty('--app-font-sans', `"${theme.fontBody}", sans-serif`);
  root.style.setProperty('--app-font-serif', `"${theme.fontHeading}", serif`);

  const familyHeading = theme.fontHeading.replace(/ /g, '+');
  const familyBody = theme.fontBody.replace(/ /g, '+');
  const href = `https://fonts.googleapis.com/css2?family=${familyHeading}:ital,wght@0,300;0,400;0,600;1,300;1,400&family=${familyBody}:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap`;

  const fontLink = document.getElementById('dynamic-theme-fonts') as HTMLLinkElement | null;
  if (fontLink) {
    if (fontLink.href !== href) fontLink.href = href;
  } else {
    const link = document.createElement('link');
    link.id = 'dynamic-theme-fonts';
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}
