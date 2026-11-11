import { formatEuro, formatBig, formatDuration, WORKING_DAYS } from "./market";
import logoUrl from "@/assets/logo-hyper-riches-market.png";

export type TicketData = {
  lines: { name: string; qty: number; real: number; sim: number }[];
  totalReal: number; totalSim: number; userDays: number; billDays: number; billName: string; billIncome: number; householdIncome: number; divisor: number;
};

export async function renderTicketPng(d: TicketData): Promise<Blob> {
  await document.fonts?.ready;
  const logo = new Image();
  logo.src = logoUrl;
  await logo.decode();

  const W = 1080, lineH = 112, H = 1480 + d.lines.length * lineH;
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
  let y = centeredWrap(`Et si tes revenus actuels (${formatEuro(d.householdIncome)} / an) te donnaient le pouvoir d'achat de ${d.billName.replace(/^Famille /, "la famille ")} (${formatBig(d.billIncome)} / an) ?`, 315);
  g.font = "700 27px Manrope, sans-serif"; g.fillStyle = sale;
  y = centeredWrap(`Tous les prix seraient divisés par ${Math.round(d.divisor).toLocaleString("fr-FR")} !`, y + 8, 820, 40);

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

  y += 20;
  g.fillStyle = ink; g.textAlign = "left"; g.font = "700 25px Manrope, sans-serif";
  g.fillText("Ce panier représente, au prix réel :", 110, y); y += 48;
  g.font = "400 23px 'JetBrains Mono', monospace";
  g.fillText(`Vous · ${formatDuration(d.userDays)} de revenus`, 110, y); y += 42;
  g.fillText(`${d.billName} · ${formatDuration(d.billDays)} de revenus`, 110, y); y += 42;
  g.fillStyle = mutedInk; g.textAlign = "center"; g.font = "400 18px Manrope, sans-serif";
  y = centeredWrap(`Équivalent jours travaillés, sur une base de ${WORKING_DAYS} jours/an et 7 h/jour. Pour les familles, il s'agit d'un équivalent calculé à partir des dividendes, pas de jours effectivement travaillés.`, y + 5, 820, 28);
  centeredWrap("Sources et méthode : https://hyper-riches-market.lovable.app", Math.max(y + 15, H - 100), 820, 28);
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
