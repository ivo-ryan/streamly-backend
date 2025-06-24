import { Category } from "@prisma/client";

export interface CreateCategoryParams {
    name: string
    position: number
}

export interface ICategoryRepository {
    find: () => Promise<Category[]>
    create: (params: CreateCategoryParams) => Promise<Category>
    findById: (id: number) => Promise<Category | null>
    updateById: (id: number, attributes: Partial<CreateCategoryParams>) => Promise<Category | null>
    deleteById: (id: number) => Promise<Category>
}