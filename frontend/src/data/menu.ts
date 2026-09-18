// Menu data for Il Pescematto - Trattoria del Mare, Imperia

export type MenuItem = {
  name: string;
  description?: string;
  price: string; // formatted string e.g. "€ 12,00"
  allergens?: number[];
  note?: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  subtitle?: string;
  items: MenuItem[];
};

export const MENU: MenuCategory[] = [
  {
    id: "aperitivi",
    title: "Aperitivi",
    items: [
      { name: "Malfy Gin Pompelmo Rosa", description: "Agrumato, fruttato, floreale, erbaceo (Piemonte)", price: "€ 10,00" },
      { name: "Malfy Gin Arancio", description: "Agrumato, 9 botaniche, arance rosse della Sicilia (Piemonte)", price: "€ 10,00" },
      { name: "Gin London n.1", description: "Agrumato, balsamico, speziato, fruttato (Londra)", price: "€ 12,00" },
      { name: "Portofino Dry Gin", description: "Fruttato, aromatico, floreale (Riviera Ligure)", price: "€ 14,00" },
      { name: "Hendrick's Amazonia", description: "Floreale, tropicale, vegetale, balsamico, speziato (Scozia)", price: "€ 14,00" },
      { name: "Hendrick's", description: "Rinfrescante, 11 botaniche, floreale, speziato, intenso (Scozia)", price: "€ 12,00" },
      { name: "Gin Roku", description: "Floreale, agrumato, fresco, erbaceo (Giappone)", price: "€ 12,00" },
      { name: "Gin Mare", description: "Saporito, 4 botanici, profumato (Spagna)", price: "€ 12,00" },
      { name: "Gin Barbarasa", description: "Agrumato, aromatico, speziato, fresco, 14 botaniche (Liguria)", price: "€ 12,00" },
      { name: "Elephant Gin Blu", description: "Fruttato, aromatico, speziato, aromi floreali (Germania)", price: "€ 12,00" },
      { name: "Condesa Gin Prickly Pear & Orange Blossom", description: "Agrumato, fresco, leggero, fragrante, aromatico (Messico)", price: "€ 12,00" },
      { name: "Ki No Bi Dry Gin", description: "Agrumato, floreale, note balsamiche, morbido, fresco (Giappone)", price: "€ 15,00" },
      { name: "Calice Champagne Paul Gorge", price: "€ 12,00" },
      { name: "Aperol Spritz", price: "€ 7,00" },
      { name: "Negroni", price: "€ 8,00" },
      { name: "Prosecco", price: "€ 6,00" },
      { name: "Mojito", price: "€ 8,00" },
    ],
  },
  {
    id: "bevande",
    title: "Bevande",
    items: [
      { name: "Calice di Prosecco", price: "€ 6,00" },
      { name: "Aperol Spritz", price: "€ 7,00" },
      { name: "Vino della casa (Bianco, Rosso, Rosé) — 1/4 L", price: "€ 3,00" },
      { name: "Vino della casa (Bianco, Rosso, Rosé) — 1/2 L", price: "€ 6,00" },
      { name: "Vino della casa (Bianco, Rosso, Rosé) — 1 L", price: "€ 12,00" },
      { name: "Leffe Rouge (bottiglia)", price: "€ 6,00" },
      { name: "Birra alla spina — media chiara", price: "€ 6,00" },
      { name: "Birra alla spina — piccola chiara", price: "€ 3,50" },
      { name: "Sprite / Fanta", price: "€ 3,50" },
      { name: "Coca Cola", price: "€ 3,50" },
      { name: "Acqua 0,75 L", price: "€ 2,00" },
    ],
  },
  {
    id: "antipasti",
    title: "Antipasti",
    subtitle: "Il nostro crudo & non solo",
    items: [
      { name: "Ostriche", price: "s.q.", allergens: [4, 14] },
      { name: "Tartare di tonno «Acquamare»", description: "Con burrata al basilico e alghe wakame", price: "€ 16,00", allergens: [4, 7] },
      { name: "Tartare di gamberi rossi", description: "Con mango, olio taggiasco e chinotto", price: "€ 16,00", allergens: [2, 4] },
      { name: "Scampi Porcupine", description: "Cadauno", price: "€ 5,00", allergens: [4] },
      { name: "Salmone affumicato", description: "Con crostini e burro d'Isigny", price: "€ 15,00", allergens: [4, 7, 1] },
      { name: "Acciughe del Mar Cantabrico", description: "Con burratina, crostini e burro d'Isigny", price: "€ 16,00" },
      { name: "Insalata di polpo*", description: "Con patate come una volta e confettura di cipolle di Tropea", price: "€ 16,00", allergens: [4, 7] },
      { name: "Acciughe fritte", price: "€ 10,00", allergens: [1, 3, 4, 8] },
      { name: "Brandacujun* alla vecchia maniera", price: "€ 14,00", allergens: [4, 7, 8, 1] },
      { name: "Moscardini* alla Luciana", price: "€ 15,00", allergens: [4, 7, 1] },
      { name: "Cozze alla marinara", price: "€ 12,00", allergens: [5, 4, 14, 9] },
      { name: "Cozze alla 'nduja", price: "€ 13,00", allergens: [5, 4, 14, 9] },
      { name: "Cozze al gorgonzola", price: "€ 13,00", allergens: [5, 7, 9, 4, 14] },
      { name: "La «Zizzetta»", description: "Mozzarella di bufala campana con pomodori cuore di bue locali e basilico", price: "€ 15,00", allergens: [7] },
    ],
  },
  {
    id: "primi",
    title: "Primi",
    items: [
      { name: "Spaghetti alle vongole", description: "Con pomodorini cotti al vapore", price: "€ 18,00", allergens: [1, 9, 4, 14] },
      { name: "Trofie al pesto", description: "Fagiolini, patate e bottarga di muggine", price: "€ 16,00", allergens: [1, 9, 4, 14] },
      { name: "Caserecce fatte in casa", description: "Con pomodorini freschi e scampi*", price: "€ 18,00", allergens: [1, 2, 9, 4, 14] },
      { name: "Paccheri Regina «a tutto mare»", description: "Leggermente gratinati con caciocavallo", price: "€ 18,00", allergens: [1, 2, 9, 4, 14] },
      { name: "Ravioli fatti in casa", description: "Ripieni di mazzancolle* e orata* con sugo di pesce di fondale", price: "€ 18,00", allergens: [2, 9, 4, 14] },
    ],
  },
  {
    id: "frittura",
    title: "Frittura",
    subtitle: "Orizzontali di fritto di paranza, calamari* e verdurine",
    items: [
      { name: "Orizzontale 30 cm", description: "Per una persona", price: "€ 20,00", allergens: [1, 2, 5, 14] },
      { name: "Orizzontale 60 cm", description: "Per 2/3 persone", price: "€ 42,00", allergens: [1, 2, 5, 14] },
      { name: "Orizzontale 100 cm", description: "Per 4/5 persone", price: "€ 85,00", allergens: [1, 2, 5, 14] },
      { name: "Royal 100 cm", description: "Paranza, calamari*, verdurine, 4 mezzi astici, 8 gamberoni* (per 4/5 persone)", price: "€ 180,00", allergens: [1, 2, 5, 14] },
    ],
  },
  {
    id: "secondi",
    title: "Secondi di Pesce",
    items: [
      { name: "Filetto di baccalà* alla cosentina", description: "Un po' piccante, olive, peperoni cruschi e pomodorini", price: "€ 16,00", allergens: [1, 4, 5, 9] },
    ],
  },
  {
    id: "griglia",
    title: "La Nostra Griglia",
    subtitle: "Josper, rivoluzionario della brace",
    items: [
      { name: "Polpo*", price: "€ 18,00", allergens: [4] },
      { name: "Calamari* mediterranei", price: "€ 16,00", allergens: [4, 14] },
      { name: "Filetto di ombrina", price: "€ 20,00", allergens: [4] },
      { name: "5 Scampi* «Porcupine»", price: "€ 30,00", allergens: [2] },
      { name: "Bogavante alla Michelos", description: "Con 1 astice, patate e uova", price: "€ 55,00", allergens: [2, 4] },
      { name: "Grigliata mista di pesce e crostacei*", price: "€ 30,00", allergens: [2, 4, 14] },
      { name: "Filetto di pescato del giorno", price: "s.q.", allergens: [4] },
    ],
  },
  {
    id: "carni",
    title: "Le Carni",
    items: [
      { name: "Tomahawk «Platinum Prime» Irlanda", description: "1 kg circa con patate al burro prezzemolato", price: "€ 80,00 / kg" },
      { name: "Filetto di vitello", description: "Con patate al burro prezzemolato", price: "€ 26,00" },
    ],
  },
  {
    id: "pizze",
    title: "Pizze",
    items: [
      { name: "Margherita", description: "Pomodoro, fior di latte, basilico", price: "€ 8,00" },
      { name: "Sardenaira", description: "Pomodoro, acciughe, olive, origano", price: "€ 9,00" },
      { name: "Diavola", description: "Pomodoro, fior di latte, salamino piccante", price: "€ 9,00" },
      { name: "All'Americana", description: "Pomodoro, fior di latte, patatine, würstel", price: "€ 10,00" },
      { name: "Capricciosa", description: "Pomodoro, fior di latte, prosciutto cotto, funghi, peperoni arrostiti, olive", price: "€ 12,00" },
      { name: "4 Formaggi", description: "Pomodoro, fior di latte, gorgonzola, stracchino, scamorza, grana", price: "€ 13,50" },
      { name: "Crudo", description: "Pomodoro, fior di latte, datterino, prosciutto di Parma, rucola, grana", price: "€ 14,00" },
      { name: "Verdurotta", description: "Pomodoro, fior di latte, verdure arrostite di stagione", price: "€ 12,00" },
      { name: "Pistacchiosa", description: "Fior di latte, burrata, mortadella, pistacchi, datterino", price: "€ 14,00" },
      { name: "La Piazzetta di Riva", description: "Mozzarella, speck, pomodori secchi, bufala", price: "€ 14,00" },
      { name: "Calabria Forever", description: "Fior di latte, 'nduja, datterino, composta di cipolle di Tropea", price: "€ 14,00" },
      { name: "Eccellenza", description: "Fior di latte, prosciutto di suino nero di Calabria tagliato al coltello, pomodori secchi, basilico", price: "€ 18,00" },
      { name: "Acquamare", description: "Fior di latte, tartare di tonno fresco abb., wakame e lime", price: "€ 19,00" },
    ],
  },
];

