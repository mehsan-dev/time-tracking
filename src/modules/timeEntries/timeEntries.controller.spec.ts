import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { TimeEntriesController } from './timeEntries.controller';
import { TimeEntriesService } from './timeEntries.service';

describe('TimeEntries Controller', () => {
  let controller: TimeEntriesController;
  let timeService: DeepMocked<TimeEntriesService>;

  const user = {
    id: 1,
    username: 'testuser',
    password: 'testPassword',
    timeEntries: [],
  };

  const date = new Date();

  const timeEntry = {
    id: 1,
    task: 'Hello, world!',
    startTime: new Date(),
    endTime: new Date(),
    user,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeEntriesController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<TimeEntriesController>(TimeEntriesController);
    timeService = module.get(TimeEntriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createTimeEntryDto: CreateTimeEntryDto = {
      task: 'Hello, world!',
      startTime: date,
      endTime: date,
    };

    it('should create a time entry and return it', async () => {
      timeService.create.mockResolvedValue(timeEntry);

      const result = await controller.create(createTimeEntryDto, user);

      expect(result).toEqual(timeEntry);
      expect(timeService.create).toHaveBeenCalledWith(createTimeEntryDto, user);
    });

    it('should catch and return any errors thrown by TimeEntriesService.create', async () => {
      const error = new Error('Something went wrong');
      timeService.create.mockRejectedValue(error);

      const result = await controller.create(createTimeEntryDto, user);

      expect(result).toEqual(error);
      expect(timeService.create).toHaveBeenCalledWith(createTimeEntryDto, user);
    });
  });

  describe('findAll', () => {
    it('should return an array of time entries belonging to the user', async () => {
      const timeEntries = [timeEntry];
      timeService.findAllByUser.mockResolvedValue(timeEntries);

      const result = await controller.findAll(user);

      expect(result).toEqual(timeEntries);
      expect(timeService.findAllByUser).toHaveBeenCalledWith(user);
    });

    it('should catch and return any errors thrown by TimeEntriesService.findAllByUser', async () => {
      const error = new Error('Something went wrong');
      timeService.findAllByUser.mockRejectedValue(error);

      const result = controller.findAll(user);

      expect(result).rejects.toEqual(error);
      expect(timeService.findAllByUser).toHaveBeenCalledWith(user);
    });
  });

  describe('findOne', () => {
    const id = 1;

    it('should return the time entry with the given id', async () => {
      jest.spyOn(timeService, 'findOne').mockResolvedValue(timeEntry);

      const result = await controller.findOne(id);

      expect(result).toEqual(timeEntry);
      expect(timeService.findOne).toHaveBeenCalledWith(id);
    });

    it('should catch and return any errors thrown by TimeEntriesService.findOne', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(timeService, 'findOne').mockRejectedValue(error);

      const result = controller.findOne(id);

      expect(result).rejects.toEqual(error);
      expect(timeService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    const id = 1;
    const updateTimeEntryDto: UpdateTimeEntryDto = {
      task: 'Updated task name',
    };

    it('should update the time entry with the given id and return it', async () => {
      const entry = {
        ...timeEntry,
        task: 'Updated entry content',
      };
      jest.spyOn(timeService, 'update').mockResolvedValue(entry);

      const result = await controller.update(id, updateTimeEntryDto);

      expect(result).toEqual(entry);
      expect(timeService.update).toHaveBeenCalledWith(id, updateTimeEntryDto);
    });

    it('should catch and return any errors thrown by TimeEntriesService.update', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(timeService, 'update').mockRejectedValue(error);

      const result = controller.update(id, updateTimeEntryDto);

      expect(result).rejects.toEqual(error);
      expect(timeService.update).toHaveBeenCalledWith(id, updateTimeEntryDto);
    });
  });

  describe('remove', () => {
    const id = 1;

    it('should delete the time entry with the given id and return it', async () => {
      jest.spyOn(timeService, 'remove').mockResolvedValue(timeEntry);

      const result = await controller.remove(id);

      expect(result).toEqual(timeEntry);
      expect(timeService.remove).toHaveBeenCalledWith(id);
    });

    it('should catch and return any errors thrown by TimeEntriesService.remove', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(timeService, 'remove').mockRejectedValue(error);

      const result = controller.remove(id);

      expect(result).rejects.toEqual(error);
      expect(timeService.remove).toHaveBeenCalledWith(id);
    });
  });
});
