import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskEntity } from './tasks.entity';
import { TasksService } from './tasks.service';
import { NextTaskDto } from './dtos/next-task.dto';

/** Exposes HTTP endpoints for creating and reading workflow tasks. */
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /** Returns every task stored in the database. */
  @Get()
  findAll(): Promise<TaskEntity[]> {
    return this.tasksService.findAll();
  }

  /** Creates a task from the validated request body. */
  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksService.create(createTaskDto);
  }

  @Post(':id/next')
  next(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() nextTaskDto: NextTaskDto,
  ): Promise<TaskEntity> {
    return this.tasksService.next(id, nextTaskDto);
  }
}
