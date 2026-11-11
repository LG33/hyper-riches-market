import { formatEuro, formatDuration, WORKING_DAYS } from "./market";
import logoUrl from "@/assets/logo-hyper-riches-market.png";

export type TicketData = {
  lines: { name: string; qty: number; real: number; sim: number }[];
  totalReal: number; totalSim: number; userDays: number; billDays: number; billName: string; householdIncome: number; divisor: number;
};

export async function renderTicketPng(d: TicketData): Promise<Blob> {
  await document.fonts?.ready;
  const logo = new Image();
  logo.src = logoUrl;
  await logo.decode();

  const W = 1080, lineH = 112, H = 1260 + d.lines.length * lineH;
  const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
  const g = canvas.getContext("2d");
  if (!g) throw new Error("Canvas unavailable");

  // Resolve semantic CSS colors to canvas-compatible browser values.
  const probe = document.createElement("span"); document.body.append(probe);
  const color = (token: string) => { probe.style.color = `var(--${token})`; return getComputedStyle(probe).color; };
  const ink = color("foreground"), paper = color("paper"), sale = color("sale"), muted = color("muted"), mutedInk = color("muted-foreground"); probe.remove();
  g.fillStyle = muted; g.fillRect(0, 0, W, H);
  g.fillStyle = paper; g.fillRect(60, 50, W - 120, H - 100);

  const logoWidth = 480, logoHeight = logoWidth * logo.height / logo.width;
  g.drawImage(logo, (W - logoWidth) / 2, 85, logoWidth, logoHeight);

  function centeredWrap(text: string, y: number, maxWidth = 820, step = 42) {
    let line = "";
    for (const word of text.split(" ")) {
      const next = line ? `${line} ${word}` : word;
      if (g && g.measureText(next).width > maxWidth && line) { g.fillText(line, W / 2, y); y += step; line = word; } else line = next;
    }
    if (g) g.fillText(line, W / 2, y);
    return y + step;
  }

  g.fillStyle = ink; g.textAlign = "center"; g.font = "500 30px Manrope, sans-serif";
  let y = centeredWrap(`Si, avec ${formatEuro(d.householdIncome)} de revenus annuels, j'avais un pouvoir d'achat équivalent à ${d.billName}…`, 315);
  g.font = "400 24px Manrope, sans-serif"; g.fillStyle = mutedInk;
  y = centeredWrap(`Tous mes prix seraient divisés par ${Math.round(d.divisor).toLocaleString("fr-FR")}.`, y + 5, 820, 36);

  const divider = () => { g.strokeStyle = ink; g.setLineDash([8, 8]); g.beginPath(); g.moveTo(110, y); g.lineTo(W - 110, y); g.stroke(); g.setLineDash([]); y += 55; };
  y += 15; divider();

  for (const l of d.lines) {
    g.fillStyle = ink; g.textAlign = "left"; g.font = "700 25px 'JetBrains Mono', monospace";
    g.fillText(l.name, 110, y, 600);
    g.textAlign = "right"; g.fillStyle = sale; g.fillText(formatEuro(l.sim * l.qty), W - 110, y);
    g.textAlign = "left"; g.fillStyle = mutedInk; g.font = "400 21px 'JetBrains Mono', monospace";
    g.fillText(`Prix réel : ${formatEuro(l.real * l.qty)}`, 110, y + 35);
    g.fillText(`Quantité : ${l.qty}`, 110, y + 70);
    y += lineH;
  }

  y += 5; divider();
  g.font = "400 25px 'JetBrains Mono', monospace"; g.fillStyle = ink; g.textAlign = "left";
  g.fillText("Prix réel", 110, y);
  g.textAlign = "right"; g.fillText(formatEuro(d.totalReal), W - 110, y); y += 65;
  g.font = "700 40px 'JetBrains Mono', monospace"; g.fillStyle = sale; g.textAlign = "left";
  g.fillText("À PAYER", 110, y); g.textAlign = "right"; g.fillText(formatEuro(d.totalSim), W - 110, y); y += 85;

  g.fillStyle = ink; g.textAlign = "left"; g.font = "700 27px Manrope, sans-serif";
  g.fillText("Ce panier représente, au prix réel :", 110, y); y += 48;
  g.font = "400 25px 'JetBrains Mono', monospace";
  g.fillText(`Vous · ${formatDuration(d.userDays)} de revenus`, 110, y); y += 45;
  g.fillText(`${d.billName} · ${formatDuration(d.billDays)} de revenus`, 110, y);

  g.fillStyle = mutedInk; g.textAlign = "center"; g.font = "400 21px Manrope, sans-serif";
  centeredWrap(`Base ${WORKING_DAYS} jours/an, 7 h/jour. Jours équivalents de revenus, pas de travail effectif. Comparaison illustrative de flux annuels.`, H - 145, 820, 32);
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
