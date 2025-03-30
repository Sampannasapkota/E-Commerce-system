import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { capitalizeFirstLetterOfEachWordInAPhrase } from 'src/helper/capitalize';
import { CommonQuery } from 'src/interfaces/query.interface';
import { Roles } from './entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createRoleDto: CreateRoleDto) {
    createRoleDto.name = capitalizeFirstLetterOfEachWordInAPhrase(
      createRoleDto.name,
    );

    if (await this.checkIfRoleExist(createRoleDto.name)) {
      throw new BadRequestException(
        `Role ${createRoleDto.name} has already been taken`,
      );
    }
    return this.prismaService.role.create({ data: createRoleDto });
  }

  async findAll(query: CommonQuery): Promise<Roles> {
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
    const [totalCount, roles] = await this.prismaService.$transaction([
      this.prismaService.role.count({ where: whereClause }),
      this.prismaService.role.findMany({
        where: whereClause,
        skip: query.skip,
        take: query.take,
      }),
    ]);
    return { totalCount, roles };
  }

  findOne(id: number) {
    return this.getRolesById(id);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    updateRoleDto.name = capitalizeFirstLetterOfEachWordInAPhrase(
      updateRoleDto.name,
    );
    if (!(await this.checkIfRoleExist(updateRoleDto.name, id))) {
      throw new BadRequestException(
        `Role ${updateRoleDto.name}has already been taken`,
      );
    }
    return this.prismaService.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async remove(id: number) {
    await this.getRolesById(id);
    return this.prismaService.role.delete({ where: { id } });
  }

  private async checkIfRoleExist(name: string, id?: number): Promise<boolean> {
    const role = await this.prismaService.role.findUnique({
      where: { name },
    });
    if (id) {
      return role ? role.id === id : true;
    }
    return !!role;
  }

  private async getRolesById(id: number) {
    const role = await this.prismaService.role.findFirst({ where: { id } });

    if (!role) {
      throw new NotFoundException(`Role with id ${id} does not exist`);
    }
    return role;
  }
}
