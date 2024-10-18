import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  role: string;

  @IsString()  
  isMarkedForDeletion?: boolean;  
}
