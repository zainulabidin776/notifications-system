import { http } from './http';

import type {
  CreateNotificationRequest,
  Notification,
  UpdateNotificationRequest,
} from '../types/notification';

export const notificationsApi = {
  async getAll(): Promise<Notification[]> {
    const response =
      await http.get<Notification[]>('/notifications');

    return response.data;
  },

  async getById(id: string): Promise<Notification> {
    const response =
      await http.get<Notification>(
        `/notifications/${id}`,
      );

    return response.data;
  },

  async create(
    payload: CreateNotificationRequest,
  ): Promise<Notification> {
    const response =
      await http.post<Notification>(
        '/notifications',
        payload,
      );

    return response.data;
  },

  async update(
    id: string,
    payload: UpdateNotificationRequest,
  ): Promise<Notification> {
    const response =
      await http.put<Notification>(
        `/notifications/${id}`,
        payload,
      );

    return response.data;
  },

  async remove(id: string): Promise<Notification> {
    const response =
      await http.delete<Notification>(
        `/notifications/${id}`,
      );

    return response.data;
  },
};