import { formatEuro, formatDuration } from "./market";

export type TicketData = {
  lines: { name: string; qty: number; real: number; sim: number }[];
  totalReal: number; totalSim: number; userDays: number; billDays: number; billName: string; householdIncome: number;
};

export async function renderTicketPng(d: TicketData): Promise<Blob> {
  await document.fonts?.ready;
  const W = 1080, lineH = 48, H = 1040 + d.lines.length * lineH;
  const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
  const g = canvas.getContext("2d");
  if (!g) throw new Error("Canvas unavailable");
  // Resolve semantic CSS colors to canvas-compatible browser values.
  const probe = document.createElement("span"); document.body.append(probe);
  const color = (token: string) => { probe.style.color = `var(--${token})`; return getComputedStyle(probe).color; };
  const ink = color("foreground"), paper = color("paper"), sale = color("sale"), muted = color("muted"); probe.remove();
  g.fillStyle = muted; g.fillRect(0, 0, W, H);
  g.fillStyle = paper; g.fillRect(60, 50, W - 120, H - 100);
  g.fillStyle = ink; g.textAlign = "center"; g.font = "800 54px Manrope, sans-serif";
  g.fillText("hyper riches market.", W / 2, 145);
  function centeredWrap(text: string, y: number, maxWidth = 820, step = 42) {
    let line = "";
    for (const word of text.split(" ")) {
      const next = line ? `${line} ${word}` : word;
      if (g && g.measureText(next).width > maxWidth && line) { g.fillText(line, W / 2, y); y += step; line = word; } else line = next;
    }
    if (g) g.fillText(line, W / 2, y);
    return y + step;
  }
  g.font = "500 30px Manrope, sans-serif";
  let y = centeredWrap(`Si, avec ${formatEuro(d.householdIncome)} de revenus annuels bruts, j'avais un pouvoir d'achat équivalent à ${d.billName}…`, 215);
  y += 25;
  const divider = () => { g.strokeStyle = ink; g.setLineDash([8, 8]); g.beginPath(); g.moveTo(110, y); g.lineTo(W - 110, y); g.stroke(); y += 55; };
  divider();
  g.font = "400 24px 'JetBrains Mono', monospace";
  for (const l of d.lines) {
    g.fillStyle = ink; g.textAlign = "left";
    const label = `${l.qty}× ${l.name}`;
    g.fillText(label.length > 34 ? label.slice(0, 32) + "…" : label, 110, y);
    g.textAlign = "right"; g.fillStyle = sale; g.fillText(formatEuro(l.sim * l.qty), W - 110, y); y += lineH;
  }
  y += 15; divider();
  g.fillStyle = ink; g.textAlign = "left"; g.fillText("Prix réel", 110, y);
  g.textAlign = "right"; g.fillText(formatEuro(d.totalReal), W - 110, y); y += 65;
  g.font = "700 40px 'JetBrains Mono', monospace"; g.fillStyle = sale; g.textAlign = "left";
  g.fillText("À PAYER", 110, y); g.textAlign = "right"; g.fillText(formatEuro(d.totalSim), W - 110, y); y += 85;
  g.fillStyle = ink; g.textAlign = "center"; g.font = "700 30px Manrope, sans-serif";
  y = centeredWrap(`Au prix réel, ce panier représente ${formatDuration(d.userDays)} de mes revenus.`, y);
  y += 25;
  y = centeredWrap(`Pour ${d.billName}, c'est ${formatDuration(d.billDays)} de revenus.`, y);
  g.font = "400 21px Manrope, sans-serif";
  centeredWrap("Simulation pédagogique · revenus bruts · base 220 jours/an, 7 h/jour. Jours équivalents de revenus, pas de travail effectif.", H - 175, 800, 32);
  return new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Image export failed")), "image/png"));
}
export async function shareTicket(d: TicketData) {
  const blob = await renderTicketPng(d);
  const file = new File([blob], "ticket-hyper-riches-market.png", { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: "Mon ticket Hyper Riches Market" }); return; }
    catch (error) { if (error instanceof DOMException && error.name === "AbortError") return; }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = file.name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
