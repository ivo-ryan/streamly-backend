import { Handler } from "express";
import { prisma } from "../database";
import { CategoryRequestSchema, UpdatedCategoryRequestSchema } from "./schemas/CategoryRequestSchema";
import { HttpError } from "../errors/HttpError";

export class CategoryController {

    index: Handler = async (req , res , next ) => {
        try {
            const categories = await prisma.category.findMany()
            res.json(categories);
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req , res , next ) => {
        try {
            const body = CategoryRequestSchema.parse(req.body);
            const newCategory = await prisma.category.create({ data: body });
            res.status(201).json(newCategory);
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req , res , next ) => {
        try {
            const id = +req.params.id;
            const category = await prisma.category.findUnique({ 
                where: { id } ,
                include: {
                    series: true
                }
            });

            if(!category) throw new HttpError(404, " Category not found! ");

            res.json(category)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req , res , next ) => {
        try {
            const id = +req.params.id;
            const categoryExists = await prisma.category.findUnique({ where: { id } });
            if(!categoryExists) throw new HttpError(404, " Category not found! ");
            const body = UpdatedCategoryRequestSchema.parse(req.body);
            const updatedCategory = await prisma.category.update({ where: { id }, data: body });
            res.json(updatedCategory);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req , res , next ) => {
        try {
            const id = +req.params.id;
            const categoryExists = await prisma.category.findUnique({ where: { id } });
            if(!categoryExists) throw new HttpError(404, " Category not found! ");
            const deletedCategory = await prisma.category.delete({ where: { id } });
            res.json({ deletedCategory: deletedCategory });
        } catch (error) {
            next(error)
        }
    }
}