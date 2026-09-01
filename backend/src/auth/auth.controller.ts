import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import type {
  Request,
} from 'express';

import {
  AuthGuard,
} from '@nestjs/passport';

import {
  AuthService,
} from './auth.service.js';

import {
  RegisterDto,
} from './dto/register.dto.js';

import {
  LoginDto,
} from './dto/login.dto.js';

import {
  UpdateProfileDto,
} from './dto/update-profile.dto.js';

import {
  UpdatePasswordDto,
} from './dto/update-password.dto.js';

interface AuthenticatedRequest
  extends Request {
  user: {
    id: string;
    fullName: string;
    username: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService:
      AuthService,
  ) {}

  @Post('register')
  async register(
    @Body()
    registerDto: RegisterDto,
  ) {
    return this.authService.register(
      registerDto.fullName,
      registerDto.username,
      registerDto.password,
    );
  }

  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.login(
      loginDto.username,
      loginDto.password,
    );
  }

  @Get('me')
  @UseGuards(
    AuthGuard('jwt'),
  )
  getMe(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return request.user;
  }

  @Put('me')
  @UseGuards(
    AuthGuard('jwt'),
  )
  updateProfile(
    @Req()
    request: AuthenticatedRequest,

    @Body()
    updateProfileDto:
      UpdateProfileDto,
  ) {
    return this.authService
      .updateProfile(
        request.user.id,
        updateProfileDto,
      );
  }

  @Put('me/password')
  @UseGuards(
    AuthGuard('jwt'),
  )
  changePassword(
    @Req()
    request: AuthenticatedRequest,

    @Body()
    updatePasswordDto:
      UpdatePasswordDto,
  ) {
    return this.authService
      .changePassword(
        request.user.id,
        updatePasswordDto,
      );
  }
}