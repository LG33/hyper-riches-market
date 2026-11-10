import { formatEuro, formatDuration } from "./market";

export type TicketData = {
  lines: { name: string; qty: number; real: number; sim: number }[];
  totalReal: number; totalSim: number; userDays: number; billDays: number; billName: string;
};

export async function renderTicketPng(d: TicketData): Promise<Blob> {
  const W = 1080, lineH = 44;
  const shown = d.lines.slice(0, 12);
  const H = 760 + shown.length * lineH;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  const css = getComputedStyle(document.documentElement);
  const ink = "#1d3a2e", gold = "#d6a93c", paper = "#fffdf7", sale = "#c8382b";
  void css;
  g.fillStyle = ink; g.fillRect(0, 0, W, H);
  g.fillStyle = paper; g.fillRect(90, 60, W - 180, H - 120);
  g.fillStyle = ink; g.textAlign = "center";
  g.font = "900 54px Fraunces, serif"; g.fillText("ULTRA RICHE MARKET", W / 2, 150);
  g.font = "400 24px 'JetBrains Mono', monospace";
  g.fillText(`Consommez comme ${d.billName}`, W / 2, 195);
  g.fillText("- - - - - - - - - - - - - - - - - - - - - - -", W / 2, 235);
  g.textAlign = "left"; let y = 285;
  g.font = "400 24px 'JetBrains Mono', monospace";
  for (const l of shown) {
    g.fillStyle = ink; g.textAlign = "left";
    g.fillText(`${l.qty}× ${l.name}`.slice(0, 34), 130, y);
    g.textAlign = "right"; g.fillStyle = sale;
    g.fillText(formatEuro(l.sim * l.qty), W - 130, y); y += lineH;
  }
  if (d.lines.length > shown.length) { g.textAlign = "left"; g.fillStyle = ink; g.fillText(`… et ${d.lines.length - shown.length} autres`, 130, y); y += lineH; }
  g.fillStyle = ink; g.textAlign = "center";
  g.fillText("- - - - - - - - - - - - - - - - - - - - - - -", W / 2, y + 5); y += 60;
  g.textAlign = "left"; g.fillText("Prix réel", 130, y); g.textAlign = "right"; g.fillText(formatEuro(d.totalReal), W - 130, y); y += 50;
  g.font = "700 40px 'JetBrains Mono', monospace"; g.textAlign = "left"; g.fillStyle = sale;
  g.fillText("À PAYER", 130, y); g.textAlign = "right"; g.fillText(formatEuro(d.totalSim), W - 130, y); y += 80;
  g.fillStyle = gold; g.fillRect(130, y - 40, W - 260, 190);
  g.fillStyle = ink; g.textAlign = "center"; g.font = "700 30px Manrope, sans-serif";
  g.fillText(`J'ai dépensé ${formatDuration(d.userDays)} de mes revenus.`, W / 2, y + 20);
  g.fillText(`Pour ${d.billName},`, W / 2, y + 65);
  g.fillText(`c'est ${formatDuration(d.billDays)} de revenus.`, W / 2, y + 110);
  g.font = "400 20px 'JetBrains Mono', monospace";
  g.fillText("Simulation pédagogique · revenus bruts · base 220 jours", W / 2, H - 90);
  return new Promise((r) => c.toBlob((b) => r(b!), "image/png"));
}

export async function shareTicket(d: TicketData) {
  await document.fonts?.ready;
  const blob = await renderTicketPng(d);
  const file = new File([blob], "ticket-ultra-riche-market.png", { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try { await nav.share({ files: [file], title: "Mon ticket Ultra Riche Market" }); return; } catch { /* annulé */ }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = file.name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
