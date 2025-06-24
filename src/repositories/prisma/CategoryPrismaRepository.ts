import { Category } from "@prisma/client";
import { CreateCategoryParams, ICategoryRepository } from "../CategoryRepository";
import { prisma } from "../../database";

export class CategoryPrismaRepository implements ICategoryRepository {
    find () : Promise<Category[]>{
        return prisma.category.findMany();
    }

    create (params: CreateCategoryParams) : Promise<Category>{
        return prisma.category.create({ data: params })
    }

    findById (id: number) : Promise<Category | null>{
        return prisma.category.findUnique({ where: { id } , include: { series: true }});
    }

    updateById (id: number, attributes: Partial<CreateCategoryParams>) : Promise<Category | null> {
        return  prisma.category.update({ where: { id }, data: attributes })
    }

    deleteById (id: number) : Promise<Category>{
        return prisma.category.delete({ where: { id } })
    } 
}