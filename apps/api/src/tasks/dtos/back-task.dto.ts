import { IsNotEmpty, IsString } from 'class-validator';

/** Describes the client input accepted by POST /tasks/:id/back. */
export class BackTaskDto {
  /** Identifies the user who will own the task after it moves backward. */
  @IsString()
  @IsNotEmpty()
  previousAssignedUserId!: string;
}
