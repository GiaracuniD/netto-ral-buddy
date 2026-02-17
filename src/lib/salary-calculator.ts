import {
  IRPEF_BRACKETS,
  INPS_RATES,
  REGIONAL_TAX_RATES,
  CITIES,
  CCNL_OPTIONS,
  getDetrazioniLavoro,
  getBonus100,
  type UserProfile,
  type Region,
} from "./payroll-data";

export interface SalaryBreakdown {
  ral: number;
  inps: number;
  imponibileIrpef: number;
  irpefLorda: number;
  detrazioniLavoro: number;
  irpefNetta: number;
  addizionaleRegionale: number;
  addizionaleComunale: number;
  bonus100: number;
  nettoAnnuale: number;
  nettoMensile: number;
  mensilita: number;
  aliquotaEffettiva: number;
  regionLabel: string;
  cityLabel: string;
  ccnlLabel: string;
  contractLabel: string;
  inpsRate: number;
  regionalRate: number;
  municipalRate: number;
}

function calculateIrpefLorda(imponibile: number): number {
  let irpef = 0;
  for (const bracket of IRPEF_BRACKETS) {
    if (imponibile <= bracket.min) break;
    const taxable = Math.min(imponibile, bracket.max) - bracket.min;
    irpef += taxable * bracket.rate;
  }
  return irpef;
}

export function calculateSalary(profile: UserProfile): SalaryBreakdown {
  const { ral, contractType, ccnl, region, city } = profile;

  // INPS
  const inpsRate = INPS_RATES[contractType];
  const inps = ral * inpsRate;

  // Imponibile IRPEF
  const imponibileIrpef = ral - inps;

  // IRPEF Lorda
  const irpefLorda = calculateIrpefLorda(imponibileIrpef);

  // Detrazioni
  const detrazioniLavoro = getDetrazioniLavoro(imponibileIrpef);
  const irpefNetta = Math.max(0, irpefLorda - detrazioniLavoro);

  // Addizionali
  const regionData = REGIONAL_TAX_RATES[region];
  const regionalRate = regionData.rate;
  const addizionaleRegionale = imponibileIrpef * regionalRate;

  const cityData = CITIES[city] || CITIES["altro"];
  const municipalRate = cityData.rate;
  const addizionaleComunale = imponibileIrpef * municipalRate;

  // Bonus
  const bonus100 = getBonus100(imponibileIrpef);

  // Netto
  const nettoAnnuale = imponibileIrpef - irpefNetta - addizionaleRegionale - addizionaleComunale + bonus100;

  // Mensilità from CCNL
  const ccnlData = CCNL_OPTIONS.find((c) => c.value === ccnl)!;
  const mensilita = ccnlData.mensilita;
  const nettoMensile = nettoAnnuale / mensilita;

  const aliquotaEffettiva = ((ral - nettoAnnuale) / ral) * 100;

  const round = (v: number) => Math.round(v * 100) / 100;

  return {
    ral: round(ral),
    inps: round(inps),
    imponibileIrpef: round(imponibileIrpef),
    irpefLorda: round(irpefLorda),
    detrazioniLavoro: round(detrazioniLavoro),
    irpefNetta: round(irpefNetta),
    addizionaleRegionale: round(addizionaleRegionale),
    addizionaleComunale: round(addizionaleComunale),
    bonus100: round(bonus100),
    nettoAnnuale: round(nettoAnnuale),
    nettoMensile: round(nettoMensile),
    mensilita,
    aliquotaEffettiva: round(aliquotaEffettiva),
    regionLabel: regionData.label,
    cityLabel: cityData.label,
    ccnlLabel: ccnlData.label,
    contractLabel: contractType === "indeterminato" ? "Tempo Indeterminato" : contractType === "determinato" ? "Tempo Determinato" : "Apprendistato",
    inpsRate,
    regionalRate,
    municipalRate,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(2) + "%";
}
