import {
  useMemo,
  useState,
} from 'react';

import {
  ArrowLeft,
  Edit3,
  LoaderCircle,
} from 'lucide-react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import axios from 'axios';
import { motion } from 'framer-motion';

import { AppLayout } from '../../components/layout/AppLayout';
import { NotificationForm } from '../../components/notifications/NotificationForm';
import { PremiumCard } from '../../components/ui/PremiumCard';

import { useNotifications } from '../../context/useNotifications';

import type {
  CreateNotificationRequest,
} from '../../types/notification';

export function EditNotificationPage() {
  const { id } =
    useParams<{
      id: string;
    }>();

  const navigate =
    useNavigate();

  const {
    notifications,
    isLoading: notificationsLoading,
    updateNotification,
  } = useNotifications();

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState(
      id
        ? ''
        : 'Notification ID is missing.',
    );

  const notification =
    useMemo(() => {
      if (!id) {
        return null;
      }

      return (
        notifications.find(
          (item) =>
            item._id === id,
        ) ?? null
      );
    }, [
      id,
      notifications,
    ]);

  const isLoading =
    Boolean(id) &&
    notificationsLoading;

  const handleSubmit = async (
    values: CreateNotificationRequest,
  ) => {
    if (!id) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await updateNotification(
        id,
        values,
      );

      navigate('/notifications', {
        state: {
          success:
            'Notification updated successfully.',
        },
      });
    } catch (requestError) {
      if (
        axios.isAxiosError(
          requestError,
        )
      ) {
        const message =
          requestError.response
            ?.data?.message;

        if (Array.isArray(message)) {
          setError(message[0]);
        } else if (
          typeof message === 'string'
        ) {
          setError(message);
        } else {
          setError(
            'Unable to update notification.',
          );
        }
      } else {
        setError(
          'Something went wrong. Please try again.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <Link
          to="/notifications"
          className="group inline-flex items-center gap-2 py-1 text-sm text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />

          Back to notifications
        </Link>

        {isLoading ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <LoaderCircle className="h-6 w-6 animate-spin text-violet-400" />

              <span className="text-xs text-[var(--text-muted)]">
                Loading notification...
              </span>
            </div>
          </div>
        ) : notification ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className="mt-6"
          >
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{
                  y: -2,
                  rotate: -2,
                }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.08] text-violet-400"
              >
                <Edit3 className="h-5 w-5" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                  Edit notification
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
                  Refine the message or update its
                  category. Changes are reflected
                  throughout the workspace immediately.
                </p>
              </div>
            </div>

            <PremiumCard
              accent
              className="mt-8"
            >
              <div className="p-6 md:p-8">
                <NotificationForm
                  initialValues={{
                    header:
                      notification.header,

                    body:
                      notification.body,

                    category:
                      notification.category,
                  }}
                  submitLabel="Save changes"
                  isSubmitting={
                    isSubmitting
                  }
                  error={error}
                  onSubmit={
                    handleSubmit
                  }
                />
              </div>
            </PremiumCard>
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
            className="mt-8 flex min-h-[380px] flex-col items-center justify-center rounded-[24px] border border-[var(--border)] bg-[var(--surface-soft)] px-6 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/[0.08] text-red-400">
              <Edit3 className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-base font-semibold text-[var(--text-primary)]">
              Notification not found
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
              {error ||
                'This notification may have been deleted or you may not have access to it.'}
            </p>

            <Link
              to="/notifications"
              className="mt-5 text-sm font-medium text-violet-400 transition hover:text-violet-300"
            >
              Return to notifications
            </Link>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}