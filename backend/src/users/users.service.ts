import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  InjectModel,
} from '@nestjs/mongoose';

import {
  Model,
  Types,
} from 'mongoose';

import {
  User,
  UserDocument,
} from './schemas/user.schema.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByUsernameWithPassword(
    username: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        username: username
          .trim()
          .toLowerCase(),
      })
      .select('+passwordHash')
      .exec();
  }

  async findByUsername(
    username: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        username: username
          .trim()
          .toLowerCase(),
      })
      .exec();
  }

  async findById(
    id: string,
  ): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return this.userModel
      .findById(id)
      .exec();
  }

  async findByIdWithPassword(
    id: string,
  ): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return this.userModel
      .findById(id)
      .select('+passwordHash')
      .exec();
  }

  async create(
    fullName: string,
    username: string,
    passwordHash: string,
  ): Promise<UserDocument> {
    const user =
      new this.userModel({
        fullName:
          fullName.trim(),

        username:
          username
            .trim()
            .toLowerCase(),

        passwordHash,
      });

    return user.save();
  }

  async updateProfile(
    id: string,
    fullName: string,
    username: string,
  ): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const normalizedUsername =
      username
        .trim()
        .toLowerCase();

    const existingUser =
      await this.userModel
        .findOne({
          username:
            normalizedUsername,

          _id: {
            $ne:
              new Types.ObjectId(
                id,
              ),
          },
        })
        .exec();

    if (existingUser) {
      throw new ConflictException(
        'Username is already taken',
      );
    }

    const updatedUser =
      await this.userModel
        .findByIdAndUpdate(
          id,
          {
            fullName:
              fullName.trim(),

            username:
              normalizedUsername,
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .exec();

    if (!updatedUser) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return updatedUser;
  }

  async updatePassword(
    id: string,
    passwordHash: string,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const updatedUser =
      await this.userModel
        .findByIdAndUpdate(
          id,
          {
            passwordHash,
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .exec();

    if (!updatedUser) {
      throw new NotFoundException(
        'User not found',
      );
    }
  }
}