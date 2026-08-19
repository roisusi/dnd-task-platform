import { Controller, Get } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

/** Exposes the users available for task assignment. */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Returns every user stored in the users table. */
  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }
}
