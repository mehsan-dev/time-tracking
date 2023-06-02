import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import LoginInput from './dto/login-input.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import RegisterInput from './dto/register-input.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import LoginResponse from './dto/login-response.dto';
import { hashSync } from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: DeepMocked<JwtService>;
  let usersService: DeepMocked<UsersService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    jwtService = moduleRef.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    const testPassword = 'testPassword';

    const user = {
      username: 'testuser',
      password: hashSync(testPassword, 10),
      id: 1,
      timeEntries: [],
    };

    it('should return user if username and password are correct', async () => {
      usersService.findOne.mockImplementationOnce(() => Promise.resolve(user));
      expect(
        await authService.validateUser(user.username, testPassword),
      ).toEqual({ id: user.id, username: user.username, timeEntries: [] });
    });

    it('should return null if username is incorrect', async () => {
      usersService.findOne.mockImplementationOnce(() => Promise.resolve(null));

      expect(
        await authService.validateUser(user.username, testPassword),
      ).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      usersService.findOne.mockImplementationOnce(() => Promise.resolve(user));

      expect(
        await authService.validateUser(user.username, 'wrongPassword'),
      ).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token if username and password are correct', async () => {
      const user = { id: 1, username: 'testuser', password: 'testpassword' };
      const loginInput: LoginInput = {
        username: 'testuser',
        password: 'testpassword',
      };
      const loginResponse: LoginResponse = { accessToken: 'testaccesstoken' };

      jest
        .spyOn(authService, 'validateUser')
        .mockImplementationOnce(() => Promise.resolve(user));

      jwtService.sign.mockImplementationOnce(() => 'testaccesstoken');

      expect(await authService.login(loginInput)).toEqual(loginResponse);
      expect(authService.validateUser).toBeCalledWith(
        loginInput.username,
        loginInput.password,
      );
    });

    it('should throw an error if username or password is incorrect', async () => {
      const loginInput: LoginInput = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      const error = new HttpException(
        'Invalid username or password',
        HttpStatus.NOT_FOUND,
      );

      jest
        .spyOn(authService, 'validateUser')
        .mockImplementationOnce(() => Promise.resolve(null));

      const res = await authService.login(loginInput);

      expect(res).toEqual(error);
      expect(authService.validateUser).toBeCalledWith(
        loginInput.username,
        loginInput.password,
      );
    });
  });

  describe('register', () => {
    const user: RegisterInput = {
      username: 'testuser',
      password: 'testpassword',
    };

    it('should return the created user', async () => {
      const createdUser = { id: 1, ...user };

      usersService.create.mockResolvedValueOnce(Promise.resolve(createdUser));

      expect(authService.register(user)).resolves.toEqual(createdUser);
    });

    it('should not create the user', async () => {
      const error = new HttpException(
        'User Already exists',
        HttpStatus.BAD_REQUEST,
      );

      usersService.create.mockRejectedValue(Promise.reject(error));

      expect(authService.register(user)).rejects.toBe(error);
    });
  });
});
