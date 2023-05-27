import { Controller, Post ,Param, Get, NotFoundException, Body} from "@nestjs/common";
import { UserDto } from "./dto/UserDTO";
import { UserService } from "./user.service";
import { User } from "./Entities/User";

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
    @Post('login')
    login(){}

    @Get('/all')
    GetAllUsers()
    {
        return this.userService.getAll();
    }

    @Get(':username')
    GetUser(@Param('username') username:string)
    {
        return this.userService.getUser(username);
    }
}