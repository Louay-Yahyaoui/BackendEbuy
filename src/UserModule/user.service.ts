import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, Res } from "@nestjs/common";
import { UserDto } from "./dto/UserDTO";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./Entities/User";
import { HashService } from "src/Hashing/hashing.service";
import {sign} from 'jsonwebtoken';
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
        userdto.password=this.hashService.hashString(userdto.password);
        const user=this.userRepository.create(userdto);
        try {
            return await this.userRepository.save(user);
          }
          catch (e) {
            console.log(e);
            return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
          }
    }
    async login(username:string,password:string,@Res() res:Response)
    {
      const result= await this.userRepository
      .createQueryBuilder('user')
      .select('user.password,user.role') 
      .where('user.username=:username',{username:username})
      .getRawOne();
      if(!result)
        res.send('Wrong username');
      console.log(result)
      if(this.hashService.verifyStringWithSalt(password,result.password))
      {
        const userPayload = {  username: username,role:result.role };
        const token=sign(userPayload, process.env.SALT, { expiresIn: '24h' });
        res.cookie('jwt', token,{maxAge:30*24*3600*1000});
        res.send('Login successful!');
      }
      else
      {
        throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
      } 
        
    }
    async updateUser(newuser:UpdateDto,username:string)
    {
      console.log(newuser);
      const res=await this.userRepository.update({username:username},newuser);
      console.log(res);
      return res;
    }
    async deleteUser(username:string,password:string)
    {
      const res=await this.userRepository.softDelete({username:username,password:this.hashService.hashString(password)});
      return res;
    }
}