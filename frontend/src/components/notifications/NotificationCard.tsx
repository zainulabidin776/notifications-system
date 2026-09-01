import {
  Check,
  CircleAlert,
  Edit3,
  Info,
  MoreHorizontal,
  Trash2,
  TriangleAlert,
} from 'lucide-react';

import {
  Link,
} from 'react-router-dom';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  Notification,
  NotificationCategory,
} from '../../types/notification';

import { PremiumCard } from '../ui/PremiumCard';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface NotificationCardProps {
  notification: Notification;

  onDismiss: (
    notification: Notification,
  ) => Promise<void>;

  onDelete: (
    id: string,
  ) => Promise<void>;
}

interface CategoryStyle {
  label: string;
  icon: typeof Info;
  iconClass: string;
  badgeClass: string;
  accentClass: string;
}

const categoryConfig: Record<
  NotificationCategory,
  CategoryStyle
> = {
  INFO: {
    label: 'Information',

    icon: Info,

    iconClass:
      'bg-blue-400/10 text-blue-400',

    badgeClass:
      'border-blue-400/20 bg-blue-400/[0.06] text-blue-400',

    accentClass:
      'bg-blue-400',
  },

  WARNING: {
    label: 'Warning',

    icon: TriangleAlert,

    iconClass:
      'bg-amber-400/10 text-amber-400',

    badgeClass:
      'border-amber-400/20 bg-amber-400/[0.06] text-amber-400',

    accentClass:
      'bg-amber-400',
  },

  ERROR: {
    label: 'Critical',

    icon: CircleAlert,

    iconClass:
      'bg-red-400/10 text-red-400',

    badgeClass:
      'border-red-400/20 bg-red-400/[0.06] text-red-400',

    accentClass:
      'bg-red-400',
  },
};

export function NotificationCard({
  notification,
  onDismiss,
  onDelete,
}: NotificationCardProps) {
  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    confirmDelete,
    setConfirmDelete,
  ] = useState(false);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const [
    isDismissing,
    setIsDismissing,
  ] = useState(false);

  const menuRef =
    useRef<HTMLDivElement>(
      null,
    );

  const config =
    categoryConfig[
      notification.category
    ];

  const Icon =
    config.icon;

  const createdAt =
    new Date(
      notification.createdAt,
    );

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      const target =
        event.target;

      if (
        !(target instanceof Node)
      ) {
        return;
      }

      if (
        !menuRef.current?.contains(
          target,
        )
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === 'Escape'
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    );

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      );

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [menuOpen]);

  const handleDismiss =
    async () => {
      setIsDismissing(true);

      try {
        await onDismiss(
          notification,
        );

        setMenuOpen(false);
      } finally {
        setIsDismissing(false);
      }
    };

  const handleDelete =
    async () => {
      setIsDeleting(true);

      try {
        await onDelete(
          notification._id,
        );

        setConfirmDelete(
          false,
        );
      } finally {
        setIsDeleting(
          false,
        );
      }
    };

  return (
    <>
      <motion.div
        layout
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.97,
          y: -4,
        }}
        transition={{
          layout: {
            type: 'spring',
            stiffness: 320,
            damping: 30,
          },
        }}
      >
        <PremiumCard className="h-full">
          <article className="relative flex min-h-[225px] flex-col p-5">
            {/* Semantic accent */}
            <div
              className={[
                'absolute inset-x-5 top-0 h-[2px] rounded-full opacity-65',
                config.accentClass,
              ].join(' ')}
            />

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div
                className={[
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-250 group-hover:scale-[1.05]',
                  config.iconClass,
                ].join(' ')}
              >
                <Icon className="h-[18px] w-[18px]" />
              </div>

              <div
                ref={menuRef}
                className="relative"
              >
                <motion.button
                  type="button"
                  whileTap={{
                    scale: 0.9,
                  }}
                  aria-haspopup="menu"
                  aria-expanded={
                    menuOpen
                  }
                  aria-label="Notification actions"
                  onClick={() =>
                    setMenuOpen(
                      (current) =>
                        !current,
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-muted)] transition-all hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </motion.button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      role="menu"
                      initial={{
                        opacity: 0,
                        scale: 0.96,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.96,
                        y: -3,
                      }}
                      transition={{
                        duration: 0.15,
                      }}
                      className="absolute right-0 top-11 z-30 w-44 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-xl"
                    >
                      <Link
                        role="menuitem"
                        to={`/notifications/${notification._id}/edit`}
                        onClick={() =>
                          setMenuOpen(
                            false,
                          )
                        }
                        className="flex h-10 items-center gap-3 rounded-lg px-3 text-xs text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                      >
                        <Edit3 className="h-4 w-4" />

                        Edit
                      </Link>

                      {!notification.isClosed && (
                        <button
                          role="menuitem"
                          type="button"
                          disabled={
                            isDismissing
                          }
                          onClick={() => {
                            void handleDismiss();
                          }}
                          className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-xs text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Check className="h-4 w-4" />

                          {isDismissing
                            ? 'Dismissing...'
                            : 'Dismiss'}
                        </button>
                      )}

                      <div className="my-1 h-px bg-[var(--border)]" />

                      <button
                        role="menuitem"
                        type="button"
                        onClick={() => {
                          setMenuOpen(
                            false,
                          );

                          setConfirmDelete(
                            true,
                          );
                        }}
                        className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-xs text-red-400 transition hover:bg-red-400/[0.07]"
                      >
                        <Trash2 className="h-4 w-4" />

                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Content */}
            <div className="mt-5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={[
                    'rounded-full border px-2 py-1 text-[9px] font-bold tracking-[0.08em]',
                    config.badgeClass,
                  ].join(' ')}
                >
                  {config.label.toUpperCase()}
                </span>

                {notification.isClosed && (
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-1 text-[9px] font-bold tracking-[0.08em] text-[var(--text-muted)]">
                    DISMISSED
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-base font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                {notification.header}
              </h2>

              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-secondary)]">
                {notification.body}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-4 text-xs text-[var(--text-muted)]">
              <time
                dateTime={
                  notification.createdAt
                }
              >
                {createdAt.toLocaleDateString(
                  undefined,
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  },
                )}
              </time>

              <span>
                {createdAt.toLocaleTimeString(
                  undefined,
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  },
                )}
              </span>
            </div>
          </article>
        </PremiumCard>
      </motion.div>

      <ConfirmDialog
        open={
          confirmDelete
        }
        title="Delete notification?"
        description="This notification will be permanently removed from your workspace. This action cannot be undone."
        confirmLabel="Delete notification"
        isLoading={
          isDeleting
        }
        onCancel={() =>
          setConfirmDelete(
            false,
          )
        }
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </>
  );
}