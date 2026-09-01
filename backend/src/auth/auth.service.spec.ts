import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  JwtService,
} from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import {
  AuthService,
} from './auth.service.js';

import {
  UsersService,
} from '../users/users.service.js';

vi.mock('bcrypt', () => ({
  compare: vi.fn(),
  hash: vi.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    findByUsername: vi.fn(),
    findByUsernameWithPassword: vi.fn(),
    findByIdWithPassword: vi.fn(),
    create: vi.fn(),
    updateProfile: vi.fn(),
    updatePassword: vi.fn(),
  };

  const jwtServiceMock = {
    signAsync: vi.fn(),
    sign: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: UsersService,
            useValue:
              usersServiceMock,
          },
          {
            provide: JwtService,
            useValue:
              jwtServiceMock,
          },
        ],
      }).compile();

    service =
      module.get<AuthService>(
        AuthService,
      );
  });

  it('should be defined', () => {
    expect(
      service,
    ).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should update and return the safe user profile', async () => {
      usersServiceMock.updateProfile
        .mockResolvedValue({
          _id: {
            toString: () =>
              'user-123',
          },

          fullName:
            'Zain Ul Abidin',

          username:
            'zain',
        });

      const result =
        await service.updateProfile(
          'user-123',
          {
            fullName:
              '  Zain Ul Abidin  ',

            username:
              '  ZAIN  ',
          },
        );

      expect(
        usersServiceMock.updateProfile,
      ).toHaveBeenCalledWith(
        'user-123',
        'Zain Ul Abidin',
        'zain',
      );

      expect(result).toEqual({
        id: 'user-123',
        fullName:
          'Zain Ul Abidin',
        username: 'zain',
      });
    });
  });

  describe('changePassword', () => {
    const user = {
      _id: {
        toString: () =>
          'user-123',
      },

      username: 'zain',

      passwordHash:
        '$2b$12$storedhash',
    };

    it('should update password when current password is correct', async () => {
      usersServiceMock
        .findByIdWithPassword
        .mockResolvedValue(
          user,
        );

      vi.mocked(
        bcrypt.compare,
      )
        .mockResolvedValueOnce(
          true as never,
        )
        .mockResolvedValueOnce(
          false as never,
        );

      vi.mocked(
        bcrypt.hash,
      ).mockResolvedValue(
        'new-hash' as never,
      );

      usersServiceMock.updatePassword
        .mockResolvedValue(
          undefined,
        );

      const result =
        await service.changePassword(
          'user-123',
          {
            currentPassword:
              'old-password',

            newPassword:
              'new-password',
          },
        );

      expect(
        bcrypt.compare,
      ).toHaveBeenNthCalledWith(
        1,
        'old-password',
        user.passwordHash,
      );

      expect(
        bcrypt.compare,
      ).toHaveBeenNthCalledWith(
        2,
        'new-password',
        user.passwordHash,
      );

      expect(
        bcrypt.hash,
      ).toHaveBeenCalledWith(
        'new-password',
        12,
      );

      expect(
        usersServiceMock.updatePassword,
      ).toHaveBeenCalledWith(
        'user-123',
        'new-hash',
      );

      expect(result).toEqual({
        message:
          'Password updated successfully',
      });
    });

    it('should reject an incorrect current password', async () => {
      usersServiceMock
        .findByIdWithPassword
        .mockResolvedValue(
          user,
        );

      vi.mocked(
        bcrypt.compare,
      ).mockResolvedValueOnce(
        false as never,
      );

      await expect(
        service.changePassword(
          'user-123',
          {
            currentPassword:
              'wrong-password',

            newPassword:
              'new-password',
          },
        ),
      ).rejects.toThrow(
        BadRequestException,
      );

      expect(
        usersServiceMock.updatePassword,
      ).not.toHaveBeenCalled();
    });

    it('should reject when the new password matches the current password', async () => {
      usersServiceMock
        .findByIdWithPassword
        .mockResolvedValue(
          user,
        );

      vi.mocked(
        bcrypt.compare,
      )
        .mockResolvedValueOnce(
          true as never,
        )
        .mockResolvedValueOnce(
          true as never,
        );

      await expect(
        service.changePassword(
          'user-123',
          {
            currentPassword:
              'same-password',

            newPassword:
              'same-password',
          },
        ),
      ).rejects.toThrow(
        BadRequestException,
      );

      expect(
        usersServiceMock.updatePassword,
      ).not.toHaveBeenCalled();
    });

    it('should reject when the authenticated user does not exist', async () => {
      usersServiceMock
        .findByIdWithPassword
        .mockResolvedValue(
          null,
        );

      await expect(
        service.changePassword(
          'missing-user',
          {
            currentPassword:
              'password123',

            newPassword:
              'different123',
          },
        ),
      ).rejects.toThrow(
        UnauthorizedException,
      );

      expect(
        bcrypt.compare,
      ).not.toHaveBeenCalled();

      expect(
        usersServiceMock.updatePassword,
      ).not.toHaveBeenCalled();
    });
  });
});