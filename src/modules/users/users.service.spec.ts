import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: DeepMocked<Repository<User>>;

  const user = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    timeEntries: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
      };

      userRepository.findOne.mockResolvedValueOnce(undefined);
      userRepository.save.mockResolvedValueOnce(user);

      const result = await userService.create(createUserDto);

      expect(result).toEqual(user);
    });

    it('should throw an error if the user already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
      };

      userRepository.findOne.mockResolvedValueOnce(user);

      expect(await userService.create(createUserDto)).toEqual(
        new HttpException('User Already exists', HttpStatus.BAD_REQUEST),
      );
    });

    it('should return an error if something goes wrong', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
      };
      const error = new Error();
      userRepository.findOne.mockRejectedValueOnce(error);

      const result = await userService.create(createUserDto);

      expect(result).toEqual(error);
    });
  });

  describe('findOne', () => {
    it('should find a user by username', async () => {
      userRepository.findOne.mockResolvedValueOnce(user);

      const result = await userService.findOne(user.username);

      expect(result).toEqual(user);
    });

    it('should return null if the user does not exist', async () => {
      userRepository.findOne.mockResolvedValueOnce(null);

      const result = await userService.findOne('nonexistentuser');

      expect(result).toBeNull();
    });

    it('should return an error if something went wrong', async () => {
      const error = new Error();
      userRepository.findOne.mockRejectedValueOnce(error);

      const result = await userService.findOne('testuser');

      expect(result).toEqual(error);
    });
  });
});
