import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";

@Injectable()
export class HashService{
    hashString(input: string): string {
        const salt=process.env.SALT;
        const hash = createHash('sha256');
        hash.update(salt + input);
        const hashedString = hash.digest('hex');
        return `${salt}:${hashedString}`;
    }
    verifyStringWithSalt(input: string, saltedHash: string): boolean {
        const [salt, storedHash] = saltedHash.split(':');
        const hash = createHash('sha256');
        hash.update(salt + input);
        const generatedHash = hash.digest('hex');
        return generatedHash === storedHash;
    }

}