import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import IUserContext from '../auth/interfaces/user-context.interface';
import { UsersService } from '../users/users.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { TimeEntry } from './entities/timeEntry.entity';

@Injectable()
export class TimeEntriesService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntryRepository: Repository<TimeEntry>,

    private userService: UsersService,
  ) {}

  async create(
    createTimeEntryDto: CreateTimeEntryDto,
    user: IUserContext,
  ): Promise<TimeEntry> {
    const existingUser = await this.userService.findOne(user.username);

    if (!existingUser) {
      throw new NotFoundException('User does not exists');
    }

    const timeEntry = new TimeEntry();
    timeEntry.task = createTimeEntryDto.task;
    timeEntry.endTime = createTimeEntryDto.endTime;
    timeEntry.startTime = createTimeEntryDto.startTime;
    timeEntry.user = existingUser;
    return this.timeEntryRepository.save(timeEntry);
  }

  async findAllByUser(user: IUserContext): Promise<TimeEntry[]> {
    return await this.timeEntryRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async findOne(id: number): Promise<TimeEntry> {
    const timeEntry = await this.timeEntryRepository.findOne({ where: { id } });

    if (!timeEntry) {
      throw new NotFoundException('Time entry does not exist!');
    }

    return timeEntry;
  }

  async update(
    id: number,
    updateTimeEntryDto: UpdateTimeEntryDto,
  ): Promise<TimeEntry> {
    const timeEntry = await this.findOne(id);

    if (!timeEntry) {
      throw new NotFoundException('Time entry does not exist!');
    }

    Object.assign(timeEntry, updateTimeEntryDto);

    return await this.timeEntryRepository.save(timeEntry);
  }

  async remove(id: number): Promise<TimeEntry> {
    const timeEntry = await this.findOne(id);

    if (!timeEntry) {
      throw new NotFoundException('Time entry not exist!');
    }
    return await this.timeEntryRepository.remove(timeEntry);
  }
}
