import { Gender } from "../Entities/Gender";

export class UserDto
{
    username: string;
    name:string;
    lastname:string;
    email:string;
    tel:Long;
    password:string;
    adress:string;
    gender:Gender;
}