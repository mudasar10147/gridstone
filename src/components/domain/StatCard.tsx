import { CountUp } from "@/components/ui/CountUp";

export interface StatCardProps {
  value: number;
  /** Shown after the number, e.g. "M+". */
  suffix: string;
  label: string;
}

/**
 * One headline studio figure ("10M+ Visits"), counting up on load. Renders a
 * dt/dd pair, so it must sit inside a <dl>. The value is shown above the
 * label but read after it.
 */
export function StatCard({ value, suffix, label }: StatCardProps) {
  return (
    <div className="flex flex-col-reverse items-center gap-1 px-5 sm:px-8">
      <dt className="font-heading text-xs font-semibold tracking-widest text-text-muted uppercase sm:text-sm">
        {label}
      </dt>
      <dd className="font-heading text-2xl leading-none font-bold text-text-primary sm:text-3xl">
        <CountUp value={value} suffix={suffix} />
      </dd>
    </div>
  );
}
