import { Handler } from "express";
import { prisma } from "../database";
import { CreateUserRequestSchema, UpdatedUserRequestSchema } from "./schemas/UserRequestSchema";
import { HttpError } from "../errors/HttpError";

export class UserController{
    index: Handler = async (req, res, next) => {
        try {
            const users = await prisma.user.findMany();
            res.json(users)

        } catch (error) {
            next(error)
        }
    }

    show: Handler = async ( req , res , next ) => {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({
                where: { id: +id }
            });

            if(!user) new HttpError(404, 'Lead não encontrado!');

            res.json(user);
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async ( req , res , next ) => {
        try {
            const body = CreateUserRequestSchema.parse(req.body);
            const newUser = await prisma.user.create({ data: body })
            res.status(201).json(newUser);
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async ( req , res , next ) => {
        try {
            const body = UpdatedUserRequestSchema.parse(req.body);
            const id = +req.params.id;
            const userExists = await prisma.user.findUnique({ where: { id } });
            if(!userExists) new HttpError(404, 'Lead não encontrado!');
            const updatedUser= await prisma.user.update({
                where: { id },
                data: body
            });

            res.json(updatedUser);

        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async ( req , res , next ) => {
        try {
            const id = +req.params.id;
            const userExists = await prisma.user.findUnique({ where: { id } });
            if(!userExists) new HttpError(404, 'Lead não encontrado!');
            const deletedUser = await prisma.user.delete({ where: { id } });

            res.json({ deletedUser: deletedUser });
            
        } catch (error) {
            next(error)
        }
    }
}