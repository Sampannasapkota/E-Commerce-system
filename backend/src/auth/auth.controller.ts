import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/helper/public';
import { RegisterDto } from './dto/register.dto';
import { request } from 'http';
import { User } from '@prisma/client';
import { SellerLoginDto } from './dto/sellerLogin.dto';
import { SellerRegisterDto } from './dto/sellerRegister.dto';

interface AuthRequest extends Request {
  payload: User;
}

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('seller-login')
  async sellerLogin(@Body() sellerLoginDto: SellerLoginDto) {
    return this.authService.sellerLogin(sellerLoginDto);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Public()
  @Post('register-seller')
  async sellerRegister(@Body() sellerRegisterDto: SellerRegisterDto) {
    return this.authService.sellerRegister(sellerRegisterDto);
  }

  @Get('profile')
  async getProfile(@Req() request: AuthRequest) {
    const userId = request.payload?.id;
    return this.authService.getUserProfile(userId);
  }

  @Get('seller-profile')
  async getSellerProfile(@Req() request: AuthRequest) {
    const sellerId = request.payload?.id;
    return this.authService.getSellerProfile(sellerId);
  }
}
