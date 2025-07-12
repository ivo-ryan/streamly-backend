import jwt from "jsonwebtoken"

export class JwtService {
    secret : string
    constructor(secret: string) {
        this.secret = secret
    }

   signToken (userId: number, email: string) {
        const token = jwt.sign({id: userId, email: email}, this.secret, { expiresIn: '1d' });
        return token
    }
    
    verifyToken (token: string, callback: jwt.VerifyCallback){
        jwt.verify(token, this.secret, callback);
    }
}