import {  Controller, Delete, Get, Param, Patch, Post, Request } from "@nestjs/common"
import { ProductService } from "./product.service";

@Controller('/products')
export class ProductController
{
    constructor(private productService:ProductService){}
    @Get('/all')
    getAll()
    {
        return this.productService.getProducts({});
    }
    @Get('/brands/:brand')
    getByBrand(@Param("brand") brand:string)
    {
        return this.productService.getProducts({brand:brand});
    }
    @Get('/categories/:category')
    getByCategory(@Param("category") category:string)
    {
        return this.productService.getProducts({category:category});
    }
    @Get('/:name')
    getByName(@Param("name") name:string)
    {
        return this.productService.getProduct({name:name});
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