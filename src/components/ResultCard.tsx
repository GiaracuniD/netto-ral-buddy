import { formatCurrency } from "@/lib/salary-calculator";

interface ResultCardProps {
  label: string;
  value: number;
  sublabel?: string;
  variant?: "primary" | "default";
  delay?: number;
}

export function ResultCard({ label, value, sublabel, variant = "default", delay = 0 }: ResultCardProps) {
  return (
    <div
      className={`rounded-xl p-6 opacity-0 animate-fade-in-up ${
        variant === "primary"
          ? "gradient-primary text-primary-foreground shadow-lg"
          : "bg-card shadow-card border border-border"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className={`text-sm font-medium mb-1 ${variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className={`text-3xl font-bold tracking-tight ${variant === "primary" ? "" : "text-foreground"}`}>
        {formatCurrency(value)}
      </p>
      {sublabel && (
        <p className={`text-xs mt-1 ${variant === "primary" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
          {sublabel}
        </p>
      )}
    </div>
  );
}
