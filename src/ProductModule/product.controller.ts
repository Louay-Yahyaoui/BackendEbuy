import {  Controller,Delete, Get,  Param,  Patch, Post, Query, Request} from "@nestjs/common"
import { ProductService } from "./product.service";
import { UpdateDto } from "./dto/updateProductdto";
import { isNumberString } from "class-validator";
@Controller('/products')
export class ProductController
{
    constructor(private productService:ProductService,){}
    @Get("/count")
    CountResults(@Query() q:UpdateDto)
    {
        return this.productService.countFiltered(q);
    }
    @Get("/namee/:name")
    getProduct(@Param("name") name:string)
    {
        return this.productService.getByName(name);
    }
    @Get("/id/:id")
    getProductbyId(@Param("id") id:number)
    {
        return this.productService.getById(id);
    }
    @Get("/history/:id")
    getHistorybyId(@Param("id") id:number)
    {
        return this.productService.getOneHistory(id);
    }
    @Get(":page?")
    getByFilters(@Query() q:UpdateDto,@Param("page")page)
    {
        if(!isNumberString(page))
            page = 1;   
        return this.productService.getProducts(q,page);
    }
   
    @Post('/history')
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