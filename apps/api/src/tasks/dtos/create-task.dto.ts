import { IsNotEmpty, IsObject, IsString } from 'class-validator';

/**
 * Describes the client-controlled data accepted by POST /tasks.
 *
 * Server-controlled fields such as id, status and lifecycleState are omitted
 * because they are created by the API and the task-flow engine.
 */
export class CreateTaskDto {
  /** Identifies the workflow definition that should create the task. */
  @IsString()
  @IsNotEmpty()
  workflowKey!: string;

  /** Identifies the user initially responsible for the task. */
  @IsString()
  @IsNotEmpty()
  assignedUserId!: string;

  /** Contains the workflow-specific task information supplied by the client. */
  @IsObject()
  data!: Record<string, unknown>;
}
