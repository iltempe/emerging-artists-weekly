// Applica il colore tema scelto nel config come variabili CSS.

function hexToChannels(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "").match(/^([0-9a-fA-F]{6})$/);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const ch = (rgb: [number, number, number]) => `${rgb[0]} ${rgb[1]} ${rgb[2]}`;

export function applyAccent(hex?: string): void {
  if (!hex) return;
  const rgb = hexToChannels(hex);
  if (!rgb) return;
  // versione "soft": miscelata verso il bianco per i testi/accenti chiari
  const soft = rgb.map((c) => Math.round(c + (255 - c) * 0.35)) as [number, number, number];
  const root = document.documentElement;
  root.style.setProperty("--accent", ch(rgb));
  root.style.setProperty("--accent-soft", ch(soft));
}
