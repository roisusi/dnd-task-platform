import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

/** Reads the users that can own and progress workflow tasks. */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  /** Returns all users in their stable identifier order. */
  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find({ order: { id: 'ASC' } });
  }
}
