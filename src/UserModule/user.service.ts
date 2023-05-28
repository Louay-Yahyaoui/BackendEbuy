import { ConflictException, Injectable, NotFoundException, Res } from "@nestjs/common";
import { UserDto } from "./dto/UserDTO";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./Entities/User";
import { HashService } from "src/Hashing/hashing.service";
import {sign} from 'jsonwebtoken';
import * as cookie from 'cookie';
import { Response } from "express";
import { UpdateDto } from "./dto/UpdateDto";
@Injectable()
export class UserService
{
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private hashService:HashService,
      ) {}
    
    async getUser(username: string) {
        const user=await this.userRepository.findOneBy({username:username});
        if(!user)
            throw new NotFoundException(`${username} was not found.`);
        return user;
    }
    async getAll()
    {
        const users=await this.userRepository.find();
        return users;
    }
    async addUser(userdto: UserDto) {
        const rectifieduser=userdto;
        rectifieduser['role']='User';
        rectifieduser.password=this.hashService.hashString(userdto.password);
        const user=this.userRepository.create(rectifieduser);
        try {
            return await this.userRepository.save(user);
          }
          catch (e) {
            throw new ConflictException();
          }
    }
    async login(username:string,password:string,@Res() res:Response)
    {
      const user=await this.userRepository.findOneBy({username:username});
      if(!user)
        res.send('Wrong username');
      if(this.hashService.verifyStringWithSalt(password,user.password))
      {
        const userPayload = {  username: user.username,role:user.role };
        const token=sign(userPayload, process.env.SALT, { expiresIn: '24h' });
        const cookieOptions = {
          httpOnly: true,
          maxAge: 24*3600000,
          secure: true, 
          sameSite: 'none', 
        };
        const tokenCookie = cookie.serialize('token', token, cookieOptions);
        res.setHeader('jwt', tokenCookie);
        res.send('Login successful!');
      }
      else
        res.send('Wrong password'); 
    }
    async updateUser(newuser:UpdateDto,username:string)
    {
      const res=await this.userRepository.update({username:username},newuser);
      return res;
    }
    async deleteUser(username:string,password:string)
    {
      const res=await this.userRepository.softDelete({username:username,password:this.hashService.hashString(password)});
      return res;
    }
}