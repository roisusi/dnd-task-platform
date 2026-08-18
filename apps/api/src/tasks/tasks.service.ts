import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create as createTask, next as nextTask } from '@dnb/task-flow-core';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { NextTaskDto } from './dtos/next-task.dto';
import {
  procurementWorkflow,
  type ProcurementTaskData,
} from './procurement/procurement.workflow';
import { createMessages, nextMessages } from './task-flow.messages';
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

  /** Creates and persists a Procurement task at its initial status. */
  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    if (createTaskDto.workflowKey !== procurementWorkflow.key) {
      throw new BadRequestException(
        'Only the procurement workflow is supported.',
      );
    }

    const result = createTask<ProcurementTaskData>({
      taskId: randomUUID(),
      definition: procurementWorkflow,
      data: createTaskDto.data,
      initialAssignedUserId: createTaskDto.assignedUserId,
      messages: createMessages,
    });

    if (result.task === null) {
      throw new BadRequestException(result.messages);
    }

    const taskEntity = this.tasksRepository.create(result.task);
    return this.tasksRepository.save(taskEntity);
  }

  /** Advances an existing Procurement task by one workflow status. */
  async next(id: string, nextTaskDto: NextTaskDto): Promise<TaskEntity> {
    // 1. Load the existing task from the repository by id.
    const existingTask = await this.tasksRepository.findOneBy({ id });

    // 2. Throw NotFoundException when the task does not exist.
    if (existingTask === null) {
      throw new NotFoundException(`Task ${id} was not found.`);
    }
    // 3. Call the task-flow-core next operation with the existing task,
    //    Procurement definition, DTO data, next assignee and Next messages.
    const result = nextTask<ProcurementTaskData>({
      data: nextTaskDto.data,
      nextAssignedUserId: nextTaskDto.nextAssignedUserId,
      task: existingTask,
      messages: nextMessages,
      definition: procurementWorkflow,
    });
    // 4. Throw BadRequestException when the core operation returns no task.
    if (result.task === null) {
      throw new BadRequestException(result.messages);
    }
    // 5. Persist and return the task produced by the core operation.
    return this.tasksRepository.save(result.task);
  }
}
