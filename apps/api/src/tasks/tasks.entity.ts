import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LifecycleState, type LifecycleStateType } from '@dnb/task-flow-core';

/**
 * Persistent representation of a generic workflow task.
 *
 * Concrete workflow data is stored as JSONB so adding another workflow type
 * does not require another task table or a structural database rewrite.
 */
@Entity({ name: 'tasks' })
@Index('idx_tasks_assigned_user_id', ['assignedUserId'])
export class TaskEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'workflow_key', type: 'varchar', length: 100 })
  workflowKey!: string;

  @Column({ type: 'integer' })
  status!: number;

  @Column({
    name: 'lifecycle_state',
    type: 'enum',
    enum: LifecycleState,
  })
  lifecycleState!: LifecycleStateType;

  @Column({ name: 'assigned_user_id', type: 'varchar', length: 100 })
  assignedUserId!: string;

  @Column({ type: 'jsonb' })
  data!: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
