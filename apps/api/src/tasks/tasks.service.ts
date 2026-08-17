import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './tasks.entity';

/**
 * Handles task persistence and coordinates task-flow business operations.
 *
 * TypeORM supplies Repository<TaskEntity>, which provides the basic database
 * operations for the tasks table.
 */
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
  ) {}

  /** Returns every task currently stored in the tasks table. */
  findAll(): Promise<TaskEntity[]> {
    return this.tasksRepository.find();
  }
}
