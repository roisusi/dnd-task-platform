import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Represents a demo user who can own workflow tasks.
 *
 * The assignment does not require user management or authentication, so the
 * entity stores only the stable identifier used by tasks and a display name.
 */
@Entity({ name: 'users' })
export class UserEntity {
  /** Stable identifier referenced by tasks.assigned_user_id. */
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id!: string;

  /** Human-readable user name displayed by the application. */
  @Column({ name: 'display_name', type: 'varchar', length: 100 })
  displayName!: string;
}
