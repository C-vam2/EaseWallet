import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
// @ts-ignore
export async function authMiddleware(req,res,next){
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(403).json({});
        }

        const token = authHeader.split(' ')[1];
        
        const decoded =jwt.verify(token,JWT_SECRET);
        req.userId = (decoded as unknown as JwtPayload).id;
        next();
    } catch (error) {
        res.status(403).json({
            message:"some error occured during authentication"
        })
    }
}