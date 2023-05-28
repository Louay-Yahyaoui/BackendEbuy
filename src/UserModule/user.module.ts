import {Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashModule } from 'src/Hashing/hashing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entities/User';
@Module(
{
    providers:[UserService],
    controllers:[UserController],
    imports:[TypeOrmModule.forFeature(
        [User]
      ),HashModule],
    exports:[UserService]
}
)
export class UserModule{}