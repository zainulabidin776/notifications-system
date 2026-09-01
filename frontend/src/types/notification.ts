export type NotificationCategory =
  | 'INFO'
  | 'WARNING'
  | 'ERROR';

export interface Notification {
  _id: string;
  header: string;
  body: string;
  category: NotificationCategory;
  isClosed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  header: string;
  body: string;
  category: NotificationCategory;
}

export interface UpdateNotificationRequest {
  header?: string;
  body?: string;
  category?: NotificationCategory;
  isClosed?: boolean;
}