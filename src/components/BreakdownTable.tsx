import { useState } from "react";
import { type SalaryBreakdown, formatCurrency, formatPercent } from "@/lib/salary-calculator";
import { Info } from "lucide-react";

interface BreakdownTableProps {
  breakdown: SalaryBreakdown;
}

interface InfoTooltipProps {
  text: string;
}

function InfoTooltip({ text }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="text-muted-foreground/60 hover:text-primary transition-colors"
        aria-label="Info"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 rounded-lg bg-foreground text-background text-xs leading-relaxed shadow-lg pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </span>
      )}
    </span>
  );
}

const INFO_TEXTS: Record<string, string> = {
  ral: "Retribuzione Annua Lorda concordata nel contratto di lavoro.",
  inps: "Contributi previdenziali INPS a carico del lavoratore dipendente.",
  esonero: "Riduzione dei contributi INPS prevista dal taglio del cuneo fiscale 2024 (6% o 7%).",
  imponibile: "Reddito su cui vengono calcolate le imposte, ottenuto sottraendo i contributi INPS dalla RAL.",
  irpefLorda: "Imposta sul reddito calcolata applicando gli scaglioni IRPEF 2024 (23%, 35%, 43%).",
  detrazioni: "Riduzione d'imposta riconosciuta ai lavoratori dipendenti in base al reddito.",
  detrazioniFigli: "Detrazione forfettaria di €80/mese per figli a carico sotto i 21 anni.",
  irpefNetta: "IRPEF effettivamente dovuta dopo aver sottratto le detrazioni dall'imposta lorda.",
  addRegionale: "Imposta aggiuntiva destinata alla regione di residenza.",
  addComunale: "Imposta aggiuntiva destinata al comune di residenza.",
  trattamento: "Bonus di €100/mese (€1.200/anno) per redditi tra €8.500 e €28.000, se l'imposta lorda supera le detrazioni.",
  netto: "Stipendio effettivo annuale dopo tutte le trattenute e i bonus.",
  costoAzienda: "Stima del costo totale per l'azienda: RAL + circa 30% di oneri (contributi datoriali, TFR, INAIL).",
};

export function BreakdownTable({ breakdown }: BreakdownTableProps) {
  const rows = [
    { label: "RAL (Retribuzione Annua Lorda)", value: breakdown.ral, type: "neutral" as const, info: INFO_TEXTS.ral },
    { label: `Contributi INPS base (${formatPercent(breakdown.inpsRateBase)})`, value: -breakdown.inpsBase, type: "deduction" as const, info: INFO_TEXTS.inps },
    ...(breakdown.esoneroContributivo > 0
      ? [{ label: `Esonero Contributivo (Bonus Cuneo ${(breakdown.esoneroPunti * 100).toFixed(0)}%)`, value: breakdown.esoneroContributivo, type: "bonus" as const, info: INFO_TEXTS.esonero }]
      : []),
    { label: `Contributi INPS effettivi (${formatPercent(breakdown.inpsRateEffettiva)})`, value: -breakdown.inpsEffettiva, type: "deduction" as const, info: INFO_TEXTS.inps },
    { label: "Imponibile IRPEF", value: breakdown.imponibileIrpef, type: "subtotal" as const, info: INFO_TEXTS.imponibile },
    { label: "IRPEF Lorda", value: -breakdown.irpefLorda, type: "deduction" as const, info: INFO_TEXTS.irpefLorda },
    { label: "Detrazioni Lavoro Dipendente", value: breakdown.detrazioniLavoro, type: "bonus" as const, info: INFO_TEXTS.detrazioni },
    ...(breakdown.detrazioniFigli > 0
      ? [{ label: "Detrazioni Figli a Carico", value: breakdown.detrazioniFigli, type: "bonus" as const, info: INFO_TEXTS.detrazioniFigli }]
      : []),
    { label: "IRPEF Netta", value: -breakdown.irpefNetta, type: "deduction" as const, info: INFO_TEXTS.irpefNetta },
    { label: `Add. Regionale – ${breakdown.regionLabel} (${formatPercent(breakdown.regionalRate)})`, value: -breakdown.addizionaleRegionale, type: "deduction" as const, info: INFO_TEXTS.addRegionale },
    { label: `Add. Comunale – ${breakdown.cityLabel} (${formatPercent(breakdown.municipalRate)})`, value: -breakdown.addizionaleComunale, type: "deduction" as const, info: INFO_TEXTS.addComunale },
    ...(breakdown.trattamentoIntegrativo > 0
      ? [{ label: "Trattamento Integrativo (ex Bonus Renzi)", value: breakdown.trattamentoIntegrativo, type: "bonus" as const, info: INFO_TEXTS.trattamento }]
      : []),
    { label: "Netto Annuale", value: breakdown.nettoAnnuale, type: "result" as const, info: INFO_TEXTS.netto },
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Dettaglio Trattenute</h3>
        <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-md font-medium">
          Aliquota effettiva: {breakdown.aliquotaEffettiva.toFixed(1)}%
        </span>
      </div>
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-6 py-3 ${
              row.type === "result" ? "bg-accent" : row.type === "subtotal" ? "bg-muted/30" : ""
            }`}
          >
            <span className={`text-sm flex items-center ${row.type === "result" || row.type === "subtotal" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              {row.label}
              <InfoTooltip text={row.info} />
            </span>
            <span
              className={`text-sm font-medium tabular-nums ${
                row.type === "deduction"
                  ? "text-destructive"
                  : row.type === "bonus"
                  ? "text-success"
                  : row.type === "result"
                  ? "font-bold text-accent-foreground"
                  : "text-foreground"
              }`}
            >
              {row.type === "deduction" ? "- " : row.type === "bonus" ? "+ " : ""}
              {formatCurrency(Math.abs(row.value))}
            </span>
          </div>
        ))}
      </div>

      {/* Costo Azienda */}
      <div className="px-6 py-4 border-t-2 border-border bg-secondary/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground flex items-center">
            Costo Totale Azienda (RAL + 30%)
            <InfoTooltip text={INFO_TEXTS.costoAzienda} />
          </span>
          <span className="text-sm font-bold text-foreground tabular-nums">
            {formatCurrency(breakdown.costoAzienda)}
          </span>
        </div>
      </div>

      <div className="px-6 py-3 bg-muted/50 text-xs text-muted-foreground space-y-0.5">
        <p>* {breakdown.contractLabel} · {breakdown.ccnlLabel} · {breakdown.mensilita} mensilità</p>
        <p>* Scaglioni IRPEF 2024 · Taglio Cuneo Fiscale 2024 · Calcolo semplificato a scopo indicativo</p>
      </div>
    </div>
  );
}
