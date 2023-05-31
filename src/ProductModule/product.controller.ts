import {  Controller,Delete, Get,  Param,  ParseIntPipe,  Patch, Post, Query, Request} from "@nestjs/common"
import { ProductService } from "./product.service";
import { UpdateDto } from "./dto/updateProductdto";
import { IsInt, isNumber } from "class-validator";
import { UserService } from "src/UserModule/user.service";
import { User } from "src/UserModule/Entities/User";
import { ProductOrder } from "./Entities/ProductOrder";
@Controller('/products')
export class ProductController
{
    constructor(private productService:ProductService,){}
    @Get(":page?")
    getByFilters(@Query() q:UpdateDto,@Param("page")page)
    {
        if(!isNumber(page))
            page = 1;   
        return this.productService.getProducts(q,page);
    }
    @Get(":name")
    getProduct(@Param("name") name:string)
    {
        this.productService.getByName(name);
    }
    @Post(":name")
    async addToCart(@Request() req:any,@Query("qty",ParseIntPipe) quantity:number,@Param("name") name:string)
    {
        this.productService.addToCart(req.username,name,quantity);
    }
    @Post("/add")
    addProduct(@Request() req:any)
    {
        return this.productService.addProduct(req);
    }
    @Patch("/:name")
    updateProduct(@Request() req:any,@Param("name") name:string)
    {   
        return this.productService.updateProduct(req,name);
    }
    @Delete("/:name")
    deleteProduct(@Request() req:any,@Param("name")name:string)
    {
        return this.productService.deleteProduct(req.username,req.role,name);
    }
}