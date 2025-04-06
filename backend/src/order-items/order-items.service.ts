import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderItemsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createOrderItemDto: CreateOrderItemDto) {
    const orderExists = await this.prismaService.order.findUnique({
      where: { id: createOrderItemDto.order_id },
    });
    if (!orderExists) {
      throw new BadRequestException(
        `Order of ID ${createOrderItemDto.order_id} not found`,
      );
    }
    return this.prismaService.order_Item.create({
      data: {
        order_id: createOrderItemDto.order_id,
      },
    });
  }

  findAll() {
    return this.prismaService.order_Item.findMany();
  }

  findOne(id: number) {
    return this.prismaService.order_Item.findUnique({ where: { id } });
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const checkOrderItemExist = await this.prismaService.order_Item.findUnique({
      where: { id },
    });
    if (!checkOrderItemExist) {
      throw new BadRequestException(`The provided order item ${id} not found`);
    }
    const productExists = await this.prismaService.product.findMany({
      where: {
        id: updateOrderItemDto.product_id,
        quantity: updateOrderItemDto.quantity,
      },
    });
    if (!productExists) {
      throw new BadRequestException(
        `Product with ID ${updateOrderItemDto.product_id} not found`,
      );
    }
    return this.prismaService.order_Item.update({
      where: { id },
      data: {
        order_id: updateOrderItemDto.order_id,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.order_Item.delete({ where: { id } });
  }
}
