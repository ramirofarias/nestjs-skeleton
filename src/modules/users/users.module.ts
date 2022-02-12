import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserCreatedEvent } from './events/user-created.event';
import { UserTasks } from './tasks/user.tasks';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, UserCreatedEvent, UserTasks],
})
export class UsersModule {}
