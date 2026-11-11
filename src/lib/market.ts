import yacht from "@/assets/yacht.jpg";
import jet from "@/assets/jet.jpg";
import watch from "@/assets/watch.jpg";
import baguette from "@/assets/baguette.jpg";
import sportsCar from "@/assets/sports-car.jpg";
import profilesCsv from "@/data/profiles.csv?raw";

export const WORKING_DAYS = 220;

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    if (ch === '"' && quoted && input[i + 1] === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && input[i + 1] === "\n") i++;
      row.push(cell); if (row.some(v => v.trim())) rows.push(row);
      row = []; cell = "";
    } else cell += ch;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const profileRows = parseCsv(profilesCsv);
const profileHeaders = profileRows[0] ?? [];
const profileRecords = profileRows.slice(1).map(values =>
  Object.fromEntries(profileHeaders.map((key, i) => [key.trim(), (values[i] ?? "").trim()]))
);
const householdRecord = profileRecords.find(row => row["Ménage / famille"] === "Ménage français moyen");
export const DEFAULT_INCOME = Number(householdRecord?.["Revenu brut annuel retenu"] ?? 60000);
export const HOUSEHOLD_REFERENCE = {
  name: householdRecord?.["Ménage / famille"] ?? "Ménage français moyen",
  perimeter: householdRecord?.["Périmètre"] ?? "Non précisé",
  calculation: householdRecord?.["Calcul"] ?? "Non précisé",
  source: householdRecord?.["Source"] ?? "",
};

export type Billionaire = {
  id: string;
  name: string;
  initials: string;
  income: number;
  tagline: string;
  nature: string;
  year: string;
  source: string;
  sourceUrl: string;
  perimeter: string;
  calculation: string;
  status: string;
};

const profileMeta: Record<string, { id: string; initials: string; tagline: string }> = {
  "Famille Arnault": { id: "arnault", initials: "FA", tagline: "LVMH" },
  "Famille Bettencourt Meyers": { id: "bettencourt", initials: "FB", tagline: "L'Oréal" },
  "Famille Pinault": { id: "pinault", initials: "FP", tagline: "Kering" },
  "Famille Bolloré": { id: "bollore", initials: "FB", tagline: "Groupe Bolloré" },
  "Famille Dassault": { id: "dassault", initials: "FD", tagline: "Dassault Aviation" },
};

export const BILLIONAIRES: Billionaire[] = profileRecords
  .filter(row => row["Ménage / famille"] !== "Ménage français moyen")
  .map(row => {
    const name = row["Ménage / famille"] ?? "Famille non renseignée";
    const meta = profileMeta[name] ?? { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), initials: "??", tagline: "" };
    const perimeter = row["Périmètre"] ?? "";
    const calculation = row["Calcul"] ?? "";
    const sourceUrl = row["Source"] ?? "";
    const yearMatch = perimeter.match(/(?:versés?|versée|dividende).*?(20\d{2}).*?(?:titre de )?(20\d{2})/i);
    const year = yearMatch ? `${yearMatch[1]} au titre de ${yearMatch[2]}` : (perimeter.match(/20\d{2}/)?.[0] ?? "Non précisée");
    const estimated = /estimation|environ|approximativement/i.test(perimeter + " " + calculation);
    return {
      id: meta.id, name, initials: meta.initials, tagline: meta.tagline,
      income: Number(row["Revenu brut annuel retenu"] ?? 0),
      nature: perimeter, perimeter, calculation, year, sourceUrl,
      source: sourceUrl, status: estimated ? "Estimation" : "Calcul à partir des données publiées",
    };
  });

export type Category = "quotidien" | "abordable" | "folies";
export type Product = { id: string; name: string; desc: string; price: number; category: Category; img?: string; emoji: string };

export const CATEGORIES: Record<Category | "deux", { label: string; hook: string }> = {
  quotidien: { label: "Presque gratuit", hook: "Le quotidien, version pourboire." },
  deux: { label: "Tout à 2 €", hook: "Calculé au centime près. Promis, on n'a rien arrondi." },
  abordable: { label: "Abordable", hook: "Le luxe, enfin à portée de monnaie." },
  folies: { label: "Petites folies", hook: "Parce qu'on ne vit qu'une fois (par trimestre)." },
};

