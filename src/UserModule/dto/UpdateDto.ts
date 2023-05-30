import { PartialType } from "@nestjs/mapped-types";
import { UserDto } from "./UserDTO";

export class UpdateDto extends PartialType(UserDto)
{
    username?:string;
    name?:string;
    lastname?:string;
    email?:string;
    tel?:string;
    password?:string;
    adress?:string;
}