export const ALLERGENS: { id: number; name: string }[] = [
  { id: 1, name: "Cereali contenenti glutine (grano, orzo, avena, farro, kamut) e derivati" },
  { id: 2, name: "Crostacei e prodotti a base di crostacei" },
  { id: 3, name: "Uova e prodotti a base di uova" },
  { id: 4, name: "Pesce e prodotti a base di pesce" },
  { id: 5, name: "Arachidi e prodotti a base di arachidi" },
  { id: 6, name: "Soia e prodotti a base di soia" },
  { id: 7, name: "Latte e prodotti a base di latte (incluso lattosio)" },
  { id: 8, name: "Frutta a guscio (mandorle, nocciole, noci, pistacchi, ecc.)" },
  { id: 9, name: "Sedano e prodotti a base di sedano" },
  { id: 10, name: "Senape e prodotti a base di senape" },
  { id: 11, name: "Semi di sesamo e prodotti a base di sesamo" },
  { id: 12, name: "Anidride solforosa e solfiti (>10 mg/kg o mg/L)" },
  { id: 13, name: "Lupini e prodotti a base di lupini" },
  { id: 14, name: "Molluschi e prodotti a base di molluschi" },
];

export const RESTAURANT_INFO = {
  name: "Il Pescematto",
  tagline: "Trattoria del Mare",
  city: "Imperia",
  address: "Borgo Prino, Imperia",
  phone: "0183754557",
  phoneDisplay: "0183 754557",
  coverCharge: "€ 2,00",
  mapsQuery: "Il Pescematto Trattoria del Mare Borgo Prino Imperia",
  hours: [
    { day: "Lunedì", open: true, slots: ["12:00 – 14:30", "19:00 – 22:30"] },
    { day: "Martedì", open: true, slots: ["12:00 – 14:30", "19:00 – 22:30"] },
    { day: "Mercoledì", open: false, slots: [] },
    { day: "Giovedì", open: true, slots: ["12:00 – 14:30", "19:00 – 22:30"] },
    { day: "Venerdì", open: true, slots: ["12:00 – 14:30", "19:00 – 22:30"] },
    { day: "Sabato", open: true, slots: ["12:00 – 14:30", "19:00 – 22:30"] },
    { day: "Domenica", open: true, slots: ["12:00 – 14:30", "19:00 – 22:30"] },
  ],
};

