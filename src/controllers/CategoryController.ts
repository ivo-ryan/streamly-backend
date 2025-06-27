import { Handler } from "express";
import { CategoryRequestSchema, UpdatedCategoryRequestSchema } from "./schemas/CategoryRequestSchema";
import { CategoryService } from "../services/CategoryService";

export class CategoryController {

    constructor( readonly categoryService: CategoryService ) {}

    index: Handler = async (req , res , next ) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req , res , next ) => {
        try {
            const body = CategoryRequestSchema.parse(req.body);
            const newCategory = await this.categoryService.createCategory(body);
            res.status(201).json(newCategory);
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req , res , next ) => {
        try {
            const id = +req.params.id;
            const category = await this.categoryService.getCategoryById(id);

            res.json(category)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req , res , next ) => {
        try {
            const id = +req.params.id;
            const body = UpdatedCategoryRequestSchema.parse(req.body);
            const updatedCategory = await this.categoryService.updateCategory(id, body);
            res.json(updatedCategory);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req , res , next ) => {
        try {
            const id = +req.params.id;
            const deletedCategory = await this.categoryService.deleteCategory(id);
            res.json({ deletedCategory: deletedCategory });
        } catch (error) {
            next(error)
        }
    }
}