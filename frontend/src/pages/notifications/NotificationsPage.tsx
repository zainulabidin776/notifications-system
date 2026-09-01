import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  BellRing,
  CircleAlert,
  Filter,
  Info,
  Plus,
  Search,
  TriangleAlert,
} from 'lucide-react';

import {
  Link,
  useLocation,
} from 'react-router-dom';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import { AppLayout } from '../../components/layout/AppLayout';
import { NotificationCard } from '../../components/notifications/NotificationCard';

import { useNotifications } from '../../context/useNotifications';

import type {
  Notification,
  NotificationCategory,
} from '../../types/notification';

type FilterValue =
  | 'ALL'
  | NotificationCategory;

interface FilterDefinition {
  label: string;
  value: FilterValue;
  icon?: typeof Info;
}

const filters: FilterDefinition[] = [
  {
    label: 'All',
    value: 'ALL',
  },

  {
    label: 'Info',
    value: 'INFO',
    icon: Info,
  },

  {
    label: 'Warnings',
    value: 'WARNING',
    icon: TriangleAlert,
  },

  {
    label: 'Errors',
    value: 'ERROR',
    icon: CircleAlert,
  },
];

export function NotificationsPage() {
  const location = useLocation();

  const {
    notifications,
    isLoading,
    error: providerError,
    dismissNotification,
    deleteNotification,
  } = useNotifications();

  const [filter, setFilter] =
    useState<FilterValue>('ALL');

  const [search, setSearch] =
    useState('');

  const [actionError, setActionError] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState(
      (
        location.state as
          | {
              success?: string;
            }
          | null
      )?.success ?? '',
    );

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        setSuccessMessage('');
      }, 3500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [successMessage]);

  const filteredNotifications =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      return notifications.filter(
        (notification) => {
          const matchesFilter =
            filter === 'ALL' ||
            notification.category ===
              filter;

          const matchesSearch =
            !normalizedSearch ||
            notification.header
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            notification.body
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          return (
            matchesFilter &&
            matchesSearch
          );
        },
      );
    }, [
      filter,
      search,
      notifications,
    ]);

  const counts = useMemo(() => {
    return {
      ALL: notifications.length,

      INFO: notifications.filter(
        (notification) =>
          notification.category ===
          'INFO',
      ).length,

      WARNING: notifications.filter(
        (notification) =>
          notification.category ===
          'WARNING',
      ).length,

      ERROR: notifications.filter(
        (notification) =>
          notification.category ===
          'ERROR',
      ).length,
    };
  }, [notifications]);

  const handleDismiss = async (
    notification: Notification,
  ) => {
    setActionError('');

    try {
      await dismissNotification(
        notification._id,
      );
    } catch {
      setActionError(
        'Unable to dismiss notification.',
      );
    }
  };

  const handleDelete = async (
    id: string,
  ) => {
    setActionError('');

    try {
      await deleteNotification(id);
    } catch {
      setActionError(
        'Unable to delete notification.',
      );
    }
  };

  const error =
    actionError || providerError;

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1500px]">
        {/* Heading */}
        <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.div
              initial={{
                opacity: 0,
                y: 5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-violet-400 uppercase"
            >
              <BellRing className="h-3.5 w-3.5" />

              Notification center
            </motion.div>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] md:text-[38px]">
              Notifications
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
              Review, organize and manage everything
              that needs your attention.
            </p>
          </div>

          <motion.div
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
          >
            <Link
              to="/notifications/new"
              className="group flex h-11 items-center justify-center gap-2 rounded-xl border border-violet-400/25 bg-violet-400/[0.1] px-4 text-sm font-medium text-violet-400 transition-all duration-200 hover:border-violet-400/40 hover:bg-violet-400/[0.15]"
            >
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />

              New notification
            </Link>
          </motion.div>
        </section>

        {/* Feedback */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{
                opacity: 0,
                y: -6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -6,
              }}
              className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-500"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Controls */}
        <section className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Filter className="h-4 w-4" />
              Filter
            </div>

            {filters.map((item) => {
              const Icon = item.icon;

              const selected =
                filter === item.value;

              return (
                <motion.button
                  key={item.value}
                  type="button"
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={() =>
                    setFilter(item.value)
                  }
                  className={[
                    'flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition-all duration-200',
                    selected
                      ? 'border-violet-400/30 bg-violet-400/[0.1] text-violet-400'
                      : 'border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  {Icon && (
                    <Icon className="h-3.5 w-3.5" />
                  )}

                  {item.label}

                  <span
                    className={[
                      'rounded-md px-1.5 py-0.5 text-[9px]',
                      selected
                        ? 'bg-violet-400/[0.12]'
                        : 'bg-[var(--surface-hover)]',
                    ].join(' ')}
                  >
                    {counts[item.value]}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Search */}
          <div className="premium-input flex h-11 w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3.5 xl:w-[310px]">
            <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search notifications..."
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
            />
          </div>
        </section>

        {/* Notification grid */}
        <section className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-56 animate-pulse rounded-[22px] border border-[var(--border)] bg-[var(--surface-soft)]"
                  />
                ),
              )}
            </div>
          ) : filteredNotifications.length >
            0 ? (
            <motion.div
              layout
              className="grid gap-4 lg:grid-cols-2"
            >
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map(
                  (notification) => (
                    <NotificationCard
                      key={
                        notification._id
                      }
                      notification={
                        notification
                      }
                      onDismiss={
                        handleDismiss
                      }
                      onDelete={
                        handleDelete
                      }
                    />
                  ),
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="flex min-h-[420px] flex-col items-center justify-center rounded-[24px] border border-[var(--border)] bg-[var(--surface-soft)] px-6 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/[0.08] text-violet-400">
                <BellRing className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-medium text-[var(--text-primary)]">
                No notifications found
              </h3>

              <p className="mt-2 max-w-xs text-xs leading-5 text-[var(--text-muted)]">
                {search
                  ? 'No notifications match your search.'
                  : filter !== 'ALL'
                    ? 'There are no notifications in this category.'
                    : 'Create your first notification to get started.'}
              </p>

              {!search &&
                filter === 'ALL' && (
                  <Link
                    to="/notifications/new"
                    className="mt-5 text-xs font-medium text-violet-400 transition hover:text-violet-300"
                  >
                    Create notification
                  </Link>
                )}
            </motion.div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}