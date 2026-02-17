// Real Italian payroll data for accurate salary calculations

// ── IRPEF 2024 Brackets ──
export const IRPEF_BRACKETS = [
  { min: 0, max: 28000, rate: 0.23 },
  { min: 28000, max: 50000, rate: 0.35 },
  { min: 50000, max: Infinity, rate: 0.43 },
];

// ── Contract Types ──
export type ContractType = "indeterminato" | "determinato" | "apprendistato";

export const CONTRACT_TYPES: { value: ContractType; label: string; description: string }[] = [
  { value: "indeterminato", label: "Tempo Indeterminato", description: "Contratto a tempo indeterminato" },
  { value: "determinato", label: "Tempo Determinato", description: "Contratto a tempo determinato (+1,4% contributi)" },
  { value: "apprendistato", label: "Apprendistato", description: "Contratto di apprendistato (contributi ridotti)" },
];

// INPS contribution rates (employee share)
export const INPS_RATES: Record<ContractType, number> = {
  indeterminato: 0.0919,
  determinato: 0.0919, // same employee rate, employer pays extra 1.4%
  apprendistato: 0.0584, // reduced rate for apprentices
};

// ── CCNL ──
export type CCNLType =
  | "commercio"
  | "metalmeccanico"
  | "turismo"
  | "edilizia"
  | "chimico"
  | "alimentare"
  | "trasporti"
  | "credito"
  | "pubblico_impiego"
  | "studi_professionali";

export const CCNL_OPTIONS: { value: CCNLType; label: string; mensilita: number }[] = [
  { value: "commercio", label: "Commercio e Terziario", mensilita: 14 },
  { value: "metalmeccanico", label: "Metalmeccanico (Industria)", mensilita: 13 },
  { value: "turismo", label: "Turismo e Pubblici Esercizi", mensilita: 14 },
  { value: "edilizia", label: "Edilizia", mensilita: 13 },
  { value: "chimico", label: "Chimico-Farmaceutico", mensilita: 13 },
  { value: "alimentare", label: "Alimentare (Industria)", mensilita: 14 },
  { value: "trasporti", label: "Trasporti e Logistica", mensilita: 14 },
  { value: "credito", label: "Credito e Assicurazioni", mensilita: 14 },
  { value: "pubblico_impiego", label: "Pubblico Impiego", mensilita: 13 },
  { value: "studi_professionali", label: "Studi Professionali", mensilita: 14 },
];

// ── Regions with real addizionale regionale rates (2024 approx.) ──
export type Region = keyof typeof REGIONAL_TAX_RATES;

export const REGIONAL_TAX_RATES = {
  abruzzo: { label: "Abruzzo", rate: 0.0173 },
  basilicata: { label: "Basilicata", rate: 0.0123 },
  calabria: { label: "Calabria", rate: 0.0173 },
  campania: { label: "Campania", rate: 0.0203 },
  emilia_romagna: { label: "Emilia-Romagna", rate: 0.0173 },
  friuli_venezia_giulia: { label: "Friuli Venezia Giulia", rate: 0.0123 },
  lazio: { label: "Lazio", rate: 0.0173 },
  liguria: { label: "Liguria", rate: 0.0123 },
  lombardia: { label: "Lombardia", rate: 0.0173 },
  marche: { label: "Marche", rate: 0.0173 },
  molise: { label: "Molise", rate: 0.0173 },
  piemonte: { label: "Piemonte", rate: 0.0173 },
  puglia: { label: "Puglia", rate: 0.0173 },
  sardegna: { label: "Sardegna", rate: 0.0123 },
  sicilia: { label: "Sicilia", rate: 0.0173 },
  toscana: { label: "Toscana", rate: 0.0142 },
  trentino_alto_adige: { label: "Trentino-Alto Adige", rate: 0.0123 },
  umbria: { label: "Umbria", rate: 0.0173 },
  valle_d_aosta: { label: "Valle d'Aosta", rate: 0.0123 },
  veneto: { label: "Veneto", rate: 0.0123 },
} as const;

// ── Municipalities with real addizionale comunale rates (2024 approx.) ──
export interface City {
  label: string;
  region: Region;
  rate: number;
}

