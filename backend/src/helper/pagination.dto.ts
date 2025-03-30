import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @IsOptional()
  skip: number;

  @IsNumber()
  @IsOptional()
  take: number;
}
