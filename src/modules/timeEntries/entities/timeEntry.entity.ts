import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class TimeEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task: string;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @ManyToOne(() => User, (user) => user.timeEntries)
  user: User;
}
