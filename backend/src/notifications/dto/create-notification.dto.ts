import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { NotificationCategory } from '../enums/notification-category.enum.js';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  header: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  body: string;

  @IsEnum(NotificationCategory)
  category: NotificationCategory;
}