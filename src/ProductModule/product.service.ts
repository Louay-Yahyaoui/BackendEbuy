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
      ) {}
      async ConfirmOrder(username: string,orderDto:OrderDto ) {
        
          const orders:ProductOrder[]=[];
        orderDto.orders.forEach(async (porder:ProductOrderDto)=>
        {
          const product:Product=await this.getByName(porder.product);
          if(!product)
            throw new HttpException(`you ordered ${porder.product} which doesn't exist`,HttpStatus.NOT_FOUND);
          else if(product.owner.username===username)
            throw new HttpException(`you can't buy your own product`,HttpStatus.NOT_ACCEPTABLE);
          else if(product.quantity<porder.quantity)
            throw new HttpException(`You ordered ${porder.quantity} ${product.name} whereas we only have ${product.quantity} in stock`,
            HttpStatus.NOT_ACCEPTABLE);

          
          orders.push(new ProductOrder(product,porder.quantity));
        })
        const order:Order=new Order();
        order.orders=orders;
        const user:User=await this.userService.getUser(username);
        order.user=user;
        const ordero=this.orderRepository.create(order);
        if(!user.history) 
          user.history=[ordero];
        else
          user.history.push(ordero);
        console.log(5);
        try{
          orderDto.orders.forEach(async (porder:ProductOrderDto)=>
        {
          const product:Product=await this.getByName(porder.product);
          this.productRepository.update(product.id_prod,{quantity:product.quantity-porder.quantity});
        })
          return await this.orderRepository.save(order);
        }
        catch{
          throw new HttpException("couldn't pass order",HttpStatus.CONFLICT);
        }
        
        
        
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