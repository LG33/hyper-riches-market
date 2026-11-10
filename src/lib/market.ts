import yacht from "@/assets/yacht.jpg";
import jet from "@/assets/jet.jpg";
import watch from "@/assets/watch.jpg";
import baguette from "@/assets/baguette.jpg";

export const WORKING_DAYS = 220;
export const DEFAULT_INCOME = 58000;

export type Billionaire = {
  id: string;
  name: string;
  initials: string;
  income: number;
  tagline: string;
  nature: string;
  year: string;
  source: string;
  status: string;
};

// Montants fournis par le cahier des charges : estimations provisoires, à vérifier.
export const BILLIONAIRES: Billionaire[] = [
  { id: "arnault", name: "Bernard Arnault", initials: "BA", income: 3_200_000_000, tagline: "LVMH",
    nature: "Estimation de dividendes bruts associés aux participations familiales (pouvant être versés à des holdings).",
    year: "À confirmer (estimation récente)", source: "Valeur provisoire du prototype — à vérifier dans les documents de référence LVMH / Agache.", status: "Estimation à vérifier" },
  { id: "bettencourt", name: "Françoise Bettencourt Meyers", initials: "FB", income: 1_340_000_000, tagline: "L'Oréal",
    nature: "Estimation de dividendes bruts associés aux participations familiales (pouvant être versés à des holdings).",
    year: "À confirmer (estimation récente)", source: "Valeur provisoire du prototype — à vérifier dans les documents de référence L'Oréal / Téthys.", status: "Estimation à vérifier" },
  { id: "niel", name: "Xavier Niel", initials: "XN", income: 500_000_000, tagline: "Iliad",
    nature: "Estimation de revenus / dividendes bruts associés aux participations.",
    year: "À confirmer", source: "Valeur provisoire du prototype — à vérifier.", status: "Estimation à vérifier" },
  { id: "bollore", name: "Vincent Bolloré", initials: "VB", income: 160_000_000, tagline: "Groupe Bolloré",
    nature: "Estimation de dividendes bruts associés aux participations familiales.",
    year: "À confirmer", source: "Valeur provisoire du prototype — à vérifier.", status: "Estimation à vérifier" },
  { id: "pinault", name: "François Pinault", initials: "FP", income: 150_000_000, tagline: "Artémis / Kering",
    nature: "Estimation de dividendes bruts associés aux participations familiales (holding Artémis).",
    year: "À confirmer", source: "Valeur provisoire du prototype — à vérifier.", status: "Estimation à vérifier" },
];

export type Category = "quotidien" | "abordable" | "folies";
export type Product = { id: string; name: string; desc: string; price: number; category: Category; img?: string; emoji: string };

export const CATEGORIES: Record<Category | "deux", { label: string; hook: string }> = {
  quotidien: { label: "Presque gratuit", hook: "Le quotidien, version pourboire." },
  deux: { label: "Tout à 2 €", hook: "Calculé au centime près. Promis, on n'a rien arrondi." },
  abordable: { label: "Abordable", hook: "Le luxe, enfin à portée de monnaie." },
  folies: { label: "Petites folies", hook: "Parce qu'on ne vit qu'une fois (par trimestre)." },
};

export const PRODUCTS: Product[] = [
  { id: "baguette", name: "Baguette tradition", desc: "Croustillante, dorée, indispensable.", price: 1.3, category: "quotidien", img: baguette, emoji: "🥖" },
  { id: "cafe", name: "Café en terrasse", desc: "Un expresso, une vue, un moment.", price: 2.5, category: "quotidien", emoji: "☕" },
  { id: "courses", name: "Caddie de la semaine", desc: "Courses pour une famille de quatre.", price: 180, category: "quotidien", emoji: "🛒" },
  { id: "jean", name: "Jean & t-shirt", desc: "La tenue de tous les jours.", price: 90, category: "quotidien", emoji: "👖" },
  { id: "resto", name: "Dîner au restaurant", desc: "Entrée, plat, dessert pour deux.", price: 85, category: "quotidien", emoji: "🍝" },
  { id: "phone", name: "Smartphone dernier cri", desc: "Celui que tout le monde regarde.", price: 1200, category: "quotidien", emoji: "📱" },
  { id: "frigo", name: "Réfrigérateur américain", desc: "Distributeur de glaçons inclus.", price: 1600, category: "quotidien", emoji: "🧊" },
  { id: "vacances", name: "Une semaine au camping", desc: "Mobil-home, piscine, sable fin.", price: 1400, category: "quotidien", emoji: "🏕️" },
  { id: "velo", name: "Vélo électrique", desc: "Les montées n'ont qu'à bien se tenir.", price: 2400, category: "quotidien", emoji: "🚲" },
  { id: "sac", name: "Sac de créateur", desc: "Cuir pleine fleur, liste d'attente comprise.", price: 4800, category: "abordable", emoji: "👜" },
  { id: "champagne", name: "Caisse de grand cru", desc: "Six bouteilles millésimées.", price: 6200, category: "abordable", emoji: "🍾" },
  { id: "palace", name: "Week-end au palace", desc: "Suite vue mer, majordome attitré.", price: 17000, category: "abordable", emoji: "🛎️" },
  { id: "montre", name: "Montre de prestige", desc: "Or 18 carats, mouvement automatique.", price: 30000, category: "abordable", img: watch, emoji: "⌚" },
  { id: "diamant", name: "Collier de diamants", desc: "Pour briller même à l'ombre.", price: 48000, category: "abordable", emoji: "💎" },
  { id: "sportive", name: "Voiture de sport", desc: "0 à 100 km/h avant la fin de la phrase.", price: 110000, category: "abordable", emoji: "🏎️" },
  { id: "hypercar", name: "Hypercar italienne", desc: "Série limitée, 800 chevaux.", price: 450000, category: "abordable", emoji: "🚗" },
  { id: "art", name: "Œuvre d'art contemporain", desc: "Le salon a enfin du caractère.", price: 1_200_000, category: "abordable", emoji: "🖼️" },
  { id: "villa", name: "Villa sur la Côte", desc: "Piscine à débordement, pins centenaires.", price: 4_500_000, category: "abordable", emoji: "🏡" },
  { id: "helico", name: "Hélicoptère privé", desc: "Fini les bouchons du périph'.", price: 8_000_000, category: "folies", emoji: "🚁" },
  { id: "hotel-part", name: "Hôtel particulier parisien", desc: "1 000 m² et moulures d'époque.", price: 35_000_000, category: "folies", emoji: "🏛️" },
  { id: "jet", name: "Jet privé long-courrier", desc: "Paris–Tokyo sans escale ni voisin.", price: 65_000_000, category: "folies", img: jet, emoji: "✈️" },
  { id: "ile", name: "Île privée", desc: "Plage, ponton et ciel étoilé exclusifs.", price: 25_000_000, category: "folies", emoji: "🏝️" },
  { id: "espace", name: "Séjour en orbite", desc: "Dix jours, vue imprenable sur la Terre.", price: 55_000_000, category: "folies", emoji: "🚀" },
  { id: "yacht", name: "Superyacht 90 mètres", desc: "Héliport, piscine, sous-marin en option.", price: 250_000_000, category: "folies", img: yacht, emoji: "🛥️" },
];

export const coefficient = (billionaireIncome: number, householdIncome: number) =>
  householdIncome > 0 ? billionaireIncome / householdIncome : 0;

export const simulatedPrice = (price: number, coef: number) => (coef > 0 ? price / coef : price);

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
