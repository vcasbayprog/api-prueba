import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto'; 
import { User, UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt'; 
import { CreateUserDto } from 'src/users/dto/CreateUserDto';
import { UsersService } from '../users/users.service'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService, 
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ username: loginDto.username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }

    const payload = { username: user.username, sub: user._id }; 
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
    const role = createUserDto.role || 'user';
  
    const newUser = new this.userModel({
      username: createUserDto.username,
      password: hashedPassword,
      role, 
    });
    
    return newUser.save(); 
  }

  async validateUser(token: string) {
    const payload = this.jwtService.verify(token);
    return await this.usersService.findById(payload.sub); 
  }
}
