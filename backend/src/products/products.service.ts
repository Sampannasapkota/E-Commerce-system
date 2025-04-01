import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { capitalizeFirstLetterOfEachWordInAPhrase } from 'src/helper/capitalize';
import { CommonQuery } from 'src/interfaces/query.interface';
import { contains } from 'class-validator';
import { Products } from './entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    createProductDto.name = capitalizeFirstLetterOfEachWordInAPhrase(
      createProductDto.name,
    );
    if (await this.checkIfProductExist(createProductDto.name)) {
      throw new BadRequestException(
        `Product ${createProductDto.name} already exists`,
      );
    }
    return this.prismaService.product.create({ data: createProductDto });
  }

  async findAll(query: CommonQuery): Promise<Products> {
    const whereClause: { AND?: Object[] } = {};

    if (query.search) {
      whereClause.AND = [
        {
          OR: [
            {
              name: {
                contains: query.search,
              },
            },
          ],
        },
      ];
    }
    const [totalCount, products] = await this.prismaService.$transaction([
      this.prismaService.product.count({ where: whereClause }),
      this.prismaService.product.findMany({
        where: whereClause,
        skip: query.skip,
        take: query.take,
      }),
    ]);
    return { totalCount, products };
  }

  findOne(id: number) {
    return this.getProductById(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    updateProductDto.name = capitalizeFirstLetterOfEachWordInAPhrase(
      updateProductDto.name,
    );
    if (!this.checkIfProductExist(updateProductDto.name, id)) {
      throw new BadRequestException(
        `Role ${updateProductDto.name} has already been taken`,
      );
    }

    return this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.getProductById(id);
    return this.prismaService.product.delete({ where: { id } });
  }

  private async checkIfProductExist(
    name: string,
    id?: number,
  ): Promise<boolean> {
    const product = await this.prismaService.product.findFirst({
      where: { name },
    });
    if (!product) {
      return false;
    }
    if (id) {
      return product.id === id;
    }
    return true;
  }

  private async getProductById(id: number) {
    const product = await this.prismaService.product.findFirst({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Role with id ${id} does not exist`);
    }
    return product;
  }
}
