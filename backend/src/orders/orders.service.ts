import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createOrderDto: CreateOrderDto) {
    const userExists = await this.prismaService.user.findUnique({
      where: { id: createOrderDto.user_id },
    });
    if (!userExists) {
      throw new BadRequestException(
        `User with id ${createOrderDto.user_id}not found`,
      );
    }
    const productExists = await this.prismaService.product.findMany({
      where: {
        id: createOrderDto.product_id,
        quantity: createOrderDto.quantity,
      },
    });
    if (!productExists) {
      throw new BadRequestException(
        `Product with ID ${createOrderDto.product_id} not found`,
      );
    }
    return this.prismaService.order.create({
      data: {
        product_id: createOrderDto.product_id,
        user_id: createOrderDto.user_id,
        quantity: createOrderDto.quantity,
      },
    });
  }

  findAll() {
    return this.prismaService.order.findMany();
  }

  findOne(id: number) {
    return this.getOrdersById(id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const OrderExists = await this.prismaService.order.findUnique({
      where: { id },
    });
    if (!OrderExists) {
      throw new BadRequestException(`Order with ID ${id} not found`);
    }
    const userExists = await this.prismaService.user.findUnique({
      where: { id: updateOrderDto.user_id },
    });
    if (!userExists) {
      throw new BadRequestException(
        `User with ID ${updateOrderDto.user_id} not found`,
      );
    }
    const productExists = await this.prismaService.product.findMany({
      where: {
        id: updateOrderDto.product_id,
        quantity: updateOrderDto.quantity,
      },
    });
    if (!productExists) {
      throw new BadRequestException(
        `Product with ID ${updateOrderDto.product_id} not found`,
      );
    }
    return this.prismaService.order.update({
      where: { id },
      data: {
        user_id: updateOrderDto.user_id,
        product_id: updateOrderDto.product_id,
      },
    });
  }

  async remove(id: number) {
    await this.getOrdersById(id);
    return this.prismaService.order.findFirst({ where: { id } });
  }
  private async getOrdersById(id: number) {
    const order = await this.prismaService.order.findFirst({ where: { id } });
    if (!order) {
      throw new BadRequestException(`Order with id ${id} does not exist.`);
    }
    return order;
  }
}
