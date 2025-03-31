import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
