import { NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
export class AuthenticationMiddleware implements NestMiddleware{
use(req:Request, res: any, next: () => void): any {
    try{
        const jwt=req.headers['jwt']as string;
    if(!jwt)
        return res.status(401).json({ message: 'Unauthorized. Please log in to your account or sign up' });
        const decoded=verify(jwt,process.env.SALT);
        req['username']=decoded.username;
        req['role']=decoded.role;
    }
    catch
    {
        return res.status(401).json({ message: 'Unauthorized.' });
    }
    next();
}
}