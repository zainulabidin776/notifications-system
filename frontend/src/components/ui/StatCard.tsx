import type { LucideIcon } from 'lucide-react';

import { PremiumCard } from './PremiumCard';

interface StatCardProps {
  label: string;
  value: number;
  helper: string;
  icon: LucideIcon;
  tone?: 'default' | 'info' | 'warning' | 'error';
}

const toneClasses = {
  default:
    'bg-violet-400/10 text-violet-300',

  info:
    'bg-blue-400/10 text-blue-300',

  warning:
    'bg-amber-400/10 text-amber-300',

  error:
    'bg-red-400/10 text-red-300',
};

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = 'default',
}: StatCardProps) {
  return (
    <PremiumCard>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">
              {label}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
              {value}
            </p>
          </div>

          <div
            className={[
              'flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
              toneClasses[tone],
            ].join(' ')}
          >
            <Icon className="h-[18px] w-[18px]" />
          </div>
        </div>

        <p className="mt-5 text-xs text-[var(--text-muted)]">
          {helper}
        </p>
      </div>
    </PremiumCard>
  );
}