import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/HttpError";
import { jwt, userService } from "../container";
import { JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";

interface AuthenticatedRequest extends Request {
    user?: User | null
}

export const ensureAuth = (req: AuthenticatedRequest , res: Response , next: NextFunction ) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) throw new HttpError(401, 'Não autorizado , nenhum token foi encontrado!');

    const token = authHeader.replace(/Bearer /, '')

    jwt.verifyToken(token, async (err, decoded) => {
        if(err || typeof decoded === 'undefined') throw new HttpError(401, 'Não autorizado: token inválido!');

        const user = await userService.userFindByEmail((decoded as JwtPayload ).email )
        req.user = user
        next()
        
    })
}

export const ensureAuthViaQuery = (req: AuthenticatedRequest , res: Response , next: NextFunction) => {
    const { token } = req.query;

    if(!token) throw new HttpError(404, 'Token não encontrado!');
    if(typeof token !== 'string') throw new HttpError(400, 'O parâmetro token deve ser do tipo string!');

     jwt.verifyToken(token, async (err, decoded) => {
        if(err || typeof decoded === 'undefined') throw new HttpError(401, 'Não autorizado: token inválido!');

        const user = await userService.userFindByEmail((decoded as JwtPayload ).email )
        req.user = user
        next()
       
    })

} 