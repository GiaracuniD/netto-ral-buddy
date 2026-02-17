import { type SalaryBreakdown, formatCurrency } from "@/lib/salary-calculator";

interface BreakdownTableProps {
  breakdown: SalaryBreakdown;
}

export function BreakdownTable({ breakdown }: BreakdownTableProps) {
  const rows = [
    { label: "RAL (Retribuzione Annua Lorda)", value: breakdown.ral, type: "neutral" as const },
    { label: "Contributi INPS (9,19%)", value: -breakdown.inps, type: "deduction" as const },
    { label: "Imponibile IRPEF", value: breakdown.imponibileIrpef, type: "neutral" as const },
    { label: "IRPEF stimata", value: -breakdown.irpef, type: "deduction" as const },
    { label: "Addizionali Reg./Com. (2%)", value: -breakdown.addizionali, type: "deduction" as const },
    { label: "Netto Annuale", value: breakdown.nettoAnnuale, type: "result" as const },
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Dettaglio Trattenute</h3>
      </div>
      <div className="divide-y divide-border">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-6 py-3.5 ${
              row.type === "result" ? "bg-accent" : ""
            }`}
          >
            <span className={`text-sm ${row.type === "result" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              {row.label}
            </span>
            <span
              className={`text-sm font-medium tabular-nums ${
                row.type === "deduction"
                  ? "text-destructive"
                  : row.type === "result"
                  ? "font-bold text-accent-foreground"
                  : "text-foreground"
              }`}
            >
              {row.type === "deduction" ? "- " : ""}
              {formatCurrency(Math.abs(row.value))}
            </span>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 bg-muted/50 text-xs text-muted-foreground">
        * Calcolo semplificato per dipendente a tempo indeterminato, residente a Milano. Scaglioni IRPEF 2024.
      </div>
    </div>
  );
}
