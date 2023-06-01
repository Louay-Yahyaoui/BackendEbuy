import { IsInt } from "class-validator";
import ErrorMessages from '../../Error messages/errorMessages';
export class ProductOrderDto
{
    product:string;
    @IsInt({message:ErrorMessages.INT_ERROR})
    quantity:number;
}