import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  capitalizeFirstLetterOfEachWordInAPhrase,
  capitalizeFirstLetterOfWord,
} from 'src/helper/capitalize';
import { RolesService } from 'src/roles/roles.service';
import { hash } from 'bcrypt';
import { CommonQuery } from 'src/interfaces/query.interface';
import { Users } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const roleService = new RolesService(this.prismaService);
    await roleService.findOne(createUserDto.role_id);

    const roleObj = await this.prismaService.role.findFirst({
      where: { name: createUserDto.role },
    });
    if (!roleObj) {
      throw new NotFoundException(`Unable to find role ${createUserDto.role}`);
    }
    createUserDto.role_id = roleObj.id;
    const { role, ...rest } = createUserDto;
    rest.fullname = capitalizeFirstLetterOfEachWordInAPhrase(rest.fullname);

    if (await this.checkIfEmailExist(rest.email)) {
      throw new BadRequestException('Email is already taken');
    }

    if (await this.checkIfMobileExist(rest.mobile)) {
      throw new BadRequestException('Mobile already taken');
    }
    rest.password = await hash(rest.password, 10);
    return this.prismaService.user.create({ data: rest });
  }

  async findAll(query: CommonQuery): Promise<Users> {
    const whereClause: { AND?: Object[] } = {};
    if (query.search) {
      whereClause.AND = [
        {
          OR: [
            {
              fullname: {
                contains: query.search,
              },
            },
          ],
        },
      ];
    }
    const [totalCount, users] = await this.prismaService.$transaction([
      this.prismaService.user.count({ where: whereClause }),
      this.prismaService.user.findMany({
        where: whereClause,
        skip: query.skip,
        take: query.take,
      }),
    ]);
    return { totalCount, users };
  }

  findOne(id: number) {
    return this.prismaService.user.findFirst({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    updateUserDto.fullname = capitalizeFirstLetterOfEachWordInAPhrase(
      updateUserDto.fullname,
    );
    if (updateUserDto.fullname) {
      updateUserDto.fullname = capitalizeFirstLetterOfWord(
        updateUserDto.fullname,
      );
    }
    if (!(await this.checkIfUserExist(updateUserDto.fullname, id))) {
      throw new BadRequestException('This user already exist');
    }
    const { role, ...rest } = updateUserDto;
    if (!(await this.checkIfEmailExist(updateUserDto.email, id))) {
      throw new BadRequestException(
        `User ${updateUserDto.email} has already been taken`,
      );
    }
    if (!(await this.checkIfMobileExist(updateUserDto.mobile, id))) {
      throw new BadRequestException(
        `User with ${updateUserDto.mobile}has already been taken`,
      );
    }
    rest.fullname = capitalizeFirstLetterOfEachWordInAPhrase(
      updateUserDto.fullname,
    );
    return this.prismaService.user.update({ where: { id }, data: rest });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.user.delete({ where: { id } });
  }
  private async checkIfUserExist(
    fullname: string,
    id?: number,
  ): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (id) {
      return user ? user.id === id : true;
    }
    return !!user;
  }

  private async checkIfEmailExist(
    email: string,
    id?: number,
  ): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (id) {
      return user ? user.id === id : true;
    }
    return !!user;
  }

  private async checkIfMobileExist(
    mobile: string,
    id?: number,
  ): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { mobile },
    });
    if (id) {
      return user ? user.id === id : true;
    }
    return !!user;
  }
}
