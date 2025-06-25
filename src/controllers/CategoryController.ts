import { Handler } from "express";
import { CategoryRequestSchema, UpdatedCategoryRequestSchema } from "./schemas/CategoryRequestSchema";
import { HttpError } from "../errors/HttpError";
import { ICategoryRepository } from "../repositories/CategoryRepository";

export class CategoryController {

    constructor( readonly categoryRepository: ICategoryRepository ) {}

    index: Handler = async (req , res , next ) => {
        try {
            const categories = await this.categoryRepository.find();
            res.json(categories);
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req , res , next ) => {
        try {
            const body = CategoryRequestSchema.parse(req.body);
            const newCategory = await this.categoryRepository.create(body);
            res.status(201).json(newCategory);
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req , res , next ) => {
        try {
            const id = +req.params.id;
            const category = await this.categoryRepository.findById(id);

            if(!category) throw new HttpError(404, " Category not found! ");

            res.json(category)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req , res , next ) => {
        try {
            const id = +req.params.id;
            const body = UpdatedCategoryRequestSchema.parse(req.body);
            const updatedCategory = await this.categoryRepository.updateById(id, body);
            if(!updatedCategory) throw new HttpError(404, " Category not found! ");
            res.json(updatedCategory);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req , res , next ) => {
        try {
            const id = +req.params.id;
            const deletedCategory = await this.categoryRepository.deleteById(id);
            if(!deletedCategory) throw new HttpError(404, " Category not found! ");
            res.json({ deletedCategory: deletedCategory });
        } catch (error) {
            next(error)
        }
    }
}