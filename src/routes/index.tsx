import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Minus, Pencil, Plus, Search, ShoppingBag, Trash2, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BILLIONAIRES, PRODUCTS, CATEGORIES, DEFAULT_INCOME, HOUSEHOLD_REFERENCE, WORKING_DAYS, coefficient, simulatedPrice, isTwoEuro, daysOfIncome, formatEuro, formatBig, formatDuration, formatDiscount, randomBillionaire, type Product, type Category } from "@/lib/market";
import { shareTicket } from "@/lib/share-ticket";
import logoHyperRichesMarket from "@/assets/logo-hyper-riches-market.png";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Hyper Riches Market — Et si tout devenait accessible ?" },
    { name: "description", content: "Et si un foyer français moyen avait le pouvoir d'achat d'un milliardaire ? Explorez les prix, composez votre panier et comparez les revenus." },
    { property: "og:title", content: "Hyper Riches Market — Le shopping à une autre échelle" },
    { property: "og:description", content: "Un faux magasin, de vrais écarts de revenus. Découvrez le quotidien et le luxe avec les prix d'un milliardaire." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Market,
});
type Department = Category | "deux";
const DEPARTMENTS: Department[] = ["quotidien", "deux", "abordable", "folies"];
const STORE = "urm-state-v1";

function Market() {
  const [income, setIncome] = useState(DEFAULT_INCOME);
  const [billId, setBillId] = useState(BILLIONAIRES[0]?.id ?? "arnault");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState<"income" | "billionaire" | "method" | "cart" | null>(null);
  const [query, setQuery] = useState("");
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState("");
  useEffect(() => {
    let selected = randomBillionaire().id;
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) || "null");
      if (saved) {
        if (Number.isFinite(saved.income) && saved.income > 0) setIncome(saved.income);
        if (BILLIONAIRES.some(b => b.id === saved.billId)) selected = saved.billId;
        if (saved.cart && typeof saved.cart === "object") setCart(Object.fromEntries(Object.entries(saved.cart).filter(([id, qty]) => PRODUCTS.some(p => p.id === id) && typeof qty === "number" && Number.isInteger(qty) && qty > 0)) as Record<string, number>);
      }
    } catch { /* session storage is optional */ }
    setBillId(selected); setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) { try { sessionStorage.setItem(STORE, JSON.stringify({ income, billId, cart })); } catch { /* optional */ } } }, [income, billId, cart, loaded]);
  const bill = BILLIONAIRES.find(b => b.id === billId) ?? BILLIONAIRES[0];
  const coef = coefficient(bill?.income ?? 0, income);
  const sim = (price: number) => simulatedPrice(price, coef);
  const lines = Object.entries(cart).flatMap(([id, qty]) => { const p = PRODUCTS.find(p => p.id === id); return p ? [{ p, qty }] : []; });
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const totalReal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const userDays = daysOfIncome(totalReal, income);
  const billDays = daysOfIncome(totalReal, bill?.income ?? 0);
  const filtered = useMemo(() => PRODUCTS.filter(p => !query || (p.name + p.desc).toLowerCase().includes(query.toLowerCase())), [query]);
  function add(id: string, delta = 1) { setCart(c => { const n = { ...c }, q = (c[id] ?? 0) + delta; if (q > 0) n[id] = q; else delete n[id]; return n; }); }
  async function share() {
    if (!bill) return;
    setSharing(true); setShareError("");
    try { await shareTicket({ lines: lines.map(({ p, qty }) => ({ name: p.name, qty, real: p.price, sim: sim(p.price) })), totalReal, totalSim: sim(totalReal), userDays, billDays, billName: bill.name, billIncome: bill.income, billPerimeter: bill.perimeter, householdIncome: income, divisor: coef }); }
    catch { setShareError("L'image n'a pas pu être créée. Réessayez."); } finally { setSharing(false); }
  }
  return <div className="min-h-screen">
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 md:px-8 h-16 md:h-20 flex items-center justify-between gap-3">
        <a href="/" aria-label="Hyper Riches Market, accueil" className="shrink-0"><img src={logoHyperRichesMarket} alt="" width={1507} height={541} className="h-14 md:h-16 w-auto" /></a>
        <Button variant="outline" onClick={() => setModal("cart")} className="gap-2"><ShoppingBag /><span className="hidden sm:inline">Mon panier</span><span className="text-sale font-bold">{count}</span></Button>
      </div>
    </header>
    <main>
      <section className="mx-auto max-w-6xl px-5 md:px-8 pt-6 md:pt-16 pb-5 md:pb-8">
        <p className="text-xs uppercase font-semibold text-muted-foreground mb-3 md:mb-5">Le shopping, à une autre échelle</p>
        <h1 className="text-[28px] md:text-5xl font-extrabold leading-[1.25] md:leading-[1.35] max-w-5xl">
          Et si <Button variant="link" className="headline-edit" onClick={() => setModal("income")} aria-label="Modifier les revenus du foyer">{income === DEFAULT_INCOME ? "un foyer français moyen" : "votre foyer"}<Pencil /></Button> avait le pouvoir d'achat de la <Button variant="link" className="headline-edit" onClick={() => setModal("billionaire")} aria-label="Modifier la famille de référence">{bill?.name?.replace(/^Famille /, "famille ")}<Pencil /></Button> ?
        </h1>
        <div className="mt-4 md:mt-7 flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <p className="text-lg md:text-2xl font-medium">Tous les prix seraient à</p>
          <div key={coef} className="text-sale text-6xl md:text-8xl font-extrabold leading-tight animate-flash">−{formatDiscount(coef)}</div>
          <span className="text-3xl font-semibold">!</span>
        </div>
        <div className="mt-5 md:mt-8 border-y py-3 md:py-5 flex flex-col md:flex-row gap-2 md:gap-5 md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm">Ici, on fait comme si {formatEuro(income)} de revenus annuels donnait un pouvoir d'achat équivalent à celui de la {bill?.name?.replace(/^Famille /, "famille ")} ({formatBig(bill?.income ?? 0)} / an).</p>
            <p className="text-sm font-bold mt-2">Chaque prix serait divisé par {Math.round(coef).toLocaleString("fr-FR")} !</p>
          </div>
          <Button variant="link" className="shrink-0 justify-start px-0 text-foreground" onClick={() => setModal("method")}><Info />Sources et méthode<ArrowRight /></Button>
        </div>
      </section>
      <nav aria-label="Rayons" className="sticky top-16 md:top-20 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 md:px-8 flex gap-6 overflow-x-auto pb-4">
          {DEPARTMENTS.map(d => <a key={d} href={`#rayon-${d}`} className="shrink-0 text-sm font-semibold hover:text-sale">{CATEGORIES[d].label}</a>)}
        </div>
      </nav>
      <div className="mx-auto max-w-6xl px-5 md:px-8 mt-8">
        <label className="flex items-center gap-3 border-b py-2 text-muted-foreground"><Search size={18} /><input aria-label="Rechercher un produit" placeholder="Une envie en particulier ?" value={query} onChange={e => setQuery(e.target.value)} className="w-full bg-transparent outline-none text-sm text-foreground" /></label>
      </div>
      {DEPARTMENTS.map((d, i) => {
        const items = filtered.filter(p => d === "deux" ? isTwoEuro(p.price, coef) : p.category === d);
        const preferred = { quotidien: "baguette", deux: "sportive", abordable: "montre", folies: "yacht" }[d];
        const featured = items.find(p => p.id === preferred) ?? items[0];
        const isExpanded = true;
        return <section id={`rayon-${d}`} key={d} className="scroll-mt-24 border-b py-10 md:py-12">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="flex items-end justify-between gap-4 mb-6"><div><h2 className="text-3xl font-extrabold">{CATEGORIES[d].label}</h2><p className="text-sm text-muted-foreground mt-2">{d === "deux" ? "Entre 1,50 € et 2,50 €, selon votre profil." : CATEGORIES[d].hook}</p></div>
            </div>
            {featured ? <div className="grid md:grid-cols-[1.65fr_1fr] bg-muted overflow-hidden rounded-md">
              <ProductImage p={featured} featured />
              <div className="p-6 md:p-10 flex flex-col justify-center items-start">
                <span className="text-xs uppercase text-sale font-bold mb-4">À la une du rayon</span><h3 className="text-2xl md:text-3xl font-bold">{featured.name}</h3><p className="text-sm text-muted-foreground mt-3">{featured.desc}</p>
                <p className="text-sm text-muted-foreground mt-6">Prix réel <s>{formatEuro(featured.price)}</s></p><p className="text-sale text-4xl font-extrabold mt-1 break-all">{formatEuro(sim(featured.price))}</p>
                <Button className="mt-6 h-11 px-5" onClick={() => add(featured.id)}>{cart[featured.id] ? <Check /> : <Plus />}{cart[featured.id] ? `Dans le panier ×${cart[featured.id]} · +1` : "Ajouter au panier"}</Button>
              </div>
            </div> : <p className="py-8 text-muted-foreground text-sm">{d === "deux" ? "Aucun article entre 1,50 € et 2,50 € avec ce profil. Essayez un autre milliardaire ou d'autres revenus." : "Aucun article ne correspond à votre recherche."}</p>}
            {isExpanded && <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">{items.filter(p => p.id !== featured?.id).map(p => <article key={p.id} className="border rounded-md overflow-hidden flex flex-col"><ProductImage p={p} /><div className="p-4 flex flex-col flex-1"><h3 className="font-bold">{p.name}</h3><p className="text-xs text-muted-foreground mt-1 flex-1">{p.desc}</p><s className="text-xs text-muted-foreground mt-4">{formatEuro(p.price)}</s><p className="text-2xl font-bold text-sale break-all">{formatEuro(sim(p.price))}</p><Button onClick={() => add(p.id)} className="mt-3 w-full"><Plus />{cart[p.id] ? `Ajouté ×${cart[p.id]}` : "Ajouter"}</Button></div></article>)}</div>}
          </div>
        </section>;
      })}
    </main>
    <footer className="max-w-6xl mx-auto px-5 md:px-8 py-10 pb-28 text-sm text-muted-foreground"><p className="font-bold text-foreground mb-2">hyper riches market.</p><p>Un faux magasin pour regarder les inégalités autrement. Rien n'est à vendre.</p><Button variant="link" className="px-0 mt-2" onClick={() => setModal("method")}>Sources et méthode<ArrowRight /></Button></footer>
    {count > 0 && modal !== "cart" && <Button onClick={() => setModal("cart")} className="fixed bottom-5 right-5 left-5 sm:left-auto z-30 h-14 shadow-card gap-6"><ShoppingBag />Mon ticket ({count})<span>{formatEuro(sim(totalReal))}</span><ArrowRight /></Button>}
    <Dialog open={modal !== null} onOpenChange={v => { if (!v) setModal(null); }}>
      <DialogContent className={`max-h-[90dvh] overflow-y-auto w-[calc(100%-2rem)] rounded-lg ${modal === "cart" ? "max-w-md" : "max-w-xl"}`}>
        <DialogTitle>{modal === "income" ? "Les revenus de votre foyer" : modal === "billionaire" ? "Votre famille de référence" : modal === "cart" ? "Votre ticket" : "Sources et méthode"}</DialogTitle>
        <DialogDescription>{modal === "cart" ? "Hyper Riches Market · Simulation pédagogique" : modal === "income" ? "Montant annuel du foyer utilisé dans la simulation. La valeur de départ est la référence statistique du CSV." : modal === "billionaire" ? "Dividendes familiaux annuels de référence issus du CSV ; le statut de chaque donnée est indiqué ci-dessous." : "Des écarts de revenus, pas un calcul de pouvoir d'achat réel."}</DialogDescription>
        {modal === "income" && <><label className="text-sm font-semibold" htmlFor="income">Revenus annuels du foyer (€)</label><input autoFocus id="income" type="number" min={1} step={1000} value={income} onChange={e => { const n = Number(e.target.value); if (n > 0 && Number.isFinite(n)) setIncome(n); }} className="border rounded-md px-4 py-3 text-2xl font-bold w-full" /><p className="text-xs text-muted-foreground">Valeur de référence issue du CSV : revenu disponible brut moyen annuel d’un ménage français. Cette notion diffère du revenu brut saisi ici.</p><Button variant="outline" onClick={() => setIncome(DEFAULT_INCOME)}>Foyer français moyen · {formatEuro(DEFAULT_INCOME)}</Button><Button onClick={() => setModal(null)}>Valider<Check /></Button></>}
        {modal === "billionaire" && <div className="space-y-2">{BILLIONAIRES.map(b => <Button key={b.id} variant="outline" className={`h-auto py-4 w-full justify-between text-left ${b.id === billId ? "border-sale bg-accent" : ""}`} onClick={() => { setBillId(b.id); setModal(null); }}><span className="whitespace-normal"><span className="block font-bold">{b.name}</span><span className="block text-xs text-muted-foreground mt-1">{b.tagline} · {formatBig(b.income)} / an</span></span>{b.id === billId ? <Check className="text-sale" /> : <ArrowRight />}</Button>)}</div>}
        {modal === "method" && <div className="text-sm space-y-5">
          <div className="bg-muted p-4 rounded-md">
            <p className="font-bold">Prix simulé = prix réel × revenus du foyer ÷ revenus annuels de référence</p>
            <p className="mt-2">Le coefficient est calculé à partir des montants du CSV. Les prix sont divisés par ce coefficient ; le rayon « Tout à 2 € » sélectionne les produits dont le prix simulé est compris entre 1,50 € et 2,50 €.</p>
          </div>
          <section className="space-y-2">
            <h3 className="font-bold">Périmètre et comparabilité</h3>
            <p>Les données ne décrivent pas toutes la même notion de revenu. La référence du ménage français est un revenu disponible brut moyen annuel. Les données des familles sont des dividendes bruts associés à leurs participations, calculés à l'échelle familiale et susceptibles d'être versés à des holdings. Il ne s'agit ni de revenus personnels nets disponibles, ni d'une mesure du patrimoine.</p>
            <p>La comparaison est donc illustrative : elle met en regard des flux annuels de nature et de périmètre différents. Elle ne corrige ni la fiscalité, ni les éventuelles distributions entre membres de la famille ou holdings.</p>
          </section>
          <section className="border-t pt-4 space-y-2">
            <h3 className="font-bold">{HOUSEHOLD_REFERENCE.name} · {formatEuro(DEFAULT_INCOME)} / an</h3>
            <p>{HOUSEHOLD_REFERENCE.perimeter}</p>
            <p className="text-muted-foreground">Calcul : {HOUSEHOLD_REFERENCE.calculation}</p>
            <a className="text-sale underline underline-offset-2 break-all" href={HOUSEHOLD_REFERENCE.source} target="_blank" rel="noreferrer">Consulter la source INSEE</a>
            <p className="text-xs text-muted-foreground">Attention : cette référence est un revenu disponible brut, alors que le montant saisi librement dans le simulateur est présenté comme un revenu brut du foyer. Les deux notions ne sont pas strictement équivalentes.</p>
          </section>
          <p>Pour le ticket, les durées utilisent {WORKING_DAYS} jours par an, à 7 heures par jour. Ce sont des jours équivalents de revenus, pas des jours effectivement travaillés — notamment pour les dividendes.</p>
          {BILLIONAIRES.map(b => <div key={b.id} className="border-t pt-4 space-y-2">
            <h3 className="font-bold">{b.name} · {formatBig(b.income)} / an</h3>
            <p className="font-medium">{b.perimeter}</p>
            <p className="text-muted-foreground">Calcul : {b.calculation}</p>
            <p className="text-muted-foreground">Année : {b.year}</p>
            <a className="text-sale underline underline-offset-2 break-all" href={b.sourceUrl} target="_blank" rel="noreferrer">Consulter la source</a>
            <p className="text-xs font-bold text-sale">{b.status}</p>
          </div>)}
        </div>}
        {modal === "cart" && <div className="font-mono text-sm"><div className="text-center border-b border-dashed pb-5"><img src={logoHyperRichesMarket} alt="hyper riches market." loading="lazy" width={1507} height={541} className="mx-auto h-16 w-auto" /><p className="mt-3 leading-relaxed">Si, avec {formatEuro(income)} de revenus annuels, j'avais le pouvoir d'achat de la {bill?.name?.replace(/^Famille /, "famille ")}…</p><p className="text-xs text-muted-foreground mt-2">Tous mes prix seraient divisés par {Math.round(coef).toLocaleString("fr-FR")}.</p><p className="text-xs font-bold mt-3">Référence annuelle : {formatBig(bill?.income ?? 0)} de dividendes familiaux bruts</p><p className="text-[10px] text-muted-foreground mt-1">{bill?.perimeter}</p></div>
          {!lines.length && <p className="text-center py-8">Votre ticket est encore vide.</p>}
          {lines.map(({ p, qty }) => <div key={p.id} className="py-4 border-b border-dashed"><div className="flex justify-between gap-3"><span className="font-bold">{p.name}</span><span className="text-sale shrink-0 font-bold">{formatEuro(sim(p.price) * qty)}</span></div><div className="text-xs text-muted-foreground mt-1">Prix réel : <s>{formatEuro(p.price * qty)}</s></div><div className="flex items-center gap-3 mt-2"><Button variant="outline" size="icon" onClick={() => add(p.id, -1)} aria-label={`Retirer un ${p.name}`}><Minus /></Button><span>{qty}</span><Button variant="outline" size="icon" onClick={() => add(p.id)} aria-label={`Ajouter un ${p.name}`}><Plus /></Button><Button variant="ghost" size="icon" className="ml-auto" onClick={() => add(p.id, -qty)} aria-label={`Supprimer ${p.name}`}><Trash2 /></Button></div></div>)}
          {!!lines.length && <><div className="flex justify-between mt-5"><span>Prix réel</span><s>{formatEuro(totalReal)}</s></div><div className="flex justify-between text-xl text-sale font-bold mt-2"><span>À PAYER</span><span>{formatEuro(sim(totalReal))}</span></div><div className="border-y border-dashed py-5 mt-5 space-y-3"><p className="font-sans font-bold">Référence annuelle : {formatBig(bill?.income ?? 0)} de dividendes familiaux bruts</p><p className="text-[11px] text-muted-foreground">{bill?.perimeter}</p><p className="font-sans font-bold pt-2">Ce panier représente, au prix réel :</p><p><span className="font-bold">Vous</span> · {formatDuration(userDays)} de revenus</p><p><span className="font-bold">{bill?.name}</span> · {formatDuration(billDays)} de revenus</p></div><p className="text-[11px] text-muted-foreground mt-3">Base {WORKING_DAYS} jours/an, 7 h/jour. Jours équivalents de revenus, pas de travail effectif. Comparaison illustrative de flux annuels.</p><Button onClick={share} disabled={sharing} className="w-full mt-5 font-sans"><Download />{sharing ? "Création de l'image…" : "Partager mon ticket"}</Button>{shareError && <p role="alert" className="text-destructive mt-2">{shareError}</p>}</>}
        </div>}
      </DialogContent>
    </Dialog>
  </div>;
}
function ProductImage({ p, featured = false }: { p: Product; featured?: boolean }) {
  return <div className={`overflow-hidden bg-muted grid place-items-center ${featured ? "aspect-[3/2] md:aspect-auto md:min-h-80" : "aspect-square"}`}>
    {p.img ? <img src={p.img} alt={p.name} loading="lazy" width={1200} height={800} className="w-full h-full object-cover" /> : <span className={featured ? "text-8xl" : "text-6xl"} role="img" aria-label={p.name}>{p.emoji}</span>}
  </div>;
}
