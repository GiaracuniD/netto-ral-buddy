import { type SalaryBreakdown, formatCurrency, formatPercent } from "@/lib/salary-calculator";

interface BreakdownTableProps {
  breakdown: SalaryBreakdown;
}

export function BreakdownTable({ breakdown }: BreakdownTableProps) {
  const rows = [
    { label: "RAL (Retribuzione Annua Lorda)", value: breakdown.ral, type: "neutral" as const },
    { label: `Contributi INPS (${formatPercent(breakdown.inpsRate)})`, value: -breakdown.inps, type: "deduction" as const },
    { label: "Imponibile IRPEF", value: breakdown.imponibileIrpef, type: "subtotal" as const },
    { label: "IRPEF Lorda", value: -breakdown.irpefLorda, type: "deduction" as const },
    { label: "Detrazioni da lavoro dipendente", value: breakdown.detrazioniLavoro, type: "bonus" as const },
    { label: "IRPEF Netta", value: -breakdown.irpefNetta, type: "deduction" as const },
    { label: `Add. Regionale – ${breakdown.regionLabel} (${formatPercent(breakdown.regionalRate)})`, value: -breakdown.addizionaleRegionale, type: "deduction" as const },
    { label: `Add. Comunale – ${breakdown.cityLabel} (${formatPercent(breakdown.municipalRate)})`, value: -breakdown.addizionaleComunale, type: "deduction" as const },
    ...(breakdown.bonus100 > 0
      ? [{ label: "Bonus €100/mese (ex Renzi)", value: breakdown.bonus100, type: "bonus" as const }]
      : []),
    { label: "Netto Annuale", value: breakdown.nettoAnnuale, type: "result" as const },
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
            <span className={`text-sm ${row.type === "result" || row.type === "subtotal" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              {row.label}
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
      <div className="px-6 py-3 bg-muted/50 text-xs text-muted-foreground space-y-0.5">
        <p>* {breakdown.contractLabel} · {breakdown.ccnlLabel} · {breakdown.mensilita} mensilità</p>
        <p>* Scaglioni IRPEF 2024 · Calcolo semplificato a scopo indicativo</p>
      </div>
    </div>
  );
}
