import jwt from "jsonwebtoken"

const secret = 'chave-secreta'

export class jwtService {
    async signToken (userId: number, email: string) {
        const token = jwt.sign({id: userId, email}, secret, { expiresIn: '1d' });
        return token
    }
    
}