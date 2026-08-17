import { Controller, Get } from '@nestjs/common';
import { TaskEntity } from './tasks.entity';
import { TasksService } from './tasks.service';

/** Exposes HTTP endpoints for creating and reading workflow tasks. */
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /** Returns every task stored in the database. */
  @Get()
  findAll(): Promise<TaskEntity[]> {
    return this.tasksService.findAll();
  }
}