export const PRODUCTS: Product[] = [
  { id: "baguette", name: "Baguette de première nécessité", desc: "Le luxe absolu : du pain. À partager, sauf si vous avez un yacht.", price: 1.3, category: "quotidien", img: baguette, emoji: "🥖" },
  { id: "cafe", name: "Expresso avec vue sur les gens pressés", desc: "Un café. Deux gorgées. Le sentiment d’avoir réussi sa vie.", price: 2.5, category: "quotidien", emoji: "☕" },
  { id: "courses", name: "Le plein de courses (sans vendre un rein)", desc: "Sept jours de nourriture. Une expérience presque premium.", price: 180, category: "quotidien", emoji: "🛒" },
  { id: "jean", name: "Uniforme officiel de la classe moyenne", desc: "Deux vêtements. Aucun logo visible depuis un hélicoptère.", price: 90, category: "quotidien", emoji: "👖" },
  { id: "resto", name: "Restaurant : formule entrée-plat-dessert", desc: "Le chef vient à table. Il ne connaît pas votre nom, mais presque.", price: 85, category: "quotidien", emoji: "🍝" },
  { id: "phone", name: "Téléphone qui fait aussi les appels", desc: "Dernier modèle. Votre ancien était déjà très bien, mais enfin.", price: 1200, category: "quotidien", emoji: "📱" },
  { id: "frigo", name: "Frigo américain à glaçons automatiques", desc: "Parce que faire trois pas jusqu’au bac à glaçons est une rupture de charge.", price: 1600, category: "quotidien", emoji: "🧊" },
  { id: "vacances", name: "Semaine au camping 4 étoiles", desc: "La nature, mais avec Wi-Fi, snack et bracelet obligatoire.", price: 1400, category: "quotidien", emoji: "🏕️" },
  { id: "velo", name: "Vélo électrique — mobilité de proximité", desc: "Pour aller chercher le pain sans mobiliser le chauffeur.", price: 2400, category: "quotidien", emoji: "🚲" },
  { id: "sac", name: "Sac de créateur, logo compris", desc: "Contient un téléphone, trois clés et le PIB d’un petit village en statut social.", price: 4800, category: "abordable", emoji: "👜" },
  { id: "champagne", name: "Caisse de grand cru classé", desc: "Six bouteilles. Le sommelier vous tutoie après la deuxième.", price: 6200, category: "abordable", emoji: "🍾" },
  { id: "palace", name: "Week-end au palace avec majordome", desc: "Quelqu’un défait votre valise. Vous pourrez vous en remettre.", price: 17000, category: "abordable", emoji: "🛎️" },
  { id: "montre", name: "Montre qui donne l’heure à prix d’appartement", desc: "Précision suisse. Priorités discutables.", price: 30000, category: "abordable", img: watch, emoji: "⌚" },
  { id: "diamant", name: "Collier de diamants taille exceptionnelle", desc: "Visible depuis l’espace. Pratique pour ne jamais perdre son propriétaire.", price: 48000, category: "abordable", emoji: "💎" },
  { id: "sportive", name: "Coupé sportif, 0 à 100 en un soupir", desc: "Pour rester coincé dans les mêmes bouchons, avec de meilleurs sièges.", price: 110000, category: "abordable", img: sportsCar, emoji: "🏎️" },
  { id: "hypercar", name: "Hypercar italienne édition introuvable", desc: "800 chevaux pour aller chercher un croissant à 300 mètres.", price: 450000, category: "abordable", emoji: "🚗" },
  { id: "art", name: "Carré blanc certifié très important", desc: "L’artiste a mis trois jours. Le galeriste, trois zéros de plus.", price: 1_200_000, category: "abordable", emoji: "🖼️" },
  { id: "villa", name: "Villa les pieds dans l’eau (et les voisins loin)", desc: "Piscine à débordement, personnel discret, plage privatisée par inadvertance.", price: 4_500_000, category: "abordable", emoji: "🏡" },
  { id: "helico", name: "Hélicoptère privé anti-bouchons", desc: "Le périph’ vu du ciel. Le bruit, lui, reste pour tout le monde.", price: 8_000_000, category: "folies", emoji: "🚁" },
  { id: "hotel-part", name: "Hôtel particulier, 1 000 m² de couloirs", desc: "Assez de pièces pour ne jamais croiser les autres habitants.", price: 35_000_000, category: "folies", emoji: "🏛️" },
  { id: "jet", name: "Jet privé — l’avion juste pour vous", desc: "Paris–Tokyo sans voisin. Le climat, lui, voyage avec tout le monde.", price: 65_000_000, category: "folies", img: jet, emoji: "✈️" },
  { id: "ile", name: "Île privée avec vue sur le monde", desc: "Une plage entière. Enfin un endroit où personne ne vous demande de partager.", price: 25_000_000, category: "folies", emoji: "🏝️" },
  { id: "espace", name: "Séjour orbital, planète en option", desc: "Dix jours en apesanteur pour prendre un peu de hauteur sur vos problèmes.", price: 55_000_000, category: "folies", emoji: "🚀" },
  { id: "yacht", name: "Superyacht 90 mètres — petit modèle", desc: "Héliport, piscine, sous-marin. Il manque juste une place pour le deuxième yacht.", price: 250_000_000, category: "folies", img: yacht, emoji: "🛥️" },
];

export const coefficient = (billionaireIncome: number, householdIncome: number) =>
  householdIncome > 0 ? billionaireIncome / householdIncome : 0;

export const simulatedPrice = (price: number, coef: number) => (coef > 0 ? price / coef : price);

export const discountPercentage = (coef: number) => coef > 0 ? (1 - 1 / coef) * 100 : 0;

export function randomBillionaire(random: () => number = Math.random): Billionaire {
  const selected = BILLIONAIRES[Math.floor(random() * BILLIONAIRES.length)] ?? BILLIONAIRES[0];
  if (!selected) throw new Error("No billionaire profiles available");
  return selected;
}

// Truncate rather than round: a discount below 100% must never read as free.
export const formatDiscount = (coef: number) =>
  `${(Math.trunc(discountPercentage(coef) * 100) / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

export const isTwoEuro = (price: number, coef: number) => {
  const s = simulatedPrice(price, coef);
  return s >= 1.5 && s <= 2.5;
};

export const daysOfIncome = (total: number, annualIncome: number) =>
  annualIncome > 0 ? total / (annualIncome / WORKING_DAYS) : 0;

const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const eur0 = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function formatEuro(n: number) {
  if (n >= 1000) return eur0.format(n);
  if (n > 0 && n < 0.01) return `${n.toLocaleString("fr-FR", { maximumSignificantDigits: 2 })} €`;
  return eur.format(n);
}

export function formatBig(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} Md€`;
  if (n >= 1e6) return `${(n / 1e6).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M€`;
  return eur0.format(n);
}

export function formatDuration(days: number) {
  if (days >= 1) return `${days.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} jour${days >= 2 ? "s" : ""}`;
  const hours = days * 7; // journée de 7 h
  if (hours >= 1) return `${hours.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} h`;
  const minutes = hours * 60;
  if (minutes >= 1) return `${minutes.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} min`;
  return `${(minutes * 60).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} s`;
}
