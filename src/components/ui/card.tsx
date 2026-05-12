import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-start justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {subtitle && (
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <Card>
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)] font-medium">
          {label}
        </div>
        <div className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight">
          {value}
        </div>
        {hint && (
          <div className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</div>
        )}
      </div>
    </Card>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "warning" | "success" | "danger";
}) {
  const tones = {
    neutral: "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)]",
    accent: "bg-cyan-50 text-cyan-800 border-cyan-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border tabular-nums",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