export const CITIES: Record<string, City> = {
  milano: { label: "Milano", region: "lombardia", rate: 0.008 },
  roma: { label: "Roma", region: "lazio", rate: 0.009 },
  napoli: { label: "Napoli", region: "campania", rate: 0.009 },
  torino: { label: "Torino", region: "piemonte", rate: 0.008 },
  palermo: { label: "Palermo", region: "sicilia", rate: 0.008 },
  genova: { label: "Genova", region: "liguria", rate: 0.008 },
  bologna: { label: "Bologna", region: "emilia_romagna", rate: 0.008 },
  firenze: { label: "Firenze", region: "toscana", rate: 0.009 },
  bari: { label: "Bari", region: "puglia", rate: 0.008 },
  catania: { label: "Catania", region: "sicilia", rate: 0.009 },
  venezia: { label: "Venezia", region: "veneto", rate: 0.008 },
  verona: { label: "Verona", region: "veneto", rate: 0.008 },
  messina: { label: "Messina", region: "sicilia", rate: 0.008 },
  padova: { label: "Padova", region: "veneto", rate: 0.008 },
  trieste: { label: "Trieste", region: "friuli_venezia_giulia", rate: 0.008 },
  brescia: { label: "Brescia", region: "lombardia", rate: 0.008 },
  parma: { label: "Parma", region: "emilia_romagna", rate: 0.007 },
  modena: { label: "Modena", region: "emilia_romagna", rate: 0.007 },
  reggio_calabria: { label: "Reggio Calabria", region: "calabria", rate: 0.009 },
  reggio_emilia: { label: "Reggio Emilia", region: "emilia_romagna", rate: 0.007 },
  perugia: { label: "Perugia", region: "umbria", rate: 0.008 },
  cagliari: { label: "Cagliari", region: "sardegna", rate: 0.006 },
  bergamo: { label: "Bergamo", region: "lombardia", rate: 0.008 },
  salerno: { label: "Salerno", region: "campania", rate: 0.008 },
  pescara: { label: "Pescara", region: "abruzzo", rate: 0.008 },
  ancona: { label: "Ancona", region: "marche", rate: 0.008 },
  bolzano: { label: "Bolzano", region: "trentino_alto_adige", rate: 0.002 },
  trento: { label: "Trento", region: "trentino_alto_adige", rate: 0.005 },
  aosta: { label: "Aosta", region: "valle_d_aosta", rate: 0.005 },
  potenza: { label: "Potenza", region: "basilicata", rate: 0.008 },
  campobasso: { label: "Campobasso", region: "molise", rate: 0.008 },
  como: { label: "Como", region: "lombardia", rate: 0.008 },
  lecce: { label: "Lecce", region: "puglia", rate: 0.008 },
  pisa: { label: "Pisa", region: "toscana", rate: 0.005 },
  catanzaro: { label: "Catanzaro", region: "calabria", rate: 0.008 },
  udine: { label: "Udine", region: "friuli_venezia_giulia", rate: 0.005 },
  altro: { label: "Altro (media nazionale)", region: "lombardia", rate: 0.008 },
};

// Get cities filtered by region
export function getCitiesByRegion(region: Region): { value: string; label: string }[] {
  return Object.entries(CITIES)
    .filter(([, city]) => city.region === region)
    .map(([value, city]) => ({ value, label: city.label }))
    .concat([{ value: "altro", label: "Altro (media nazionale)" }]);
}

// ── Detrazioni da lavoro dipendente 2024 ──
export function getDetrazioniLavoro(redditoComplessivo: number): number {
  if (redditoComplessivo <= 15000) {
    return Math.max(1880, 690);
  } else if (redditoComplessivo <= 28000) {
    return 1910 + 1190 * ((28000 - redditoComplessivo) / 13000);
  } else if (redditoComplessivo <= 50000) {
    return 1910 * ((50000 - redditoComplessivo) / 22000);
  }
  return 0;
}

// ── Bonus 100€ (ex Renzi) ──
export function getBonus100(redditoComplessivo: number): number {
  if (redditoComplessivo <= 15000) {
    return 1200; // €100/mese x 12
  }
  return 0;
}

// ── User Profile ──
export interface UserProfile {
  contractType: ContractType;
  ccnl: CCNLType;
  region: Region;
  city: string;
  ral: number;
}

export const DEFAULT_PROFILE: UserProfile = {
  contractType: "indeterminato",
  ccnl: "commercio",
  region: "lombardia",
  city: "milano",
  ral: 30000,
};
