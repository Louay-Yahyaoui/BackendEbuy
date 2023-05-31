import { NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
export class AuthenticationMiddleware implements NestMiddleware{
    use(req:Request, res: any, next: () => void): any {
        if((req.originalUrl.startsWith("/products")&&(req.method==='GET')))
            next();
        else
        {
            try{
                const jwt=req.headers['jwt']as string;
                if(!jwt)
                    return res.status(401).json({ message: 'Unauthorized. Please log in to your account or sign up' });
                const decoded=verify(jwt,process.env.SALT);
                req['username']=decoded.username;
                req['role']=decoded.role;
                if((req.originalUrl.startsWith('/admin'))&&(req['role']!=='Admin'))
                    return res.status(403).json({message:'Forbidden. Only admins can access this page.'})
            }
            catch
            {
                return res.status(401).json({ message: 'Unauthorized.' });
            }
            next();
        }
}
}