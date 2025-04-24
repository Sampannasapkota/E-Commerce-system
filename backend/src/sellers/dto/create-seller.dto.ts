import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsNumber()
  @IsNotEmpty()
  role_id: number

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone_no: string;

  @IsString()
  @IsNotEmpty()
  pan_no: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
