import {Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entities/User';
@Module(
{
    providers:[UserService],
    controllers:[UserController],
    imports:[TypeOrmModule.forRoot(
        {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [User],
        synchronize:false,//you need migrations
        })],
    exports:[]
}
)
export class UserModule{}