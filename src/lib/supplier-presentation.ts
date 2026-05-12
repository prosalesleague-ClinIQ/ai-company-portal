/** Presentation helpers shared between server + client components for suppliers. */

export const CATEGORY_LABEL: Record<string, string> = {
  compounding_pharmacy_503a: "503-A Pharmacy",
  compounding_pharmacy_503b: "503-B Pharmacy",
  cgmp_peptide_lab_us: "cGMP Peptide Lab (US)",
  cgmp_peptide_lab_intl: "cGMP Peptide Lab (Intl)",
  iv_therapy_supplier: "IV Therapy",
  exosomes_manufacturer: "Exosomes",
  sarms_supplier: "SARMS (Research)",
  auxiliary: "Auxiliary",
};

export const CATEGORY_TONE: Record<string, string> = {
  compounding_pharmacy_503a: "bg-violet-50 border-violet-200 text-violet-800",
  compounding_pharmacy_503b: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800",
  cgmp_peptide_lab_us: "bg-cyan-50 border-cyan-200 text-cyan-800",
  cgmp_peptide_lab_intl: "bg-sky-50 border-sky-200 text-sky-800",
  iv_therapy_supplier: "bg-emerald-50 border-emerald-200 text-emerald-800",
  exosomes_manufacturer: "bg-amber-50 border-amber-200 text-amber-800",
  sarms_supplier: "bg-rose-50 border-rose-200 text-rose-800",
  auxiliary: "bg-slate-50 border-slate-200 text-slate-700",
};

export function tierTone(tier: string): string {
  if (tier.startsWith("P0")) return "bg-rose-50 border-rose-200 text-rose-800";
  if (tier.startsWith("P1")) return "bg-amber-50 border-amber-200 text-amber-800";
  if (tier.startsWith("P2")) return "bg-cyan-50 border-cyan-200 text-cyan-800";
  if (tier.startsWith("P3")) return "bg-slate-50 border-slate-200 text-slate-600";
  return "bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-muted)]";
}
