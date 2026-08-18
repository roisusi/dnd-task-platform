import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { BackTaskDto } from './dtos/back-task.dto';
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

  /** Returns the tasks assigned to one existing demo user. */
  @Get('assigned/:userId')
  findAssignedToUser(
    @Param('userId') userId: string,
  ): Promise<TaskEntity[]> {
    return this.tasksService.findAssignedToUser(userId);
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
    @Headers('x-user-id') currentUserId?: string,
  ): Promise<TaskEntity> {
    return this.tasksService.next(id, nextTaskDto, currentUserId);
  }

  /** Moves an open task one workflow status backward. */
  @Post(':id/back')
  back(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() backTaskDto: BackTaskDto,
    @Headers('x-user-id') currentUserId?: string,
  ): Promise<TaskEntity> {
    return this.tasksService.back(id, backTaskDto, currentUserId);
  }

  /** Closes an open task when it is currently at the final workflow status. */
  @Post(':id/close')
  close(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-id') currentUserId?: string,
  ): Promise<TaskEntity> {
    return this.tasksService.close(id, currentUserId);
  }
}
