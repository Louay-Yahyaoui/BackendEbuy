import {  IsInt, IsUrl, MaxLength, MinLength } from 'class-validator';
import ErrorMessages from '../../Error messages/errorMessages';
export class ProductDto
{   @MinLength(3,{message:ErrorMessages.MIN_LENGTH_ERROR})
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
   