import type { ReactNode } from 'react';
import { BellRing, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}

export function AuthLayout({
  children,
  eyebrow,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-[8%] right-[10%] h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden border-r border-white/8 px-12 py-14 lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <BellRing className="h-5 w-5 text-violet-300" />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-white/90 uppercase">
                Notify
              </p>
              <p className="text-xs text-zinc-500">
                Personal notification workspace
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/8 px-3 py-1.5 text-xs font-medium text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              Built for focused teams
            </div>

            <h1 className="max-w-lg text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-white">
              Stay ahead of what
              <span className="block bg-gradient-to-r from-violet-300 via-white to-orange-200 bg-clip-text text-transparent">
                needs your attention.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">
              A refined notification dashboard for tracking important updates,
              warnings and critical events without the noise.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-4">
            {[
              ['INFO', 'Stay informed'],
              ['WARNING', 'Act early'],
              ['ERROR', 'Respond fast'],
            ].map(([label, text]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/8 bg-white/[0.035] p-4"
              >
                <p className="text-xs font-semibold tracking-wider text-zinc-300">
                  {label}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md"
          >
            <div className="mb-8 lg:hidden">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <BellRing className="h-5 w-5 text-violet-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-[0.16em] uppercase">
                    Notify
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-violet-300 uppercase">
                {eyebrow}
              </p>

              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
                {title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {description}
              </p>
            </div>

            {children}
          </motion.div>
        </section>
      </div>
    </main>
  );
}