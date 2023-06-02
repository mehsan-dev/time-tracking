import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: DeepMocked<UsersService>;

  const user = {
    id: 1,
    username: 'testuser',
    password: 'testpassword',
    timeEntries: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    const id = 'testuser';

    it('should return the user with the given id', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      const result = await controller.findOne(id);

      expect(result).toEqual(user);
      expect(usersService.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw an error if the user with the given id is not found', async () => {
      const error = new Error('User not found');
      jest.spyOn(usersService, 'findOne').mockRejectedValue(error);

      expect(await controller.findOne(id)).toEqual(error);
      expect(usersService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('getProfile', () => {
    it('should return the user with the current JWT token', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      const result = await controller.getProfile(user);

      expect(result).toEqual(user);
      expect(usersService.findOne).toHaveBeenCalledWith(user.username);
    });

    it('should throw an error if the user with the current JWT token is not found', async () => {
      const error = new Error('User not found');
      jest.spyOn(usersService, 'findOne').mockRejectedValue(error);

      expect(await controller.getProfile(user)).toEqual(error);
      expect(usersService.findOne).toHaveBeenCalledWith(user.username);
    });
  });
});
