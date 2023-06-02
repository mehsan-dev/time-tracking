import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { TimeEntriesService } from './timeEntries.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import CurrentUser from '../auth/decorators/current-user.decorator';
import IUserContext from '../auth/interfaces/user-context.interface';

@Controller('time-entries')
@UseGuards(JwtAuthGuard)
export class TimeEntriesController {
  constructor(private readonly timeService: TimeEntriesService) {}

  @Post()
  async create(
    @Body() createTimeEntryDto: CreateTimeEntryDto,
    @CurrentUser() user: IUserContext,
  ) {
    try {
      return await this.timeService.create(createTimeEntryDto, user);
    } catch (error) {
      return error;
    }
  }

  @Get()
  findAll(@CurrentUser() user: IUserContext) {
    try {
      return this.timeService.findAllByUser(user);
    } catch (error) {
      return error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    try {
      return this.timeService.findOne(id);
    } catch (error) {
      return error;
    }
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateTimeEntrytDto: UpdateTimeEntryDto,
  ) {
    try {
      return this.timeService.update(id, updateTimeEntrytDto);
    } catch (error) {
      return error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    try {
      return this.timeService.remove(id);
    } catch (error) {
      return error;
    }
  }
}
