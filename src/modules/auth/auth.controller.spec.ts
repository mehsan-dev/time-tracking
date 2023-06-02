import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import LoginInput from './dto/login-input.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import RegisterInput from './dto/register-input.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: DeepMocked<AuthService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(createMock)
      .compile();

    authService = moduleRef.get(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('Login', () => {
    const user: LoginInput = {
      username: 'testuser',
      password: 'testpassword',
    };

    it('It should returned an accessToken upon successful login', async () => {
      const mockResponse = { accessToken: '1qwer23231asdf23' };

      authService.login.mockImplementationOnce(() =>
        Promise.resolve(mockResponse),
      );

      const loginRes = authController.login(user);

      expect(authService.login).toBeCalled();
      expect(authService.login).toBeCalledWith(user);
      expect(loginRes).resolves.toBe(mockResponse);
    });

    it('should throw an HttpException with status 404 if the user is not authenticated', async () => {
      const errorMessage = 'Invalid username or password';
      const error = new HttpException(errorMessage, HttpStatus.NOT_FOUND);

      authService.login.mockRejectedValueOnce(error);
      const loginRes = await authController.login(user);

      expect(loginRes).toEqual(error);
      expect(authService.login).toBeCalledTimes(1);
    });
  });

  describe('register', () => {
    const user: RegisterInput = {
      username: 'testuser',
      password: 'testpassword',
    };

    it('should return the created user', async () => {
      const createdUser = { id: 1, ...user };

      authService.register.mockResolvedValueOnce(createdUser);

      expect(authController.register(user)).resolves.toBe(createdUser);
      expect(authService.register).toHaveBeenCalledWith(user);
    });

    it('should not create the user', async () => {
      const error = new HttpException(
        'User Already exists',
        HttpStatus.BAD_REQUEST,
      );

      authService.register.mockImplementationOnce(() => Promise.reject(error));

      expect(await authController.register(user)).toEqual(error);
      expect(authService.register).toHaveBeenCalledWith(user);
    });
  });
});
