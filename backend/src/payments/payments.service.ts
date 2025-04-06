import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createPaymentDto: CreatePaymentDto) {
    const checkIfOrderExist = await this.prismaService.order.findUnique({
      where: { id: createPaymentDto.order_id },
    });
    if (!checkIfOrderExist) {
      throw new BadRequestException(
        `Payment of orderID ${createPaymentDto.order_id} does not exist`,
      );
    }
    return this.prismaService.payment.create({
      data: {
        order_id: createPaymentDto.order_id,
      },
    });
  }

  findAll() {
    return this.prismaService.payment.findMany();
  }

  findOne(id: number) {
    return this.prismaService.payment.findUnique({ where: { id } });
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const paymentExist = this.prismaService.payment.findUnique({
      where: { id },
    });
    if (!paymentExist) {
      throw new BadRequestException(`Paymend of Id ${id} does not found.`);
    }
    const orderExist = this.prismaService.order.findUnique({
      where: { id },
    });
    if (!orderExist) {
      throw new BadRequestException(`Order of ID ${id} not found`);
    }
    return this.prismaService.payment.update({
      where: { id },
      data: {
        order_id: updatePaymentDto.order_id,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.payment.delete({ where: { id } });
  }
}
