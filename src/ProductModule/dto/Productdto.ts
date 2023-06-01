import {  IsInt, IsUrl, MaxLength } from 'class-validator';
import ErrorMessages from '../../Error messages/errorMessages';
export class ProductDto
{
    name:string;
    price:number;
    category:string;
    @MaxLength(511,{message:ErrorMessages.MAX_LENGTH_ERROR})
    description:string
    @IsUrl({},{message:ErrorMessages.INVALID_URL})
    image?:string;
    brand:string;
    @IsInt({message:ErrorMessages.INT_ERROR})
    quantity:number;
}
   