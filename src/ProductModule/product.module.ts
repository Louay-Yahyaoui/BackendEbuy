import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { HashModule } from "src/Hashing/hashing.module";
import { Product } from "./Entities/Product";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module(
    {
        imports:[HashModule,TypeOrmModule.forFeature(
            [Product]
          )],
        providers:[ProductService],
        controllers:[ProductController],
        exports:[ProductService]
    }
)
export class ProductModule
{
    
}