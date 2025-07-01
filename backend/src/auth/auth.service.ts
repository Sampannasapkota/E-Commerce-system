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
import { SellersService } from 'src/sellers/sellers.service';
import { SellerLoginDto } from './dto/sellerLogin.dto';
import { SellerRegisterDto } from './dto/sellerRegister.dto';

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
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
      },
    };
  }
  //for seller login
  async sellerLogin(sellerLoginDto: SellerLoginDto) {
    const seller = await this.prismaService.seller.findFirst({
      where: {
        OR: [
          {
            email: sellerLoginDto.email?.toLowerCase(),
          },
          {
            phone_no: sellerLoginDto.phone_no,
          },
        ],
      },
    });
    if (!seller) {
      throw new NotFoundException('Unable to find seller');
    }
    if (!(await compare(sellerLoginDto.password, seller.password))) {
      throw new UnauthorizedException('Invalid Credentials!');
    }
    const token = await this.jwtService.signAsync(seller);
    return {
      token,
      seller: {
        id: seller.id,
        email: seller.email,
        fullname: seller.fullname,
      },
    };
  }

  //for user register

  async register(registerDto: RegisterDto) {
    const userService = new UsersService(this.prismaService);
    const user = await userService.create(registerDto);
    const token = await this.jwtService.signAsync(user);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
      },
    };
  }
  //for seller register
  async sellerRegister(sellerRegisterDto: SellerRegisterDto) {
    const sellerService = new SellersService(this.prismaService);
    const seller = await sellerService.create(sellerRegisterDto);
    const token = await this.jwtService.signAsync(seller);
    return {
      token,
      seller: {
        id: seller.id,
        email: seller.email,
        fullname: seller.fullname,
        shop_name: seller.shop_name,
      },
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

  async getSellerProfile(sellerId: number) {
    const seller = await this.prismaService.seller.findFirst({
      where: { id: sellerId },
    });
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    return seller;
  }
}
