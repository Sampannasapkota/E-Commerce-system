import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SellerLoginDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone_no: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}