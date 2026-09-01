import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { vi } from 'vitest';

import { NotificationsService } from './notifications.service.js';
import { Notification } from './schemas/notification.schema.js';
import { NotificationCategory } from './enums/notification-category.enum.js';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const saveMock = vi.fn();

  class NotificationModelMock {
    header: string;
    body: string;
    category: NotificationCategory;
    userId: unknown;

    constructor(data: {
      header: string;
      body: string;
      category: NotificationCategory;
      userId: unknown;
    }) {
      this.header = data.header;
      this.body = data.body;
      this.category = data.category;
      this.userId = data.userId;
    }

    save = saveMock;
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          NotificationsService,
          {
            provide: getModelToken(Notification.name),
            useValue: NotificationModelMock,
          },
        ],
      }).compile();

    service = module.get<NotificationsService>(
      NotificationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a notification for the authenticated user', async () => {
    const userId = '6a9672cb0bddfb2dfb90d9c9';

    const createNotificationDto = {
      header: 'Test Notification',
      body: 'Testing notification creation',
      category: NotificationCategory.INFO,
    };

    const savedNotification = {
      _id: '6a9676670f7986d4a94b9bf0',
      ...createNotificationDto,
      userId,
      isClosed: false,
    };

    saveMock.mockResolvedValue(savedNotification);

    const result = await service.create(
      createNotificationDto,
      userId,
    );

    expect(saveMock).toHaveBeenCalledOnce();

    expect(result).toEqual(savedNotification);
  });
});