import {  Controller,Delete, Get,  Param,  Patch, Post, Query, Request} from "@nestjs/common"
import { ProductService } from "./product.service";
import { UpdateDto } from "./dto/updateProductdto";
import { isNumber } from "class-validator";
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
    @Get('/history')
    OrderHistory(@Request() req:any)
    {
        return this.productService.getHistory(req.username);
    }
    @Post("/order")
    ConfirmOrder(@Request() req:any)
    {
        return this.productService.ConfirmOrder(req.username,req.body);
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