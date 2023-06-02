import {  ConflictException,  Injectable, NotAcceptableException, NotFoundException, Request, UnauthorizedException } from "@nestjs/common";
import { Product } from "./Entities/Product";
import { InjectRepository } from "@nestjs/typeorm";
import {  Like, Repository } from "typeorm";
import { ProductDto } from "./dto/Productdto";
import { UpdateDto } from "./dto/updateProductdto";
import { UserService } from "src/UserModule/user.service";
import { Order } from "./Entities/Order";
import { OrderDto } from "./dto/OrderDto";
import { User } from "src/UserModule/Entities/User";
import { ProductOrder } from "./Entities/ProductOrder";

@Injectable()
export class ProductService{
    
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Order)
        private orderRepository:Repository<Order>,
        @InjectRepository(ProductOrder)
        private productOrderRepository:Repository<ProductOrder>,
        private userService: UserService,
      ) {}
      async ConfirmOrder(username: string,orderDto:OrderDto ) {
        const user:User=await this.userService.getUser(username);
        console.log(orderDto)
        const orders:ProductOrder[]=[];
        for(let i=0;i<orderDto.orders.length;i++)
        {
          const {product,quantity}=orderDto.orders.at(i);
          const prod:Product=await this.getByName(product);
          if(!prod)
            throw new NotFoundException(`${product} was not found`);
          if(prod.quantity<quantity)
            throw new NotAcceptableException("Our stock is insufficient for meeting your order");
        }
        for(let i=0;i<orderDto.orders.length;i++)
        {
          const {product,quantity}=orderDto.orders.at(i);
          const prod:Product=await this.getByName(product);
          const order=this.productOrderRepository.create({product:prod,quantity:quantity});
          const finalorder=await this.productOrderRepository.save(order);
          orders.push(finalorder);
          this.productRepository.update({id_prod:prod.id_prod},{quantity:prod.quantity-quantity});
        }    
        const order1=this.orderRepository.create();
        order1.orders=orders;
        order1.user=user;
        return await this.orderRepository.save(order1);
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
            throw new NotFoundException("Not Found");
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
          return new ConflictException("couldn't create product.");
        }
      }
      async updateProduct(@Request() req:any,productname:string)
      {
        const newproduct:UpdateDto=req.body;
        const username=req.username;
        const role=req.role;
        const product:Product=await this.getProduct({name:productname});
        if((role!=='Admin'))
          return new UnauthorizedException("You don't own this product");
        else
          return await this.productRepository.update({name:productname},newproduct);
      }
      async deleteProduct(username:string,role:string,productname:string)
      {
        const product:Product=await this.getProduct({name:productname});
        if((role!=='Admin'))
          return new UnauthorizedException("You don't own this product");
        else
          return await this.productRepository.delete({name:productname});
      }
      async countFiltered(filters:UpdateDto)
      {
        const name=filters.name;
          try
          {
            if(name)
                return await this.productRepository.count({where:{...filters,name:Like("%"+name+"%")}});
            else
              return await this.productRepository.count({where:filters});
          }
          catch
          {
            throw new NotFoundException("Not Found");
          }
      }
}