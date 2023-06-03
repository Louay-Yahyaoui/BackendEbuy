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
      async getUser2(username) {
        const user=await this.userRepository.findOneBy({username:username});
        if(!user)
            throw new NotFoundException(`${username} was not found.`);
        return user;
    }
    async getUser(req: any,@Res() res:Response) {
        const user=await this.userRepository.findOneBy({username:req.username});
        if(!user)
            throw new NotFoundException(`${req.username} was not found.`);
        res.send(user);
    }
    async getAll(page:any)
    {
      const users=await this.userRepository.find({take:9,order:{name:"ASC"},skip:9*(page-1)});
      return users;
    }
    async addUser(userdto: UserDto) {

        userdto.password=this.hashService.hashString(userdto.password);
        
        try {
          const user=this.userRepository.create(userdto);
          await this.userRepository.save(user);
            console.log(user);
          }
          catch (e) {
            throw new ConflictException("couldn't create user.");
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
        throw new UnauthorizedException('Wrong credentials!');
      if(this.hashService.verifyStringWithSalt(password,result.password))
      {
        const userPayload = {  username: username,role:result.role };
        const role=result.role;
        const token=sign(userPayload, process.env.SALT, { expiresIn: '30d', });
        res.cookie('jwt', token,{maxAge:30*24*3600*1000,httpOnly: true });
        res.send({token,role});
      }
      else
      {
        throw new UnauthorizedException('Wrong credentials!');
      } 
        
    }
    async countUser()
    {
      const res= await this.userRepository.count();
      return res;
    }
    async updateUser(newuser:UpdateDto,req:any)
    { if(newuser.password)
         newuser.password=this.hashService.hashString(newuser.password);
         try
         {
          return await this.userRepository.update({username:req.username},newuser);
    }
    catch{
      throw new UnauthorizedException("Couldn't update ")
    }
    }
    async deleteUser2(req:any)
    { 
      const username=req.username;
      try
        { 
          return this.userRepository.delete({username:username});
        }
        catch
        {
          throw new UnauthorizedException("UserNotFound");
        }
    }
    async deleteUser(req:any,email)
    { 
      const role=req.role;
      console.log(role)
      if(role!=='Admin')
      {
        return new UnauthorizedException("You are not admin");
      }
      return await this.userRepository.delete({email:email});
        }
}