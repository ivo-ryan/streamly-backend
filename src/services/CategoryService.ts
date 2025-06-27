import { HttpError } from "../errors/HttpError";
import { CreateCategoryParams, ICategoryRepository } from "../repositories/CategoryRepository";


export class CategoryService{
    constructor( readonly categoryRepository: ICategoryRepository ){}

    async getAllCategories (){
        const categories = await this.categoryRepository.find();
        return categories
    }

    async createCategory (attributes: CreateCategoryParams) {
        const newCategory = await this.categoryRepository.create(attributes);
        return newCategory;
    }

    async getCategoryById (id: number){
        const category = await this.categoryRepository.findById(id);
        if(!category) throw new HttpError(404, "Category not found!")
        return category
    }

    async updateCategory (id: number, attributes: Partial<CreateCategoryParams>){
        const updateCategory = await this.categoryRepository.updateById(id, attributes);
        if(!updateCategory) throw new HttpError(404, "Category not found!")
        return updateCategory
    }

    async deleteCategory (id: number) {
        const deletedCategory = await this.categoryRepository.deleteById(id);
        if(!deletedCategory) throw new HttpError(404, "Category not found!")
        return { deletedCategory: deletedCategory }
    }
}