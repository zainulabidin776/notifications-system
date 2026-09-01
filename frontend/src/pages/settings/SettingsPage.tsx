import {
  Bell,
  Check,
  Monitor,
  Moon,
  Palette,
  Settings2,
  Sparkles,
  Sun,
} from 'lucide-react';

import {
  motion,
} from 'framer-motion';

import { AppLayout } from '../../components/layout/AppLayout';
import { PremiumCard } from '../../components/ui/PremiumCard';

import { useTheme } from '../../context/useTheme';

export function SettingsPage() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const isDark =
    theme === 'dark';

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <motion.section
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.38,
          }}
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-violet-400 uppercase">
            <Settings2 className="h-3.5 w-3.5" />

            Preferences
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] md:text-[38px]">
            Settings
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
            Personalize how your notification
            workspace looks and behaves.
          </p>
        </motion.section>

        <div className="mt-8 space-y-5">
          {/* Appearance */}
          <PremiumCard accent>
            <section className="p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/[0.07] text-violet-400">
                  <Palette className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">
                    Appearance
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                    Choose the interface appearance
                    that feels most comfortable.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {/* Light */}
                <motion.button
                  type="button"
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  onClick={() => {
                    if (isDark) {
                      toggleTheme();
                    }
                  }}
                  className={[
                    'relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200',

                    !isDark
                      ? 'border-violet-400/35 bg-violet-400/[0.07]'
                      : 'border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-zinc-700 shadow-sm">
                      <Sun className="h-[18px] w-[18px]" />
                    </div>

                    {!isDark && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  <p className="mt-5 text-sm font-semibold text-[var(--text-primary)]">
                    Light
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    Clean, bright and focused.
                  </p>
                </motion.button>

                {/* Dark */}
                <motion.button
                  type="button"
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  onClick={() => {
                    if (!isDark) {
                      toggleTheme();
                    }
                  }}
                  className={[
                    'relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200',

                    isDark
                      ? 'border-violet-400/35 bg-violet-400/[0.07]'
                      : 'border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#16161a] text-zinc-100 shadow-sm">
                      <Moon className="h-[18px] w-[18px]" />
                    </div>

                    {isDark && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  <p className="mt-5 text-sm font-semibold text-[var(--text-primary)]">
                    Dark
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    Reduced glare with richer depth.
                  </p>
                </motion.button>
              </div>
            </section>
          </PremiumCard>

          {/* Workspace information */}
          <div className="grid gap-5 md:grid-cols-2">
            <PremiumCard>
              <section className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/[0.08] text-blue-400">
                  <Bell className="h-[18px] w-[18px]" />
                </div>

                <h2 className="mt-5 text-sm font-semibold text-[var(--text-primary)]">
                  Notification behavior
                </h2>

                <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
                  INFO notifications automatically
                  dismiss after 90 seconds. Warning and
                  critical notifications remain visible
                  until dismissed manually.
                </p>
              </section>
            </PremiumCard>

            <PremiumCard>
              <section className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-emerald-400">
                  <Sparkles className="h-[18px] w-[18px]" />
                </div>

                <h2 className="mt-5 text-sm font-semibold text-[var(--text-primary)]">
                  Motion & effects
                </h2>

                <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
                  Interactive surfaces use restrained
                  motion and cursor lighting. Your
                  operating system&apos;s reduced-motion
                  preference is respected automatically.
                </p>
              </section>
            </PremiumCard>
          </div>

          {/* System */}
          <PremiumCard>
            <section className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-hover)] text-[var(--text-secondary)]">
                  <Monitor className="h-[18px] w-[18px]" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    Accessibility
                  </h2>

                  <p className="mt-1.5 text-xs leading-6 text-[var(--text-muted)]">
                    Keyboard focus indicators,
                    reduced-motion preferences and
                    semantic interface states are
                    enabled throughout the application.
                  </p>
                </div>
              </div>
            </section>
          </PremiumCard>
        </div>
      </div>
    </AppLayout>
  );
}