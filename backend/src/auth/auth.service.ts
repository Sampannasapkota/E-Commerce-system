import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            email: loginDto.email,
          },
          {
            mobile: loginDto.mobile,
          },
        ],
      },
      include: {
        role: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Unable to find user');
    }
    if (!(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid Credentials!');
    }
    const token = await this.jwtService.signAsync(user);
    return {
      token,
    };
  }
  //for register

  async register(registerDto: RegisterDto) {
    const userService = new UsersService(this.prismaService);
    const user = await userService.create(registerDto);
    const token = await this.jwtService.signAsync(user);
    return {
      token,
    };
  }
  async getUserProfile(userId: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found!!');
    }
    return user;
  }
}
