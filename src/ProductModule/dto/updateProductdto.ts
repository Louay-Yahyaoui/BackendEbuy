import { PartialType } from "@nestjs/mapped-types";
import { ProductDto } from "./Productdto";

export class UpdateDto extends PartialType(ProductDto)
{}