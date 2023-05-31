import { Gender } from "../Entities/Gender";
import {  IsEmail, IsPhoneNumber, Length, MinLength } from 'class-validator';
import ErrorMessages from '../../Error messages/errorMessages';
export class UserDto
{
    @Length(3,30,{message:ErrorMessages.LENGTH_ERROR})
    username: string;
    @Length(3,25,{message:ErrorMessages.LENGTH_ERROR})
    name:string;
    @Length(3,25,{message:ErrorMessages.LENGTH_ERROR})
    lastname:string;
    @IsEmail({},{message:ErrorMessages.EMAIL_ERROR})
    email:string;
    @IsPhoneNumber("TN",{message:ErrorMessages.PHONE_ERROR})
    tel:string;
    @MinLength(6,{message:ErrorMessages.MIN_LENGTH_ERROR})
    password:string;
    address:string;
    gender:Gender;
}