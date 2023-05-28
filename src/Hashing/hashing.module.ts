import { Module } from "@nestjs/common";
import { HashService } from "./hashing.service";

@Module(
    {
        imports:[],
        providers:[HashService],
        exports:[HashService]
    }
)
export class HashModule{}