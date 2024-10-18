import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUserDto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}


  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(id: string, updateUserDto: CreateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

 
  async markForDeletion(id: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, { isMarkedForDeletion: true }, { new: true }).exec();
  }


  async requestDeactivation(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (user) {
      user.isMarkedForDeletion = true; 
      await user.save();
    }
    return user;
  }

  
  async deleteMarkedUsers(): Promise<number> {
    const result = await this.userModel.deleteMany({ isMarkedForDeletion: true }).exec();
    return result.deletedCount;
  }

  @Cron('* * * * *') 
async handleUserDeletion() {
    console.log('Cron job started');
    const deletedCount = await this.deleteMarkedUsers();
    console.log(`${deletedCount} users were deleted`);
}


}