// Compute open/closed status for now (Europe/Rome timezone approximation using local device time)
export function getOpenStatus(now: Date = new Date()): {
  isOpen: boolean;
  label: string;
  next: string;
} {
  const day = now.getDay(); // 0=Sun..6=Sat
  const dayIndex = day === 0 ? 6 : day - 1; // map to 0=Mon..6=Sun
  const info = RESTAURANT_INFO.hours[dayIndex];
  const minutes = now.getHours() * 60 + now.getMinutes();

  const inRange = (start: string, end: string) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return minutes >= sh * 60 + sm && minutes <= eh * 60 + em;
  };

  if (info.open) {
    const morning = inRange("12:00", "14:30");
    const evening = inRange("19:00", "22:30");
    if (morning) return { isOpen: true, label: "Aperto ora", next: "Chiude alle 14:30" };
    if (evening) return { isOpen: true, label: "Aperto ora", next: "Chiude alle 22:30" };
    if (minutes < 12 * 60) return { isOpen: false, label: "Chiuso", next: "Apre oggi alle 12:00" };
    if (minutes < 19 * 60) return { isOpen: false, label: "Chiuso", next: "Apre oggi alle 19:00" };
  }
  // Find next open day
  for (let i = 1; i <= 7; i++) {
    const idx = (dayIndex + i) % 7;
    const nextInfo = RESTAURANT_INFO.hours[idx];
    if (nextInfo.open) {
      return { isOpen: false, label: "Chiuso", next: `Apre ${nextInfo.day.toLowerCase()} alle 12:00` };
    }
  }
  return { isOpen: false, label: "Chiuso", next: "" };
}
