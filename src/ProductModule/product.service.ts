import {  HttpException, HttpStatus, Injectable, Request } from "@nestjs/common";
import { Product } from "./Entities/Product";
import { InjectRepository } from "@nestjs/typeorm";
import {  Like, Repository } from "typeorm";
import { ProductDto } from "./dto/Productdto";
import { UpdateDto } from "./dto/updateProductdto";
import { UserService } from "src/UserModule/user.service";
import { Order } from "./Entities/Order";
import { OrderDto } from "./dto/OrderDto";
import { User } from "src/UserModule/Entities/User";
import { ProductOrderDto } from "./dto/ProductOrderDto";
import { ProductOrder } from "./Entities/ProductOrder";

@Injectable()
export class ProductService{
    
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private userService: UserService,
        @InjectRepository(Order)
        private orderRepository:Repository<Order>,
        @InjectRepository(ProductOrder)
        private productOrderRepository:Repository<ProductOrder>
      ) {}
      async ConfirmOrder(username: string,orderDto:OrderDto ) {
        const user:User=await this.userService.getUser(username);
        const orders:ProductOrder[]=[];
        orderDto.orders.forEach(async(prodOrder:ProductOrderDto)=>
        {
          const product=await this.getProduct({name:prodOrder.product});
          if(!product)
            throw new HttpException(`${prodOrder.product} was not found.`,HttpStatus.NOT_FOUND);
          else if(prodOrder.quantity>product.quantity)
            throw new HttpException(`We only have ${product.quantity} ${prodOrder.product}s in stock.`,HttpStatus.NOT_ACCEPTABLE);
          orders.push(new ProductOrder(product,prodOrder.quantity));
        })
        const order:Order=this.orderRepository.create();
        const submittedorders:ProductOrder[]=await this.productOrderRepository.save(orders);
        orders.forEach((prod:ProductOrder)=>
        {
          this.productRepository.update({id_prod:prod.product.id_prod},{quantity:prod.product.quantity-prod.quantity});
        }
        
        )
        order.orders=submittedorders;
        order.user=user;
        return await this.orderRepository.save(order);
        
        //todo:rewrite this whole motherfucker
      }
      async getHistory(username: string) {
        return await this.orderRepository.find({where:{user:{username:username}}});
      }
        async getProducts(filters:UpdateDto,page)
        {
          const name=filters.name;
          try
          {
            if(name)
                return await this.productRepository.find({where:{...filters,name:Like("%"+name+"%")},take:9,order:{name:"ASC"},skip:9*(page-1)});
            else
                return await this.productRepository.find({where:filters,take:9,order:{name:"ASC"},skip:9*(page-1)});
          }
          catch
          {
            throw new HttpException("Not Found",404);
          }
          
        }
      async getByName(name:string)
      {
        return await this.productRepository.findOneBy({name:name});
      }
      async getProduct(filters:UpdateDto)
      {
        return await this.productRepository.findOne({where:filters});
      }
      async addProduct(req:any)
      {
        const productdto:ProductDto=req.body;
        const user=await this.userService.getUser(req.username);
        const product=this.productRepository.create({...productdto,owner:user});
        try
        {
          return await this.productRepository.save(product);
        }
        catch
        {
          return new HttpException("couldn't create product.",HttpStatus.CONFLICT);
        }
      }
      async updateProduct(@Request() req:any,productname:string)
      {
        const newproduct:UpdateDto=req.body;
        const username=req.username;
        const role=req.role;
        const product:Product=await this.getProduct({name:productname});
        if((product.owner.name!==username)&&(role!=='Admin'))
          return new HttpException("You don't own this product",401)
        else
          return await this.productRepository.update({name:productname},newproduct);
      }
      async deleteProduct(username:string,role:string,productname:string)
      {
        const product:Product=await this.getProduct({name:productname});
        if((product.owner.username!==username)&&(role!=='Admin'))
          return new HttpException("You don't own this product",401)
        else
          return await this.productRepository.delete({name:productname});
      }
}