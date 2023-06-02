import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { TimeEntry } from './entities/timeEntry.entity';
import { TimeEntriesController } from './timeEntries.controller';
import { TimeEntriesService } from './timeEntries.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEntry]), UsersModule],
  controllers: [TimeEntriesController],
  providers: [TimeEntriesService, UsersService],
  exports: [TypeOrmModule],
})
export class TimeEntriesModule {}
