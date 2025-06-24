import { Handler } from "express";
import { CreateUserRequestSchema, GetUsersRequestSchema, UpdatedUserRequestSchema } from "./schemas/UserRequestSchema";
import { HttpError } from "../errors/HttpError";
import { IUserRepository, UserWhereParams } from "../repositories/UserRepository";

export class UserController{

    constructor( readonly userRepository: IUserRepository ){}

    index: Handler = async (req, res, next) => {
        try {
            const { page='1', pageSize='10', firstName, role, sortBy='firstName' , order='asc' } = GetUsersRequestSchema.parse(req.query);
            const limit = +pageSize;
            const offset = (+page -1) * limit;

            const where: UserWhereParams = {};
            if(firstName) where.firstName = { like: firstName, mode: "insensitive" };
            if(role) where.role = role;

            const users = await this.userRepository.find({ where, offset, limit, order, sortBy });

            const total = await this.userRepository.count(where);

            res.json({
                data: users,
                meta: {
                    page: offset,
                    pageSize: limit,
                    total,
                    totalPages: Math.ceil(total/limit)
                }
            })

        } catch (error) {
            next(error)
        }
    }

    show: Handler = async ( req , res , next ) => {
        try {
            const { id } = req.params;
            const user = await this.userRepository.findById(+id);

            if(!user) new HttpError(404, 'Lead não encontrado!');

            res.json(user);
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async ( req , res , next ) => {
        try {
            const body = CreateUserRequestSchema.parse(req.body);
            const newUser = await this.userRepository.create(body)
            res.status(201).json(newUser);
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async ( req , res , next ) => {
        try {
            const body = UpdatedUserRequestSchema.parse(req.body);
            const id = +req.params.id;
            const updatedUser= await this.userRepository.updateById(id, body);
            if(!updatedUser) new HttpError(404, 'Lead não encontrado!');

            res.json(updatedUser);

        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async ( req , res , next ) => {
        try {
            const id = +req.params.id;
            const deletedUser = await this.userRepository.deleteById(id);
            if(!deletedUser) new HttpError(404, 'Lead não encontrado!');

            res.json({ deletedUser: deletedUser });
            
        } catch (error) {
            next(error)
        }
    }
}