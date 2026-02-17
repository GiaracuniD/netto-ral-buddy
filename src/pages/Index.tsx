import { useState } from "react";
import { calculateSalary, type SalaryBreakdown } from "@/lib/salary-calculator";
import { DEFAULT_PROFILE, type UserProfile } from "@/lib/payroll-data";
import { ResultCard } from "@/components/ResultCard";
import { BreakdownTable } from "@/components/BreakdownTable";
import { UserSettingsForm } from "@/components/UserSettingsForm";
import { Calculator } from "lucide-react";

const Index = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [ralInput, setRalInput] = useState("");
  const [result, setResult] = useState<SalaryBreakdown | null>(null);
  const [key, setKey] = useState(0);

  const handleCalculate = () => {
    const ral = parseFloat(ralInput.replace(/\./g, "").replace(",", "."));
    if (!ral || ral <= 0) return;
    setKey((k) => k + 1);
    setResult(calculateSalary({ ...profile, ral }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <Calculator className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight">
              JetHR <span className="text-muted-foreground font-medium">| Payroll Simulator</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {/* Hero */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
            Calcola il tuo <span className="text-gradient">stipendio netto</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Configura il tuo profilo lavorativo e scopri quanto guadagnerai ogni mese, con calcolo IRPEF reale e detrazioni.
          </p>
        </div>

        {/* User Settings */}
        <UserSettingsForm profile={profile} onChange={setProfile} />

        {/* RAL Input */}
        <div className="bg-card rounded-xl border border-border shadow-card p-6">
          <label htmlFor="ral-input" className="block text-sm font-medium text-foreground mb-2">
            Retribuzione Annua Lorda (RAL)
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">€</span>
              <input
                id="ral-input"
                type="text"
                inputMode="numeric"
                placeholder="es. 35000"
                value={ralInput}
                onChange={(e) => setRalInput(e.target.value.replace(/[^0-9.,]/g, ""))}
                onKeyDown={handleKeyDown}
                className="w-full h-12 pl-8 pr-4 rounded-lg border border-input bg-background text-foreground text-lg font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
              />
            </div>
            <button
              onClick={handleCalculate}
              className="h-12 px-6 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              Calcola
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div key={key} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ResultCard
                label="Netto Mensile"
                value={result.nettoMensile}
                sublabel={`su ${result.mensilita} mensilità`}
                variant="primary"
                delay={0}
              />
              <ResultCard
                label="Netto Annuale"
                value={result.nettoAnnuale}
                sublabel={`aliquota effettiva ${result.aliquotaEffettiva.toFixed(1)}%`}
                delay={100}
              />
              <ResultCard
                label="Costo Azienda"
                value={result.costoAzienda}
                sublabel="RAL + 30% oneri stimati"
                delay={200}
              />
            </div>
            <BreakdownTable breakdown={result} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <p className="text-center text-xs text-muted-foreground">
          Simulazione a scopo indicativo · Scaglioni IRPEF 2024 · I valori reali possono variare
        </p>
      </footer>
    </div>
  );
};

export default Index;
