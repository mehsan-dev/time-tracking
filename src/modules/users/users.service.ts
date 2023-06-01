import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const isExist = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });

      if (isExist) {
        throw new HttpException('User Already exists', HttpStatus.BAD_REQUEST);
      }

      const user = new User();
      user.username = createUserDto.username;
      user.password = hashSync(createUserDto.password, 10);

      return await this.userRepository.save(user);
    } catch (error) {
      return error;
    }
  }

  async findOne(username: string) {
    try {
      return await this.userRepository.findOne({ where: { username } });
    } catch (error) {
      return error;
    }
  }

  async findById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      return error;
    }
  }
}
