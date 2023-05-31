import { Module} from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { HashModule } from "src/Hashing/hashing.module";
import { Product } from "./Entities/Product";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/UserModule/User.module";
import { ProductOrder } from "./Entities/ProductOrder";
import { Cart } from "./Entities/Cart";

@Module(
    {
        imports:[HashModule,TypeOrmModule.forFeature(
            [Product,Order,ProductOrder,Cart]
          ),UserModule],
        providers:[ProductService],
        controllers:[ProductController],
        exports:[ProductService]
    }
)
export class ProductModule
{}