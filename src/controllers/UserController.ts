import { Handler } from "express";
import { CreateUserRequestSchema, GetUsersRequestSchema, UpdatedUserRequestSchema } from "./schemas/UserRequestSchema";
import { UserService } from "../services/UserService";

export class UserController{

    constructor( private readonly userService: UserService){}

    index: Handler = async (req, res, next) => {
        try {
            const { page='1', pageSize='10', firstName, role, sortBy='firstName' , order='asc' } = GetUsersRequestSchema.parse(req.query);
            
            const users = await this.userService.getAllUsersPaginated({ 
                firstName,
                order,
                page: +page ,
                pageSize: +pageSize,
                role,
                sortBy 
                })

            res.json(users)

        } catch (error) {
            next(error)
        }
    }

    login: Handler = async ( req , res , next ) => {
        try {
            const { email, password } = req.body;
            const token = await this.userService.checkPassword(password, email);
            res.json({ authentication: true, token })
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async ( req , res , next ) => {
        try {
            const { email } = req.body;
            const user = await this.userService.userFindByEmail(email);
            res.json(user);
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async ( req , res , next ) => {
        try {
            const body = CreateUserRequestSchema.parse(req.body);
            const newUser = await this.userService.createUser(body);
            res.status(201).json(newUser);
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async ( req , res , next ) => {
        try {
            const body = UpdatedUserRequestSchema.parse(req.body);
            const id = +req.params.id;
            const updatedUser = await this.userService.userUpdate(id, body)
            res.json(updatedUser);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async ( req , res , next ) => {
        try {
            const id = +req.params.id;
            const deletedUser = await this.userService.userDelete(id)
            res.json(deletedUser);            
        } catch (error) {
            next(error)
        }
    }
}