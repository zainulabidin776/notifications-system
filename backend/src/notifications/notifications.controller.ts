import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe.js';
import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { UpdateNotificationDto } from './dto/update-notification.dto.js';
import { NotificationsService } from './notifications.service.js';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    fullName: string;
    username: string;
  };
}

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.notificationsService.create(
      createNotificationDto,
      request.user.id,
    );
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.notificationsService.findAll(request.user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.notificationsService.findOne(
      id,
      request.user.id,
    );
  }

  @Put(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.notificationsService.update(
      id,
      updateNotificationDto,
      request.user.id,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.notificationsService.remove(
      id,
      request.user.id,
    );
  }
}