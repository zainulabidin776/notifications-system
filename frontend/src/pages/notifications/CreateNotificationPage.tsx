import { useState } from 'react';
import {
  ArrowLeft,
  BellPlus,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

import { notificationsApi } from '../../api/notifications.api';
import { AppLayout } from '../../components/layout/AppLayout';
import { NotificationForm } from '../../components/notifications/NotificationForm';
import { PremiumCard } from '../../components/ui/PremiumCard';
import type { CreateNotificationRequest } from '../../types/notification';

export function CreateNotificationPage() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (
    values: CreateNotificationRequest,
  ) => {
    setError('');
    setIsSubmitting(true);

    try {
      await notificationsApi.create(values);

      navigate('/notifications', {
        state: {
          success:
            'Notification created successfully.',
        },
      });
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const message =
          requestError.response?.data?.message;

        setError(
          Array.isArray(message)
            ? message[0]
            : typeof message === 'string'
              ? message
              : 'Unable to create notification.',
        );
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
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to notifications
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/[0.08] text-violet-300">
              <BellPlus className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                Create notification
              </h1>

              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Add an update to your personal notification workspace.
              </p>
            </div>
          </div>

          <PremiumCard className="mt-8">
            <div className="p-6 md:p-8">
              <NotificationForm
                submitLabel="Create notification"
                isSubmitting={isSubmitting}
                error={error}
                onSubmit={handleSubmit}
              />
            </div>
          </PremiumCard>
        </motion.div>
      </div>
    </AppLayout>
  );
}