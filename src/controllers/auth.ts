import { Router, Request, Response } from 'express';
import { NextFunction } from 'connect';
import * as jwt from 'jsonwebtoken';


export function generateJWT(key : string ): string {
    return jwt.sign(key, process.env.JWT_SECRET)
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    
    if (!req.headers || !req.headers.authorization){
        return res.status(401).send({ message: 'No authorization headers.' });
    }
    

    const token_bearer = req.headers.authorization.split(' ');
    if(token_bearer.length != 2){
        return res.status(401).send({ message: 'Malformed token.' });
    }
    
    const token : string = token_bearer[1];

    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
      }
      return next();
    });
}
