import { IsNotEmpty, IsObject, IsString } from 'class-validator';

/** Describes the client-controlled data accepted by POST /tasks/:id/next. */
export class NextTaskDto {
  /** Identifies the user who will own the task after the status change. */
  @IsString()
  @IsNotEmpty()
  nextAssignedUserId!: string;

  /** Contains the complete workflow data required at the destination status. */
  @IsObject()
  data!: Record<string, unknown>;
}
