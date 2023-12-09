import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  imports: [UsersModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
