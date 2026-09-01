import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service.js';

import { UpdatePasswordDto } from './dto/update-password.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    fullName: string,
    username: string,
    password: string,
  ) {
    const normalizedUsername =
      username.trim().toLowerCase();

    const existingUser =
      await this.usersService.findByUsername(
        normalizedUsername,
      );

    if (existingUser) {
      throw new ConflictException(
        'Username already exists',
      );
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12,
      );

    const user =
      await this.usersService.create(
        fullName.trim(),
        normalizedUsername,
        passwordHash,
      );

    return {
      id: user._id.toString(),
      fullName: user.fullName,
      username: user.username,
    };
  }

  async login(
    username: string,
    password: string,
  ) {
    const normalizedUsername =
      username.trim().toLowerCase();

    const user =
      await this.usersService
        .findByUsernameWithPassword(
          normalizedUsername,
        );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid username or password',
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash,
      );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid username or password',
      );
    }

    const payload = {
      sub: user._id.toString(),
      username: user.username,
    };

    const accessToken =
      await this.jwtService.signAsync(
        payload,
      );

    return {
      message: 'Login successful',

      accessToken,

      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        username: user.username,
      },
    };
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ) {
    const fullName =
      dto.fullName.trim();

    const username =
      dto.username
        .trim()
        .toLowerCase();

    const updatedUser =
      await this.usersService
        .updateProfile(
          userId,
          fullName,
          username,
        );

    return {
      id: updatedUser._id.toString(),
      fullName:
        updatedUser.fullName,
      username:
        updatedUser.username,
    };
  }

  async changePassword(
    userId: string,
    dto: UpdatePasswordDto,
  ) {
    const user =
      await this.usersService
        .findByIdWithPassword(
          userId,
        );

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    const currentPasswordMatches =
      await bcrypt.compare(
        dto.currentPassword,
        user.passwordHash,
      );

    if (!currentPasswordMatches) {
      throw new BadRequestException(
        'Current password is incorrect',
      );
    }

    const sameAsCurrentPassword =
      await bcrypt.compare(
        dto.newPassword,
        user.passwordHash,
      );

    if (sameAsCurrentPassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    const newPasswordHash =
      await bcrypt.hash(
        dto.newPassword,
        12,
      );

    await this.usersService.updatePassword(
      userId,
      newPasswordHash,
    );

    return {
      message:
        'Password updated successfully',
    };
  }
}