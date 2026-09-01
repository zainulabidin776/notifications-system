import { useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  CircleAlert,
  Plus,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { notificationsApi } from '../../api/notifications.api';
import { AppLayout } from '../../components/layout/AppLayout';
import { NotificationPreview } from '../../components/notifications/NotificationPreview';
import { PremiumCard } from '../../components/ui/PremiumCard';
import { StatCard } from '../../components/ui/StatCard';
import { useAuth } from '../../context/useAuth';
import type { Notification } from '../../types/notification';

export function DashboardPage() {
  const { user } = useAuth();

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await notificationsApi.getAll();
        setNotifications(data);
      } finally {
        setIsLoading(false);
      }
    };

    void loadNotifications();
  }, []);

  const stats = useMemo(() => {
    return {
      total: notifications.length,

      open: notifications.filter(
        (notification) => !notification.isClosed,
      ).length,

      warnings: notifications.filter(
        (notification) =>
          notification.category === 'WARNING',
      ).length,

      errors: notifications.filter(
        (notification) =>
          notification.category === 'ERROR',
      ).length,
    };
  }, [notifications]);

  const warningPercentage =
    stats.total > 0
      ? (stats.warnings / stats.total) * 100
      : 0;

  const errorPercentage =
    stats.total > 0
      ? (stats.errors / stats.total) * 100
      : 0;

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-violet-300 uppercase"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Your workspace
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.05,
              }}
              className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] md:text-[38px]"
            >
              Good to see you,
              <span className="text-[var(--text-secondary)]">
                {' '}
                {user?.fullName?.split(' ')[0]}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.12,
              }}
              className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-muted)]"
            >
              Here&apos;s a focused view of everything
              that needs your attention.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              duration: 0.3,
              delay: 0.1,
            }}
          >
            <Link
              to="/notifications/new"
              className="group flex h-11 items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/[0.09] px-4 text-sm font-medium text-violet-100 shadow-[0_10px_35px_rgba(124,92,246,0.08)] transition-all duration-200 hover:border-violet-400/35 hover:bg-violet-400/[0.14]"
            >
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />

              New notification
            </Link>
          </motion.div>
        </section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.12,
          }}
          className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            label="Total notifications"
            value={stats.total}
            helper="All activity in your workspace"
            icon={BellRing}
          />

          <StatCard
            label="Needs attention"
            value={stats.open}
            helper="Currently undismissed"
            icon={Sparkles}
            tone="info"
          />

          <StatCard
            label="Warnings"
            value={stats.warnings}
            helper="Items worth reviewing"
            icon={TriangleAlert}
            tone="warning"
          />

          <StatCard
            label="Critical"
            value={stats.errors}
            helper="Errors requiring attention"
            icon={CircleAlert}
            tone="error"
          />
        </motion.section>

        {/* Main content */}
        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Recent notifications */}
          <PremiumCard className="min-h-[420px]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
              <div>
                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  Recent notifications
                </h2>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Latest activity across your workspace
                </p>
              </div>

              <Link
                to="/notifications"
                className="text-xs font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                View all
              </Link>
            </div>

            <div className="px-3">
              {isLoading ? (
                <div className="space-y-3 px-3 py-6">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-20 animate-pulse rounded-xl bg-[var(--surface-soft)]"
                    />
                  ))}
                </div>
              ) : notifications.length > 0 ? (
                notifications
                  .slice(0, 5)
                  .map((notification) => (
                    <NotificationPreview
                      key={notification._id}
                      notification={notification}
                    />
                  ))
              ) : (
                <div className="flex min-h-[330px] flex-col items-center justify-center px-6 text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 250,
                      damping: 20,
                    }}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-400/[0.08] text-violet-300"
                  >
                    <BellRing className="h-5 w-5" />
                  </motion.div>

                  <h3 className="mt-4 text-sm font-medium text-[var(--text-primary)]">
                    No notifications yet
                  </h3>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-[var(--text-muted)]">
                    Create your first notification to
                    start building your workspace.
                  </p>
                </div>
              )}
            </div>
          </PremiumCard>

          {/* Attention Overview */}
          <PremiumCard
            accent
            className="min-h-[420px]"
          >
            <aside className="relative h-full overflow-hidden p-6">
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative">
                <p className="text-xs font-semibold tracking-[0.14em] text-[var(--text-muted)] uppercase">
                  Attention overview
                </p>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2,
                  }}
                  className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]"
                >
                  {stats.open}
                </motion.p>

                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  undismissed notifications
                </p>

                <div className="mt-9 space-y-6">
                  {/* Warnings */}
                  <div>
                    <div className="mb-2.5 flex justify-between text-xs">
                      <span className="text-[var(--text-secondary)]">
                        Warnings
                      </span>

                      <span className="font-medium text-amber-300">
                        {stats.warnings}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${warningPercentage}%`,
                        }}
                        transition={{
                          duration: 0.7,
                          ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                          ],
                        }}
                        className="h-full rounded-full bg-amber-300/75"
                      />
                    </div>
                  </div>

                  {/* Errors */}
                  <div>
                    <div className="mb-2.5 flex justify-between text-xs">
                      <span className="text-[var(--text-secondary)]">
                        Errors
                      </span>

                      <span className="font-medium text-red-300">
                        {stats.errors}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${errorPercentage}%`,
                        }}
                        transition={{
                          duration: 0.7,
                          delay: 0.08,
                          ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                          ],
                        }}
                        className="h-full rounded-full bg-red-300/75"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 border-t border-[var(--border)] pt-5">
                  <p className="text-xs leading-5 text-[var(--text-muted)]">
                    Your overview updates automatically
                    as notifications are created,
                    dismissed or removed.
                  </p>
                </div>
              </div>
            </aside>
          </PremiumCard>
        </section>
      </div>
    </AppLayout>
  );
}