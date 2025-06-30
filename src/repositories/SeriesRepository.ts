import { Series } from "@prisma/client";

export interface CreateSeriesParams {
    name: string;
    synopsis: string;
    thumbnailUrl: string;
    featured: boolean;
    categoryId: number;
}

export interface FindWhereParams{
    name?: {
        equals?: string
        like?: string
        mode: "default" | "insensitive"
    }
}

export interface FindSeriesParams {
    where?: FindWhereParams 
    limit?: number
    offset?: number
    sortBy?: "name" | "createdAt"
    order?: "asc" | "desc"
}

export type AddFavoriteResult = {
  success: boolean
  message?: string
}

export interface ISeriesRepository {
    find: (params: FindSeriesParams) => Promise<Series[]>
    create: (attributes: CreateSeriesParams) => Promise<Series>
    count: (where: FindWhereParams) => Promise <number>
    findById: (id : number) => Promise<Series | null>
    updateById: (id: number, attributes: Partial<CreateSeriesParams>) => Promise<Series | null>
    deleteById: (id: number) => Promise<Series | null>
    addFeaturedSeries: ( seriesId: number, userId: number ) => Promise<AddFavoriteResult>
    deleteFeaturedSeries: (seriesId: number , userId: number) => Promise<boolean>
}