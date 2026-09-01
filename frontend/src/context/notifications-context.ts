import { createContext } from 'react';

import type {
  CreateNotificationRequest,
  Notification,
  UpdateNotificationRequest,
} from '../types/notification';

export interface NotificationsContextValue {
  notifications: Notification[];
  isLoading: boolean;
  error: string;

  refreshNotifications: () => Promise<void>;

  createNotification: (
    payload: CreateNotificationRequest,
  ) => Promise<Notification>;

  updateNotification: (
    id: string,
    payload: UpdateNotificationRequest,
  ) => Promise<Notification>;

  deleteNotification: (
    id: string,
  ) => Promise<void>;

  dismissNotification: (
    id: string,
  ) => Promise<void>;
}

export const NotificationsContext =
  createContext<NotificationsContextValue | undefined>(
    undefined,
  );