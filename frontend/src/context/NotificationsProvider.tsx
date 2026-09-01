import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { notificationsApi } from '../api/notifications.api';

import type {
  CreateNotificationRequest,
  Notification,
  UpdateNotificationRequest,
} from '../types/notification';

import { NotificationsContext } from './notifications-context';
import { useAuth } from './useAuth';

export function NotificationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const infoTimers = useRef<
    Map<string, number>
  >(new Map());

  /*
   * Manual refresh.
   *
   * Pages can call this whenever they explicitly
   * want fresh notification data.
   */
  const refreshNotifications =
    useCallback(async () => {
      if (!user) {
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const data =
          await notificationsApi.getAll();

        setNotifications(data);
      } catch {
        setError(
          'Unable to load notifications.',
        );
      } finally {
        setIsLoading(false);
      }
    }, [user]);

  /*
   * Automatically fetch notifications when
   * authentication changes.
   *
   * State updates occur after asynchronous work,
   * rather than synchronously inside the effect.
   */
  useEffect(() => {
    let cancelled = false;

    if (!user) {
      queueMicrotask(() => {
        if (!cancelled) {
          setNotifications([]);
          setError('');
          setIsLoading(false);
        }
      });

      return () => {
        cancelled = true;
      };
    }

    const loadNotifications = async () => {
      try {
        const data =
          await notificationsApi.getAll();

        if (!cancelled) {
          setNotifications(data);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError(
            'Unable to load notifications.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const createNotification = async (
    payload: CreateNotificationRequest,
  ) => {
    const created =
      await notificationsApi.create(payload);

    setNotifications((current) => [
      created,
      ...current,
    ]);

    return created;
  };

  const updateNotification = async (
    id: string,
    payload: UpdateNotificationRequest,
  ) => {
    const updated =
      await notificationsApi.update(
        id,
        payload,
      );

    setNotifications((current) =>
      current.map((notification) =>
        notification._id === id
          ? updated
          : notification,
      ),
    );

    return updated;
  };

  const deleteNotification = async (
    id: string,
  ) => {
    await notificationsApi.remove(id);

    setNotifications((current) =>
      current.filter(
        (notification) =>
          notification._id !== id,
      ),
    );

    const timer =
      infoTimers.current.get(id);

    if (timer) {
      window.clearTimeout(timer);
      infoTimers.current.delete(id);
    }
  };

  const dismissNotification =
    useCallback(
      async (id: string) => {
        const updated =
          await notificationsApi.update(
            id,
            {
              isClosed: true,
            },
          );

        setNotifications((current) =>
          current.map((notification) =>
            notification._id === id
              ? updated
              : notification,
          ),
        );

        const timer =
          infoTimers.current.get(id);

        if (timer) {
          window.clearTimeout(timer);

          infoTimers.current.delete(id);
        }
      },
      [],
    );

  /*
   * INFO notifications automatically close
   * 90 seconds after creation.
   */
  useEffect(() => {
    notifications.forEach(
      (notification) => {
        if (
          notification.category !== 'INFO' ||
          notification.isClosed ||
          infoTimers.current.has(
            notification._id,
          )
        ) {
          return;
        }

        const createdAt =
          new Date(
            notification.createdAt,
          ).getTime();

        const elapsed =
          Date.now() - createdAt;

        const remaining =
          Math.max(
            0,
            90_000 - elapsed,
          );

        /*
         * Already expired.
         */
        if (remaining === 0) {
          queueMicrotask(() => {
            void dismissNotification(
              notification._id,
            );
          });

          return;
        }

        const timer =
          window.setTimeout(() => {
            void dismissNotification(
              notification._id,
            );
          }, remaining);

        infoTimers.current.set(
          notification._id,
          timer,
        );
      },
    );
  }, [
    notifications,
    dismissNotification,
  ]);

  /*
   * Clear timers when provider unmounts.
   */
  useEffect(() => {
    const timers = infoTimers.current;

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });

      timers.clear();
    };
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        isLoading,
        error,
        refreshNotifications,
        createNotification,
        updateNotification,
        deleteNotification,
        dismissNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}