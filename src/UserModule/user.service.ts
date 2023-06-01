import {  ConflictException,  Injectable, NotFoundException, Res, UnauthorizedException } from "@nestjs/common";
import { UserDto } from "./dto/UserDTO";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
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
        const user=await this.userRepository.findOneBy({username:Like(username)});
        if(!user)
            throw new NotFoundException(`${username} was not found.`);
        return user;
    }
    async getAll(page:any)
    {
      const users=await this.userRepository.find({take:9,skip:9*(page-1)});
      return users;
    }
    async addUser(userdto: UserDto) {
        userdto.password=this.hashService.hashString(userdto.password);
        
        try {
          const user=this.userRepository.create(userdto);
          await this.userRepository.save(user);
            return {username:user.username};
          }
          catch (e) {
            return new ConflictException("couldn't create user.");
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
        throw new UnauthorizedException('Wrong username');
      if(this.hashService.verifyStringWithSalt(password,result.password))
      {
        const userPayload = {  username: username,role:result.role };
        const token=sign(userPayload, process.env.SALT, { expiresIn: '30d' });
        res.cookie('jwt', token,{maxAge:30*24*3600*1000});
        res.send('Login successful!');
      }
      else
      {
        throw new UnauthorizedException('Wrong password');
      } 
        
    }
    async updateUser(newuser:UpdateDto,req:any)
    {
      const res=await this.userRepository.update({username:req.username},newuser);
      return res;
    }
    async deleteUser(req:any)
    {
      const username=req.username;
      const password=req.body.password;
      return await this.userRepository.delete({username:username,password:this.hashService.hashString(password)});
    }
}