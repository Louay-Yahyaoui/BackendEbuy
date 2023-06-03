import { Controller, Post, Param, Get, Body, Request, Res, Delete, Patch, UseFilters} from "@nestjs/common";
import { UserDto } from "./dto/UserDTO";
import { UserService } from "./user.service";
import { Response } from "express";
import { UpdateDto } from "./dto/UpdateDto";
import { loginDto } from "./dto/loginDto";
import { isNumberString } from "class-validator";
import { HttpExceptionFilter } from "src/FilterModule/http-exception.filter";
@Controller()
export class UserController {
    constructor(private userService: UserService) { }

    @Post('/signup')
    inscription(@Body() user: UserDto) {
        return this.userService.addUser(user);
    }
    @Post('/login')
    @UseFilters(new HttpExceptionFilter())
    login(@Body() body: loginDto, @Res() response: Response) {
        return this.userService.login(body.username, body.password, response);
    }
    @Get('/user/count')
    userCount()
    {
        return this.userService.countUser();
    }
    @Get('/users/all/:page?')
    getAllUsers(@Param('page') page: any) {
        if(!isNumberString(page))
            page = 1; 
        return this.userService.getAll(page);
    }
    @Post('/users/one')
    getUser(@Request() req: any, @Res() res:Response) {
        return this.userService.getUser(req,res);
        
    }
    @Patch('/users')
    updateUser(@Request() req: any, @Body() user: UpdateDto) {
        this.userService.updateUser(user, req);
    }
    @Delete('/users/one')
    deleteUser2(@Request() req: any) {
        this.userService.deleteUser2(req);
    }
    @Delete('/users/oneuser/:email')
    deleteUser(@Request() req: any,@Param("email")email:String) {
        this.userService.deleteUser(req,email);
    }
}