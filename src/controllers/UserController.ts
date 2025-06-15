import { Handler } from "express";
import { prisma } from "../database";
import { CreateUserRequestSchema } from "./schemas/UserRequestSchema";

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
            
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async ( req , res , next ) => {
        try {
            
        } catch (error) {
            next(error)
        }
    }
}