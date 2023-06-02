import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import IUserContext from '../auth/interfaces/user-context.interface';
import { UsersService } from '../users/users.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { TimeEntry } from './entities/timeEntry.entity';
import { TimeEntriesService } from './timeEntries.service';

describe('TimeEntriesService', () => {
  let timeService: TimeEntriesService;
  let userService: DeepMocked<UsersService>;
  let timeEntryRepo: DeepMocked<Repository<TimeEntry>>;

  const mockUserContext: IUserContext = {
    id: 1,
    username: 'testuser',
  };

  const mockTimeEntry = {
    id: 1,
    task: 'Test task',
    startTime: new Date(),
    endTime: new Date(),
    user: {
      id: 1,
      username: 'testuser',
      password: 'testPass',
      timeEntries: [],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeEntriesService,
        {
          provide: getRepositoryToken(TimeEntry),
          useValue: createMock<Repository<TimeEntry>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    timeService = module.get<TimeEntriesService>(TimeEntriesService);
    userService = module.get(UsersService);
    timeEntryRepo = module.get(getRepositoryToken(TimeEntry));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    timeEntryRepo;
    expect(timeService).toBeDefined();
  });

  describe('create', () => {
    const createTimeEntryDto: CreateTimeEntryDto = {
      task: 'Test task',
      startTime: new Date(),
      endTime: new Date(),
    };

    it('should create a time entry successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'testPass',
        timeEntries: [],
      };

      userService.findOne.mockResolvedValue(mockUser);
      timeEntryRepo.save.mockResolvedValue({
        id: 1,
        ...createTimeEntryDto,
        user: mockUser,
      });

      const result = await timeService.create(
        createTimeEntryDto,
        mockUserContext,
      );

      expect(userService.findOne).toHaveBeenCalledWith(
        mockUserContext.username,
      );
      expect(timeEntryRepo.save).toHaveBeenCalledWith(expect.any(TimeEntry));
      expect(result).toEqual({ id: 1, ...createTimeEntryDto, user: mockUser });
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(
        timeService.create(createTimeEntryDto, mockUserContext),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByUser', () => {
    it('should return an array of time entries belonging to a user', async () => {
      const mockTimeEntries: TimeEntry[] = [
        {
          id: 1,
          task: 'Test task 1',
          startTime: new Date(),
          endTime: new Date(),
          user: {
            id: 1,
            username: 'testuser',
            password: 'testPass',
            timeEntries: [],
          },
        },
        {
          id: 2,
          task: 'Test task 2',
          startTime: new Date(),
          endTime: new Date(),
          user: {
            id: 1,
            username: 'testuser',
            password: 'testPass',
            timeEntries: [],
          },
        },
      ];
      timeEntryRepo.find.mockResolvedValue(mockTimeEntries);

      const result = await timeService.findAllByUser(mockUserContext);

      expect(timeEntryRepo.find).toHaveBeenCalledWith({
        where: { user: { id: mockUserContext.id } },
      });
      expect(result).toEqual(mockTimeEntries);
    });
  });
  describe('findOne', () => {
    it('should return a time entry by id', async () => {
      timeEntryRepo.findOne.mockResolvedValue(mockTimeEntry);

      const result = await timeService.findOne(1);

      expect(timeEntryRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockTimeEntry);
    });
    it('should return null if time entry does not exist', async () => {
      timeEntryRepo.findOne.mockResolvedValue(null);

      const result = timeService.findOne(1);

      expect(timeEntryRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a time entry by id', async () => {
      const updateTimeEntryDto: UpdateTimeEntryDto = {
        task: 'Updated task',
      };

      timeEntryRepo.findOne.mockResolvedValue(mockTimeEntry);
      timeEntryRepo.save.mockResolvedValue({
        ...mockTimeEntry,
        ...updateTimeEntryDto,
      });

      const result = await timeService.update(1, updateTimeEntryDto);

      expect(timeEntryRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(timeEntryRepo.save).toHaveBeenCalledWith({
        ...mockTimeEntry,
        ...updateTimeEntryDto,
      });
      expect(result).toEqual({
        ...mockTimeEntry,
        ...updateTimeEntryDto,
      });
    });

    it('should throw a NotFoundException if time entry does not exist', async () => {
      const updateTimeEntryDto: UpdateTimeEntryDto = {
        task: 'Updated task',
      };
      timeEntryRepo.findOne.mockResolvedValue(null);

      await expect(timeService.update(1, updateTimeEntryDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a time entry by id', async () => {
      timeEntryRepo.findOne.mockResolvedValue(mockTimeEntry);
      timeEntryRepo.remove.mockResolvedValue(mockTimeEntry);

      const result = await timeService.remove(1);

      expect(timeEntryRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(timeEntryRepo.remove).toHaveBeenCalledWith(mockTimeEntry);
      expect(result).toEqual(mockTimeEntry);
    });

    it('should throw a NotFoundException if time entry does not exist', async () => {
      timeEntryRepo.findOne.mockResolvedValue(null);

      await expect(timeService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
