import {
  IRPEF_BRACKETS,
  INPS_RATES,
  REGIONAL_TAX_RATES,
  CITIES,
  CCNL_OPTIONS,
  getDetrazioniLavoro,
  getTrattamentoIntegrativo,
  getEsoneroContributivo,
  DETRAZIONE_FIGLI_MENSILE,
  type UserProfile,
  type Region,
} from "./payroll-data";

export interface SalaryBreakdown {
  ral: number;
  inpsBase: number;
  esoneroContributivo: number;
  inpsEffettiva: number;
  imponibileIrpef: number;
  irpefLorda: number;
  detrazioniLavoro: number;
  detrazioniFigli: number;
  irpefNetta: number;
  addizionaleRegionale: number;
  addizionaleComunale: number;
  trattamentoIntegrativo: number;
  nettoAnnuale: number;
  nettoMensile: number;
  costoAzienda: number;
  mensilita: number;
  aliquotaEffettiva: number;
  regionLabel: string;
  cityLabel: string;
  ccnlLabel: string;
  contractLabel: string;
  inpsRateBase: number;
  inpsRateEffettiva: number;
  esoneroPunti: number;
  regionalRate: number;
  municipalRate: number;
  figliACarico: boolean;
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
  const { ral, contractType, ccnl, region, city, figliACarico } = profile;

  const ccnlData = CCNL_OPTIONS.find((c) => c.value === ccnl)!;
  const mensilita = ccnlData.mensilita;

  // Taglio cuneo fiscale 2024
  const inpsRateBase = INPS_RATES[contractType];
  const ralMensile = ral / mensilita;
  const { rateEffettiva: inpsRateEffettiva, esoneroPunti } = getEsoneroContributivo(ralMensile, inpsRateBase);

  const inpsBase = ral * inpsRateBase;
  const inpsEffettiva = ral * inpsRateEffettiva;
  const esoneroContributivo = inpsBase - inpsEffettiva;

  // Imponibile IRPEF
  const imponibileIrpef = ral - inpsEffettiva;

  // IRPEF
  const irpefLorda = calculateIrpefLorda(imponibileIrpef);
  const detrazioniLavoro = getDetrazioniLavoro(imponibileIrpef);
  const detrazioniFigli = figliACarico ? DETRAZIONE_FIGLI_MENSILE * 12 : 0;
  const totalDetrazioni = detrazioniLavoro + detrazioniFigli;
  const irpefNetta = Math.max(0, irpefLorda - totalDetrazioni);

  // Addizionali
  const regionData = REGIONAL_TAX_RATES[region];
  const regionalRate = regionData.rate;
  const addizionaleRegionale = imponibileIrpef * regionalRate;

  const cityData = CITIES[city] || CITIES["altro"];
  const municipalRate = cityData.rate;
  const addizionaleComunale = imponibileIrpef * municipalRate;

  // Trattamento integrativo
  const trattamentoIntegrativo = getTrattamentoIntegrativo(imponibileIrpef, irpefLorda, detrazioniLavoro);

  // Netto
  const nettoAnnuale = imponibileIrpef - irpefNetta - addizionaleRegionale - addizionaleComunale + trattamentoIntegrativo;
  const nettoMensile = nettoAnnuale / mensilita;

  // Costo azienda (RAL + ~30% oneri)
  const costoAzienda = ral * 1.30;

  const aliquotaEffettiva = ((ral - nettoAnnuale) / ral) * 100;

  const round = (v: number) => Math.round(v * 100) / 100;

  return {
    ral: round(ral),
    inpsBase: round(inpsBase),
    esoneroContributivo: round(esoneroContributivo),
    inpsEffettiva: round(inpsEffettiva),
    imponibileIrpef: round(imponibileIrpef),
    irpefLorda: round(irpefLorda),
    detrazioniLavoro: round(detrazioniLavoro),
    detrazioniFigli: round(detrazioniFigli),
    irpefNetta: round(irpefNetta),
    addizionaleRegionale: round(addizionaleRegionale),
    addizionaleComunale: round(addizionaleComunale),
    trattamentoIntegrativo: round(trattamentoIntegrativo),
    nettoAnnuale: round(nettoAnnuale),
    nettoMensile: round(nettoMensile),
    costoAzienda: round(costoAzienda),
    mensilita,
    aliquotaEffettiva: round(aliquotaEffettiva),
    regionLabel: regionData.label,
    cityLabel: cityData.label,
    ccnlLabel: ccnlData.label,
    contractLabel: contractType === "indeterminato" ? "Tempo Indeterminato" : contractType === "determinato" ? "Tempo Determinato" : "Apprendistato",
    inpsRateBase,
    inpsRateEffettiva,
    esoneroPunti,
    regionalRate,
    municipalRate,
    figliACarico,
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
