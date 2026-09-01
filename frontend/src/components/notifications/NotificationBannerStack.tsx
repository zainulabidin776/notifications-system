import {
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from 'lucide-react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import { useMemo } from 'react';

import { useNotifications } from '../../context/useNotifications';

import type {
  Notification,
  NotificationCategory,
} from '../../types/notification';

const INFO_LIFETIME_MS = 90_000;

interface BannerStyle {
  icon: typeof Info;
  containerClass: string;
  iconClass: string;
  progressClass: string;
}

const bannerConfig: Record<
  NotificationCategory,
  BannerStyle
> = {
  INFO: {
    icon: Info,

    containerClass:
      'border-blue-400/20 bg-blue-400/[0.08]',

    iconClass:
      'bg-blue-400/10 text-blue-400',

    progressClass:
      'bg-blue-400/60',
  },

  WARNING: {
    icon: TriangleAlert,

    containerClass:
      'border-amber-400/20 bg-amber-400/[0.08]',

    iconClass:
      'bg-amber-400/10 text-amber-400',

    progressClass:
      'bg-amber-400/60',
  },

  ERROR: {
    icon: CircleAlert,

    containerClass:
      'border-red-400/20 bg-red-400/[0.08]',

    iconClass:
      'bg-red-400/10 text-red-400',

    progressClass:
      'bg-red-400/60',
  },
};

function getInfoRemainingTime(
  notification: Notification,
) {
  const createdAt =
    new Date(
      notification.createdAt,
    ).getTime();

  if (
    Number.isNaN(createdAt)
  ) {
    return INFO_LIFETIME_MS;
  }

  const elapsed =
    Date.now() - createdAt;

  return Math.max(
    0,
    INFO_LIFETIME_MS - elapsed,
  );
}

export function NotificationBannerStack() {
  const {
    notifications,
    dismissNotification,
  } = useNotifications();

  const openNotifications =
    useMemo(
      () =>
        notifications.filter(
          (notification) =>
            !notification.isClosed,
        ),
      [notifications],
    );

  const visibleNotifications =
    openNotifications.slice(0, 5);

  const hiddenCount =
    Math.max(
      0,
      openNotifications.length - 5,
    );

  return (
    <div className="pointer-events-none fixed right-4 top-[88px] z-[80] w-[calc(100%-2rem)] max-w-[390px] space-y-2 sm:right-5 md:right-7">
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map(
          (notification) => {
            const config =
              bannerConfig[
                notification.category
              ];

            const Icon =
              config.icon;

            const remainingTime =
              notification.category ===
              'INFO'
                ? getInfoRemainingTime(
                    notification,
                  )
                : 0;

            const progress =
              notification.category ===
              'INFO'
                ? remainingTime /
                  INFO_LIFETIME_MS
                : 0;

            return (
              <motion.article
                key={notification._id}
                layout
                initial={{
                  opacity: 0,
                  x: 32,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: 24,
                  scale: 0.96,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 330,
                  damping: 28,
                }}
                className={[
                  'pointer-events-auto relative overflow-hidden rounded-2xl border shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-2xl',
                  config.containerClass,
                ].join(' ')}
              >
                <div className="flex items-start gap-3 p-4">
                  <div
                    className={[
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                      config.iconClass,
                    ].join(' ')}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--text-primary)]">
                        {notification.header}
                      </p>

                      <span
                        className={[
                          'shrink-0 text-[9px] font-bold tracking-[0.1em]',
                          notification.category ===
                          'INFO'
                            ? 'text-blue-400'
                            : notification.category ===
                                'WARNING'
                              ? 'text-amber-400'
                              : 'text-red-400',
                        ].join(' ')}
                      >
                        {
                          notification.category
                        }
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">
                      {notification.body}
                    </p>
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{
                      scale: 0.88,
                    }}
                    aria-label={`Dismiss ${notification.header}`}
                    onClick={() => {
                      void dismissNotification(
                        notification._id,
                      );
                    }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-all hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                </div>

                {/* INFO countdown */}
                {notification.category ===
                  'INFO' &&
                  remainingTime > 0 && (
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-400/10">
                      <motion.div
                        initial={{
                          scaleX:
                            progress,
                        }}
                        animate={{
                          scaleX: 0,
                        }}
                        transition={{
                          duration:
                            remainingTime /
                            1000,

                          ease: 'linear',
                        }}
                        className={[
                          'h-full w-full origin-left',
                          config.progressClass,
                        ].join(' ')}
                      />
                    </div>
                  )}
              </motion.article>
            );
          },
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hiddenCount > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -4,
            }}
            className="pointer-events-auto rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-center text-xs text-[var(--text-secondary)] shadow-xl backdrop-blur-2xl"
          >
            You have{' '}
            <span className="font-semibold text-[var(--text-primary)]">
              {hiddenCount}
            </span>{' '}
            more{' '}
            {hiddenCount === 1
              ? 'notification'
              : 'notifications'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}