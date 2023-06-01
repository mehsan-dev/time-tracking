import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import LoginInput from './dto/login-input.dto';
import LoginResponse from './dto/login-response.dto';
import RegisterInput from './dto/register-input.dto';
import { compareSync } from 'bcryptjs';
import IJwtPayload from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const matched = compareSync(pass, user.password);

      if (matched) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(dto: LoginInput): Promise<LoginResponse> {
    try {
      const { username, password } = dto;
      const user = await this.validateUser(username, password);

      if (!user) {
        throw new HttpException(
          'Invalid username or password',
          HttpStatus.NOT_FOUND,
        );
      }
      const jwtPayload: IJwtPayload = { username, id: user.id };

      return {
        accessToken: this.jwtService.sign(jwtPayload),
      };
    } catch (error) {
      return error;
    }
  }

  async register(registerInput: RegisterInput) {
    try {
      const { username, password } = registerInput;
      const user = await this.usersService.create({
        username,
        password,
      });

      return user;
    } catch (error) {
      return error;
    }
  }
}
