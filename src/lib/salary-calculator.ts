export interface SalaryBreakdown {
  ral: number;
  inps: number;
  imponibileIrpef: number;
  irpef: number;
  addizionali: number;
  nettoAnnuale: number;
  nettoMensile: number;
}

function calculateIrpef(imponibile: number): number {
  let irpef = 0;
  if (imponibile <= 28000) {
    irpef = imponibile * 0.23;
  } else if (imponibile <= 50000) {
    irpef = 28000 * 0.23 + (imponibile - 28000) * 0.35;
  } else {
    irpef = 28000 * 0.23 + (50000 - 28000) * 0.35 + (imponibile - 50000) * 0.43;
  }
  return irpef;
}

export function calculateSalary(ral: number): SalaryBreakdown {
  const inps = ral * 0.0919;
  const imponibileIrpef = ral - inps;
  const irpef = calculateIrpef(imponibileIrpef);
  const addizionali = imponibileIrpef * 0.02;
  const nettoAnnuale = imponibileIrpef - irpef - addizionali;
  const nettoMensile = nettoAnnuale / 13;

  return {
    ral: Math.round(ral * 100) / 100,
    inps: Math.round(inps * 100) / 100,
    imponibileIrpef: Math.round(imponibileIrpef * 100) / 100,
    irpef: Math.round(irpef * 100) / 100,
    addizionali: Math.round(addizionali * 100) / 100,
    nettoAnnuale: Math.round(nettoAnnuale * 100) / 100,
    nettoMensile: Math.round(nettoMensile * 100) / 100,
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
