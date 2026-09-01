import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { NotificationCategory } from '../enums/notification-category.enum.js';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  header: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  body: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(NotificationCategory),
  })
  category: NotificationCategory;

  @Prop({
    type: Boolean,
    default: false,
  })
  isClosed: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;
}

export const NotificationSchema =
  SchemaFactory.createForClass(Notification);