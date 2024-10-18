import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/CreateUserDto';

@Controller('auth') 
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.authService.create(createUserDto);
      return {
        message: 'User registered successfully',
        user: newUser,
      };
    } catch (error) {
      
      if (error.status === 409) {
        throw new ConflictException('Username already exists'); 
      }
      
      throw error; 
    }
  }

  @Post('login') 
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
