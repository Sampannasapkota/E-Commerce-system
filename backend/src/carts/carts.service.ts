import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class CartsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createCartDto: CreateCartDto) {
    const userExists = await this.prismaService.user.findUnique({
      where: { id: createCartDto.user_id },
    });
    if (!userExists) {
      throw new BadRequestException(
        `User with ID ${createCartDto.user_id} not found`,
      );
    }
    const productExists = await this.prismaService.product.findUnique({
      where: { id: createCartDto.product_id },
    });
    if (!productExists) {
      throw new BadRequestException(
        `Product with ID ${createCartDto.product_id} not found`,
      );
    }
    return this.prismaService.cart.create({
      data: {
        quantity: createCartDto.quantity,
        user_id: createCartDto.user_id,
        product_id: createCartDto.product_id,
      },
    });
  }

  findAll() {
    return this.prismaService.cart.findMany();
  }

  findOne(id: number) {
    return this.prismaService.cart.findFirst();
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
