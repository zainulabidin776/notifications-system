import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema.js';

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
    .findOne({ username })
    .select('+passwordHash')
    .exec();
}

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(
    fullName: string,
    username: string,
    passwordHash: string,
  ): Promise<UserDocument> {
    const user = new this.userModel({
      fullName,
      username,
      passwordHash,
    });

    return user.save();
  }
}