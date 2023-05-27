import { ConflictException, Injectable } from "@nestjs/common";
import { UserDto } from "./dto/UserDTO";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./Entities/User";
@Injectable()
export class UserService
{
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}
    async getUser(username: string): Promise<UserDto> {
        const user=await this.userRepository.findOneBy({username:username});
        return user;
    }
    async getAll():Promise<UserDto[]>
    {
        const users=await this.userRepository.find();
        return users;
    }
    async addUser(userdto: UserDto) {
        const user=this.userRepository.create(userdto);
        try {
            return await this.userRepository.save(user);
          }
          catch (e) {
            throw new ConflictException();
          }
        return user;
    }

}