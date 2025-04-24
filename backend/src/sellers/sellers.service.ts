import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { capitalizeFirstLetterOfEachWordInAPhrase } from 'src/helper/capitalize';

@Injectable()
export class SellersService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createSellerDto: CreateSellerDto) {
    const roleObj = await this.prismaService.role.findFirst({
      where: { id: createSellerDto.role_id },
    });
    if (!roleObj) {
      throw new NotFoundException(`Unable to find role`);
    }
    if (await this.checkIfEmailExist(createSellerDto.email)) {
      throw new BadRequestException(`Email is already taken`);
    }
    if (await this.checkIfMobileExist(createSellerDto.phone_no)) {
      throw new BadRequestException(`Mobile alreadt taken`);
    }
    if (await this.checkIfPanExist(createSellerDto.pan_no)) {
      throw new BadRequestException(`Seller of entered PAN already registered`);
    }

    createSellerDto.fullname = capitalizeFirstLetterOfEachWordInAPhrase(
      createSellerDto.fullname,
    );
    return this.prismaService.seller.create({ data: createSellerDto });
  }

  findAll() {
    return this.prismaService.seller.findMany();
  }

  findOne(id: number) {
    return this.prismaService.seller.findUnique({ where: { id } });
  }

  async update(id: number, updateSellerDto: UpdateSellerDto) {
    updateSellerDto.fullname = capitalizeFirstLetterOfEachWordInAPhrase(
      updateSellerDto.fullname,
    );

    const SellerExists = await this.prismaService.seller.findUnique({
      where: { id },
    });
    if (!SellerExists) {
      throw new NotFoundException(`Seller not found`);
    }

    return this.prismaService.seller.update({
      where: { id },
      data: updateSellerDto,
    });
  }

  remove(id: number) {
    return this.prismaService.seller.delete({ where: { id } });
  }
  private async checkIfEmailExist(
    email: string,
    id?: number,
  ): Promise<boolean> {
    const seller = await this.prismaService.seller.findUnique({
      where: {
        email,
      },
    });
    if (id) {
      return seller ? seller.id === id : true;
    }
    return !!seller;
  }
  private async checkIfMobileExist(
    phone_no: string,
    id?: number,
  ): Promise<boolean> {
    const seller = await this.prismaService.seller.findUnique({
      where: { phone_no },
    });
    if (id) {
      return seller ? seller.id === id : true;
    }
    return !!seller;
  }
  private async checkIfPanExist(pan_no: string): Promise<boolean> {
    const seller = await this.prismaService.seller.findUnique({
      where: { pan_no },
    });
    return !!seller;
  }
}
