import { Controller, Post ,Param, Get, Body,Request, Res, Delete, Patch} from "@nestjs/common";
import { UserDto } from "./dto/UserDTO";
import { UserService } from "./user.service";
import { Response } from "express";
import { UpdateDto } from "./dto/UpdateDto";

@Controller()
export class UserController
{
    constructor(private userService: UserService){}

    @Post('/signup')
    inscription(@Body() user:UserDto)
    {
        this.userService.addUser(user);
        return user.username;
    }
    @Post('/login')
    login(@Param('username') username:string,@Param('password') password:string,@Res() response: Response)
    {
        this.userService.login(username,password,response);
    }

    @Get('/users/all')
    getAllUsers()
    {
        return this.userService.getAll();
    }

    @Get('/users/:username')
    getUser(@Param('username') username:string)
    {
        return this.userService.getUser(username);
    }
    @Patch('/users/:username')
    updateUser(@Request() req:any,@Body() user:UpdateDto)
    {
        this.userService.updateUser(user,req.username);
    }
    @Delete('/users/:username')
    deleteUser(@Request() req:any)
    {
        this.userService.deleteUser(req.username,req.password);
    }
}