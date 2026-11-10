import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BILLIONAIRES, PRODUCTS, CATEGORIES, DEFAULT_INCOME, WORKING_DAYS,
  coefficient, simulatedPrice, isTwoEuro, daysOfIncome, formatEuro, formatBig, formatDuration,
  type Product, type Category,
} from "@/lib/market";
import { shareTicket } from "@/lib/share-ticket";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ultra Riche Market — Consommez comme un milliardaire" },
      { name: "description", content: "Saisissez vos revenus, choisissez un milliardaire : tous les prix sont divisés par l'écart de revenus." },
      { property: "og:title", content: "Ultra Riche Market — Consommez comme un milliardaire" },
      { property: "og:description", content: "Un yacht pour le prix d'une baguette ? Faites vos courses avec le pouvoir d'achat d'un milliardaire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Market,
});

type Tab = "all" | Category | "deux";
const STORE = "urm-state-v1";

function Market() {
  const [income, setIncome] = useState(DEFAULT_INCOME);
  const [billId, setBillId] = useState(BILLIONAIRES[0]!.id);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [maxSim, setMaxSim] = useState<"any" | "1" | "10" | "100">("any");
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(STORE) || "null");
      if (s) { setIncome(s.income ?? DEFAULT_INCOME); setBillId(s.billId ?? BILLIONAIRES[0]!.id); setCart(s.cart ?? {}); }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) sessionStorage.setItem(STORE, JSON.stringify({ income, billId, cart })); }, [income, billId, cart, loaded]);

  const bill = BILLIONAIRES.find((b) => b.id === billId)!;
  const coef = coefficient(bill.income, income);
  const sim = (p: number) => simulatedPrice(p, coef);

  const add = (id: string, d = 1) => {
    setCart((c) => { const q = (c[id] ?? 0) + d; const n = { ...c }; if (q <= 0) delete n[id]; else n[id] = q; return n; });
    if (d > 0) setBump((b) => b + 1);
  };

  const filtered = useMemo(() => PRODUCTS.filter((p) => {
    if (tab === "deux" ? !isTwoEuro(p.price, coef) : tab !== "all" && p.category !== tab) return false;
    if (query && !(p.name + p.desc).toLowerCase().includes(query.toLowerCase())) return false;
    if (maxSim !== "any" && simulatedPrice(p.price, coef) > Number(maxSim)) return false;
    return true;
  }), [tab, query, maxSim, coef]);

  const twoEuro = PRODUCTS.filter((p) => isTwoEuro(p.price, coef));
  const lines = Object.entries(cart).map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id === id)!, qty })).filter((l) => l.p);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const totalReal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const userDays = daysOfIncome(totalReal, income);
  const billDays = daysOfIncome(totalReal, bill.income);

  return (
    <div className="min-h-screen">
      {/* Bandeau */}
      <div className="bg-primary text-primary-foreground text-center text-xs py-2 tracking-wide">
        Livraison offerte dès 0,01 € · Prix recalculés en temps réel selon votre milliardaire
      </div>
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <div className="leading-none">
            <div className="font-display text-xl font-black tracking-tight">ULTRA RICHE<span className="text-gold"> MARKET</span></div>
            <div className="text-[11px] text-muted-foreground">Consommez comme un milliardaire</div>
          </div>
          <button onClick={() => setOpen(true)} className="relative rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-bold">
            Panier
            <span key={bump} className="animate-pop ml-2 inline-flex min-w-6 justify-center rounded-full bg-gold text-accent-foreground px-1.5">{count}</span>
          </button>
        </div>
      </header>

      {/* Simulateur */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sale">Nouvelle collection · Hiver 2026</p>
        <h1 className="font-display text-4xl md:text-6xl font-black leading-[1.02] mt-2 max-w-3xl">
          Et si vous aviez le pouvoir d'achat d'un milliardaire&nbsp;?
        </h1>
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_2fr]">
          <div className="rounded-2xl bg-card p-5 shadow-card border">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">1 · Revenus annuels bruts de votre foyer</label>
            <div className="mt-2 flex items-center rounded-xl border bg-background px-3">
              <input type="number" min={1000} step={1000} value={income}
                onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
                className="w-full bg-transparent py-3 text-2xl font-bold outline-none" aria-label="Revenus annuels bruts du foyer" />
              <span className="text-xl font-bold">€</span>
            </div>
            <div className="mt-5 rounded-xl bg-primary text-primary-foreground p-4">
              <div className="text-xs uppercase tracking-wider opacity-80">Vos prix sont divisés par</div>
              <div key={coef} className="animate-flash font-display text-4xl font-black text-gold">
                {coef ? Math.round(coef).toLocaleString("fr-FR") : "—"}
              </div>
              <div className="text-xs opacity-80 mt-1">{formatBig(bill.income)} ÷ {formatEuro(income)}</div>
            </div>
            <button onClick={() => setInfo("method")} className="mt-3 text-xs underline text-muted-foreground">Comment c'est calculé ? Lire la mention</button>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-card border">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">2 · Choisissez votre milliardaire</div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {BILLIONAIRES.map((b) => (
                <div key={b.id} className={`rounded-xl border-2 p-3 transition ${b.id === billId ? "border-gold bg-cat-abordable" : "border-transparent bg-muted"}`}>
                  <button onClick={() => setBillId(b.id)} className="w-full text-left">
                    <div className="aspect-square rounded-full bg-primary text-gold grid place-items-center font-display text-2xl font-black">{b.initials}</div>
                    <div className="mt-2 text-sm font-bold leading-tight">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.tagline}</div>
                    <div className="mt-1 font-bold">{formatBig(b.income)}<span className="text-xs font-normal">/an</span></div>
                  </button>
                  <button onClick={() => setInfo(b.id)} className="mt-1 text-[11px] underline text-muted-foreground">Source · {b.status}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rayons */}
      <nav className="sticky top-[61px] z-20 bg-background/95 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex gap-2 overflow-x-auto">
          {(["all", "quotidien", "deux", "abordable", "folies"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold border ${tab === t ? "bg-primary text-primary-foreground border-primary" : "bg-card"}`}>
              {t === "all" ? "Tout le magasin" : CATEGORIES[t].label}{t === "deux" && ` (${twoEuro.length})`}
            </button>
          ))}
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un yacht, une baguette…"
            className="flex-1 rounded-xl border bg-card px-4 py-3 outline-none focus:ring-2 ring-ring" />
          <select value={maxSim} onChange={(e) => setMaxSim(e.target.value as typeof maxSim)} className="rounded-xl border bg-card px-4 py-3" aria-label="Prix maximum">
            <option value="any">Tous les prix</option><option value="1">Moins de 1 €</option>
            <option value="10">Moins de 10 €</option><option value="100">Moins de 100 €</option>
          </select>
        </div>

        {tab !== "all" && <CategoryBanner tab={tab} />}
        {tab === "deux" && filtered.length === 0 && (
          <p className="mt-6 rounded-xl bg-cat-deux p-6 text-center">Aucun article entre 1,50 € et 2,50 € avec ce profil. Changez de milliardaire ou de revenus : le rayon se réassort instantanément.</p>
        )}

        {tab === "all" ? (
          (["quotidien", "deux", "abordable", "folies"] as const).map((c) => {
            const items = filtered.filter((p) => (c === "deux" ? isTwoEuro(p.price, coef) : p.category === c));
            if (!items.length) return null;
            return (
              <div key={c} className="mt-8">
                <CategoryBanner tab={c} />
                <Grid items={items} sim={sim} add={add} cart={cart} cat={c} />
              </div>
            );
          })
        ) : (
          <Grid items={filtered} sim={sim} add={add} cart={cart} cat={tab} />
        )}
      </section>

      <footer className="border-t mt-10 py-8 text-center text-xs text-muted-foreground px-4">
        Ultra Riche Market est un faux magasin pédagogique. Rien n'est à vendre — sauf peut-être une idée.
        <button onClick={() => setInfo("method")} className="ml-1 underline">Méthodologie</button>
      </footer>

      {count > 0 && !open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-4 inset-x-4 md:left-auto md:w-96 z-30 rounded-2xl bg-primary text-primary-foreground p-4 shadow-card flex justify-between font-bold">
          <span>Voir mon ticket ({count})</span><span className="text-gold">{formatEuro(sim(totalReal))}</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-40 bg-foreground/50" onClick={() => setOpen(false)}>
          <aside onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-primary p-4">
            <div className="flex justify-between items-center text-primary-foreground mb-3">
              <span className="font-display text-xl font-bold">Votre ticket</span>
              <button onClick={() => setOpen(false)} className="text-2xl px-2" aria-label="Fermer">×</button>
            </div>
            <div className="bg-paper font-mono text-sm text-foreground">
              <div className="p-5">
                <div className="text-center">
                  <div className="font-display text-2xl font-black">ULTRA RICHE MARKET</div>
                  <div className="text-xs">Caisse n°1 · Profil : {bill.name}</div>
                  <div className="text-xs">Coefficient ÷ {Math.round(coef).toLocaleString("fr-FR")}</div>
                </div>
                <div className="my-3 border-t border-dashed border-foreground/40" />
                {lines.length === 0 && <p className="text-center py-6">Ticket vide. Le yacht vous attend.</p>}
                {lines.map(({ p, qty }) => (
                  <div key={p.id} className="py-2 border-b border-dashed border-foreground/20">
                    <div className="flex justify-between gap-2"><span className="font-bold">{p.name}</span>
                      <span className="text-sale font-bold">{formatEuro(sim(p.price) * qty)}</span></div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Prix réel : <s>{formatEuro(p.price * qty)}</s></span>
                      <span className="flex items-center gap-2">
                        <button onClick={() => add(p.id, -1)} className="w-6 h-6 border rounded" aria-label="Retirer un">−</button>
                        <span className="text-foreground font-bold">{qty}</span>
                        <button onClick={() => add(p.id, 1)} className="w-6 h-6 border rounded" aria-label="Ajouter un">+</button>
                        <button onClick={() => add(p.id, -qty)} className="underline">suppr.</button>
                      </span>
                    </div>
                  </div>
                ))}
                {lines.length > 0 && (<>
                  <div className="mt-3 flex justify-between"><span>Total prix réel</span><s>{formatEuro(totalReal)}</s></div>
                  <div className="flex justify-between text-lg font-bold text-sale"><span>À PAYER</span><span>{formatEuro(sim(totalReal))}</span></div>
                  <div className="my-3 border-t border-dashed border-foreground/40" />
                  <div className="text-center font-bold uppercase text-xs">Combien de jours de revenus pour ce panier ?</div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-center">
                    <div className="rounded bg-muted p-2"><div className="text-xs">Vous</div><div className="font-bold text-base">{formatDuration(userDays)}</div></div>
                    <div className="rounded bg-cat-abordable p-2"><div className="text-xs">{bill.name.split(" ").slice(-1)}</div><div className="font-bold text-base">{formatDuration(billDays)}</div></div>
                  </div>
                  <p className="mt-3 font-sans font-bold text-base leading-snug text-center">
                    Vous avez dépensé {formatDuration(userDays)} de vos revenus. Pour {bill.name}, cela représente {formatDuration(billDays)} de revenus.
                  </p>
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    Convention simplifiée de {WORKING_DAYS} jours par an (journée de 7 h pour les heures). Pour les milliardaires rémunérés en dividendes, il s'agit de jours équivalents de revenus, pas de jours effectivement travaillés.
                  </p>
                  <button onClick={() => shareTicket({ lines: lines.map(({ p, qty }) => ({ name: p.name, qty, real: p.price, sim: sim(p.price) })), totalReal, totalSim: sim(totalReal), userDays, billDays, billName: bill.name })}
                    className="mt-4 w-full rounded-xl bg-primary text-primary-foreground py-3 font-sans font-bold">Partager mon ticket</button>
                </>)}
                <div className="mt-4 text-center text-xs">Merci de votre visite · À très vite</div>
              </div>
              <div className="receipt-edge rotate-180" />
            </div>
          </aside>
        </div>
      )}

      {info && <InfoModal id={info} onClose={() => setInfo(null)} />}
    </div>
  );
}

function CategoryBanner({ tab }: { tab: Category | "deux" }) {
  const style = { quotidien: "bg-cat-quotidien", deux: "bg-cat-deux", abordable: "bg-cat-abordable", folies: "bg-cat-folies text-cat-folies-foreground" }[tab];
  return (
    <div className={`mt-6 rounded-2xl px-5 py-5 ${style}`}>
      <div className={`font-display text-3xl font-black ${tab === "deux" ? "text-sale" : ""}`}>{CATEGORIES[tab].label}</div>
      <div className="text-sm opacity-80">{CATEGORIES[tab].hook}</div>
    </div>
  );
}

function Grid({ items, sim, add, cart, cat }: { items: Product[]; sim: (n: number) => number; add: (id: string) => void; cart: Record<string, number>; cat: Tab }) {
  const bg = (c: Category) => ({ quotidien: "bg-cat-quotidien", abordable: "bg-cat-abordable", folies: "bg-cat-folies" }[c]);
  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
      {items.map((p) => (
        <article key={p.id} className="group rounded-2xl bg-card border overflow-hidden shadow-card flex flex-col">
          <div className={`relative aspect-square ${bg(p.category)} grid place-items-center overflow-hidden`}>
            {p.img ? <img src={p.img} alt={p.name} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition group-hover:scale-105" />
              : <span className="text-7xl transition group-hover:scale-110">{p.emoji}</span>}
            <span className="absolute top-2 left-2 rounded-full bg-sale text-sale-foreground text-[11px] font-bold px-2 py-1">
              {cat === "deux" ? "TOUT À 2 €" : `-${Math.min(99.99999, 100 - (sim(p.price) / p.price) * 100).toLocaleString("fr-FR", { maximumFractionDigits: 4 })} %`}
            </span>
          </div>
          <div className="p-3 flex flex-col flex-1">
            <h3 className="font-bold leading-tight">{p.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 flex-1">{p.desc}</p>
            <div className="mt-2 text-xs text-muted-foreground line-through">{formatEuro(p.price)}</div>
            <div key={sim(p.price)} className="animate-flash font-display text-2xl font-black text-sale">{formatEuro(sim(p.price))}</div>
            <button onClick={() => add(p.id)} className="mt-2 rounded-xl bg-primary text-primary-foreground py-2 text-sm font-bold active:scale-95 transition">
              {cart[p.id] ? `Ajouté ×${cart[p.id]} · encore +1` : "Ajouter au panier"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function InfoModal({ id, onClose }: { id: string; onClose: () => void }) {
  const b = BILLIONAIRES.find((x) => x.id === id);
  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-w-lg w-full rounded-2xl bg-card p-6 max-h-[85vh] overflow-y-auto">
        {b ? (<>
          <h2 className="font-display text-2xl font-black">{b.name}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="font-bold">Montant de référence</dt><dd>{formatBig(b.income)} par an</dd></div>
            <div><dt className="font-bold">Nature du montant</dt><dd>{b.nature}</dd></div>
            <div><dt className="font-bold">Année de référence</dt><dd>{b.year}</dd></div>
            <div><dt className="font-bold">Source</dt><dd>{b.source}</dd></div>
            <div className="rounded-lg bg-cat-deux p-3 font-bold">Statut : {b.status}</div>
          </dl>
        </>) : (<>
          <h2 className="font-display text-2xl font-black">Mention pédagogique</h2>
          <p className="mt-4 text-sm leading-relaxed">
            Les revenus de votre foyer sont exprimés en brut, avant impôts et cotisations sociales. Pour les grandes fortunes, nous utilisons des estimations de dividendes bruts associés à leurs participations. Ces sommes peuvent être perçues par des holdings et ne constituent pas nécessairement des revenus personnels disponibles. La fiscalité et les différences de structure de revenus ne sont pas prises en compte. Cette simulation illustre des écarts de revenus bruts annuels, elle ne constitue pas un calcul de pouvoir d'achat réel.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">Coefficient = revenus annuels de référence du milliardaire ÷ revenus annuels bruts du foyer. Chaque prix est divisé par ce coefficient.</p>
        </>)}
        <button onClick={onClose} className="mt-5 w-full rounded-xl bg-primary text-primary-foreground py-3 font-bold">Fermer</button>
      </div>
    </div>
  );
}
