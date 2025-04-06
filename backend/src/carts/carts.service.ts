import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
    return this.getCartsById(id);
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    const cartExists = await this.prismaService.cart.findUnique({
      where: { id },
    });
    if (!cartExists) {
      throw new BadRequestException(`Cart with ID ${id} not found`);
    }
    const userExists = await this.prismaService.user.findUnique({
      where: { id: updateCartDto.user_id },
    });
    if (!userExists) {
      throw new BadRequestException(
        `User with ID ${updateCartDto.user_id} not found`,
      );
    }
    const productExists = await this.prismaService.product.findUnique({
      where: { id: updateCartDto.product_id },
    });
    if (!productExists) {
      throw new BadRequestException(
        `Product with ID ${updateCartDto.product_id} not found`,
      );
    }
    return this.prismaService.cart.update({
      where: { id },
      data: {
        quantity: updateCartDto.quantity,
        user_id: updateCartDto.user_id,
        product_id: updateCartDto.product_id,
      },
    });
  }

  async remove(id: number) {
    await this.getCartsById(id);
    return this.prismaService.cart.delete({ where: { id } });
  }
  private async getCartsById(id: number) {
    const cart = await this.prismaService.cart.findFirst({ where: { id } });
    if (!cart) {
      throw new BadRequestException(`Cart with id ${id} does not exist.`);
    }
    return cart;
  }
}
