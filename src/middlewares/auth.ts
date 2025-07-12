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

    jwt.verifyToken(token, (err, decoded) => {
        console.log(decoded)
        if(err || typeof decoded === 'undefined') throw new HttpError(401, 'Não autorizado: token inválido!');

        userService.userFindByEmail((decoded as JwtPayload ).email ).then(user => {
            req.user = user
            next()
        })
    })
}