import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import LoginInput from './dto/login-input.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginInput) {
    try {
      return await this.authService.login(user);
    } catch (error) {
      return error;
    }
  }

  @Post('register')
  async register(@Body() user: LoginInput) {
    try {
      return await this.authService.register(user);
    } catch (error) {
      return error;
    }
  }
}
