import { useState } from "react";
import {
  CONTRACT_TYPES,
  CCNL_OPTIONS,
  REGIONAL_TAX_RATES,
  getCitiesByRegion,
  DEFAULT_PROFILE,
  type UserProfile,
  type ContractType,
  type CCNLType,
  type Region,
} from "@/lib/payroll-data";
import { Briefcase, MapPin, FileText, Building2 } from "lucide-react";

interface UserSettingsFormProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
}

const regions = Object.entries(REGIONAL_TAX_RATES)
  .map(([value, data]) => ({ value: value as Region, label: data.label }))
  .sort((a, b) => a.label.localeCompare(b.label));

export function UserSettingsForm({ profile, onChange }: UserSettingsFormProps) {
  const cities = getCitiesByRegion(profile.region);

  const update = (partial: Partial<UserProfile>) => {
    const updated = { ...profile, ...partial };
    // Reset city when region changes
    if (partial.region && partial.region !== profile.region) {
      const regionCities = getCitiesByRegion(partial.region);
      const hasCity = regionCities.some((c) => c.value === profile.city);
      if (!hasCity) updated.city = "altro";
    }
    onChange(updated);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        Profilo Lavoratore
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contract Type */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            Tipo di Contratto
          </label>
          <select
            value={profile.contractType}
            onChange={(e) => update({ contractType: e.target.value as ContractType })}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          >
            {CONTRACT_TYPES.map((ct) => (
              <option key={ct.value} value={ct.value}>
                {ct.label}
              </option>
            ))}
          </select>
        </div>

        {/* CCNL */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
            <Building2 className="h-3.5 w-3.5" />
            CCNL di Riferimento
          </label>
          <select
            value={profile.ccnl}
            onChange={(e) => update({ ccnl: e.target.value as CCNLType })}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          >
            {CCNL_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label} ({c.mensilita} mensilità)
              </option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Regione di Residenza
          </label>
          <select
            value={profile.region}
            onChange={(e) => update({ region: e.target.value as Region })}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          >
            {regions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Comune di Residenza
          </label>
          <select
            value={profile.city}
            onChange={(e) => update({ city: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          >
            {cities.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
        <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-md">
          INPS: {(profile.contractType === "apprendistato" ? 5.84 : 9.19)}%
        </span>
        <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-md">
          {CCNL_OPTIONS.find((c) => c.value === profile.ccnl)?.mensilita} mensilità
        </span>
        <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-md">
          Add. Reg. {(REGIONAL_TAX_RATES[profile.region].rate * 100).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
