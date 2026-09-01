import {
  CircleAlert,
  Info,
  TriangleAlert,
} from 'lucide-react';
import { motion } from 'framer-motion';

import type {
  Notification,
  NotificationCategory,
} from '../../types/notification';

interface NotificationPreviewProps {
  notification: Notification;
}

const categoryConfig: Record<
  NotificationCategory,
  {
    icon: typeof Info;
    iconClass: string;
    badgeClass: string;
    railClass: string;
  }
> = {
  INFO: {
    icon: Info,

    iconClass:
      'bg-blue-400/10 text-blue-300',

    badgeClass:
      'border-blue-400/15 bg-blue-400/[0.06] text-blue-300',

    railClass:
      'bg-blue-400',
  },

  WARNING: {
    icon: TriangleAlert,

    iconClass:
      'bg-amber-400/10 text-amber-300',

    badgeClass:
      'border-amber-400/15 bg-amber-400/[0.06] text-amber-300',

    railClass:
      'bg-amber-400',
  },

  ERROR: {
    icon: CircleAlert,

    iconClass:
      'bg-red-400/10 text-red-300',

    badgeClass:
      'border-red-400/15 bg-red-400/[0.06] text-red-300',

    railClass:
      'bg-red-400',
  },
};

export function NotificationPreview({
  notification,
}: NotificationPreviewProps) {
  const config =
    categoryConfig[notification.category];

  const Icon = config.icon;

  const date = new Date(notification.createdAt);

  const formattedDate =
    date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 6,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        x: 2,
      }}
      transition={{
        duration: 0.2,
      }}
      className="group relative flex min-w-0 gap-4 border-b border-[var(--border)] px-3 py-5 transition-colors duration-200 last:border-none hover:bg-[var(--surface-soft)]"
    >
      {/* Status rail */}
      <div
        className={[
          'absolute inset-y-3 left-0 w-[2px] rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100',
          config.railClass,
        ].join(' ')}
      />

      {/* Category Icon */}
      <div
        className={[
          'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-250 group-hover:scale-[1.04]',
          config.iconClass,
        ].join(' ')}
      >
        <Icon className="h-[18px] w-[18px]" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="min-w-0 truncate text-sm font-medium text-[var(--text-primary)]">
            {notification.header}
          </h3>

          <span
            className={[
              'shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-[0.08em]',
              config.badgeClass,
            ].join(' ')}
          >
            {notification.category}
          </span>

          {notification.isClosed && (
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-0.5 text-[9px] font-medium tracking-[0.06em] text-[var(--text-muted)]">
              CLOSED
            </span>
          )}
        </div>

        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
          {notification.body}
        </p>
      </div>

      {/* Date */}
      <time className="hidden shrink-0 pt-0.5 text-xs text-[var(--text-muted)] sm:block">
        {formattedDate}
      </time>
    </motion.article>
  );
}