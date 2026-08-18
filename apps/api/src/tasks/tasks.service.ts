import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  create as createTask,
  next as nextTask,
  back as backTask,
  close as closeTask,
} from '@dnb/task-flow-core';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { NextTaskDto } from './dtos/next-task.dto';
import { findWorkflowDefinition } from './workflows/workflow.registry';
import { TaskEntity } from './tasks.entity';
import { BackTaskDto } from './dtos/back-task.dto';
import { UserEntity } from '../users/user.entity';

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
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  /** Returns every task currently stored in the tasks table. */
  findAll(): Promise<TaskEntity[]> {
    return this.tasksRepository.find();
  }

  /** Returns one persisted task or rejects an unknown identifier. */
  async findOne(id: string): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (task === null) {
      throw new NotFoundException(`Task ${id} was not found.`);
    }

    return task;
  }

  /** Returns every task currently assigned to an existing demo user. */
  async findAssignedToUser(userId: string): Promise<TaskEntity[]> {
    await this.requireUser(userId);

    return this.tasksRepository.findBy({ assignedUserId: userId });
  }

  /** Creates and persists a task using its registered workflow definition. */
  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    await this.requireUser(createTaskDto.assignedUserId);

    const definition = this.requireWorkflowDefinition(
      createTaskDto.workflowKey,
    );

    const result = createTask({
      taskId: randomUUID(),
      definition,
      data: createTaskDto.data,
      initialAssignedUserId: createTaskDto.assignedUserId,
    });

    if (result.task === null) {
      throw new BadRequestException(result.messages);
    }

    const taskEntity = this.tasksRepository.create(result.task);
    return this.tasksRepository.save(taskEntity);
  }

  /** Advances a task using the definition identified by its persisted key. */
  async next(
    id: string,
    nextTaskDto: NextTaskDto,
    currentUserId?: string,
  ): Promise<TaskEntity> {
    const existingTask = await this.findOne(id);

    await this.requireAssignedUser(existingTask, currentUserId);
    await this.requireUser(nextTaskDto.nextAssignedUserId);
    const definition = this.requireWorkflowDefinition(existingTask.workflowKey);

    // 3. Call the task-flow-core next operation with the existing task,
    //    registered definition, DTO data and next assignee.
    const result = nextTask({
      data: nextTaskDto.data,
      nextAssignedUserId: nextTaskDto.nextAssignedUserId,
      task: existingTask,
      definition,
    });
    // 4. Throw BadRequestException when the core operation returns no task.
    if (result.task === null) {
      throw new BadRequestException(result.messages);
    }
    // 5. Persist and return the task produced by the core operation.
    return this.tasksRepository.save(result.task);
  }

  async back(
    id: string,
    backTaskDto: BackTaskDto,
    currentUserId?: string,
  ): Promise<TaskEntity> {
    const existingTask = await this.findOne(id);

    await this.requireAssignedUser(existingTask, currentUserId);
    await this.requireUser(backTaskDto.previousAssignedUserId);
    const definition = this.requireWorkflowDefinition(existingTask.workflowKey);

    const result = backTask({
      task: existingTask,
      definition,
      previousAssignedUserId: backTaskDto.previousAssignedUserId,
    });

    if (result.task === null) {
      throw new BadRequestException(result.messages);
    }
    return this.tasksRepository.save(result.task);
  }

  async close(id: string, currentUserId?: string): Promise<TaskEntity> {
    const existingTask = await this.findOne(id);

    await this.requireAssignedUser(existingTask, currentUserId);
    const definition = this.requireWorkflowDefinition(existingTask.workflowKey);

    const result = closeTask({
      definition,
      task: existingTask,
    });

    if (result.task === null) {
      throw new BadRequestException(result.messages);
    }
    return this.tasksRepository.save(result.task);
  }

  /** Returns a known workflow definition or rejects an unsupported key. */
  private requireWorkflowDefinition(workflowKey: string) {
    const definition = findWorkflowDefinition(workflowKey);

    if (definition === undefined) {
      throw new BadRequestException(
        `Workflow ${workflowKey} is not supported.`,
      );
    }

    return definition;
  }

  /** Returns an existing demo user or rejects an unknown user identifier. */
  private async requireUser(userId: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (user === null) {
      throw new NotFoundException(`User ${userId} was not found.`);
    }

    return user;
  }

  /** Ensures that a known current user owns the task before it can change. */
  private async requireAssignedUser(
    task: TaskEntity,
    currentUserId?: string,
  ): Promise<void> {
    if (currentUserId === undefined || currentUserId.trim().length === 0) {
      throw new BadRequestException('The x-user-id header is required.');
    }

    await this.requireUser(currentUserId);

    if (task.assignedUserId !== currentUserId) {
      throw new ForbiddenException(
        'Only the assigned user can modify this task.',
      );
    }
  }
}
