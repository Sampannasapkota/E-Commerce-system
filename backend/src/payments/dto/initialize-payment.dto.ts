import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InitializePaymentDto {
  @IsNotEmpty()
  @IsString()
  return_url: string;

  @IsNotEmpty()
  @IsString()
  website_url: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  purchase_order_id: string;

  @IsNotEmpty()
  @IsString()
  purchase_order_name: string;

  @IsNotEmpty()
  customer_info: {
    name: string;
    email?: string;
    phone: string;
  };
}
