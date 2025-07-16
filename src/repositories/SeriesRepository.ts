import { Favorite, Like } from "@prisma/client";

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

export type FavoriteResult = {
  success: boolean
  message?: string
}

export type Series = {
    id: number;
    name: string;
    synopsis: string;
    thumbnailUrl: string;
}

export interface ReturnFavoriteAll {
    userId: number,
    series: Series[]
}

export interface ISeriesRepository {
    find: (params: FindSeriesParams) => Promise<Series[]>
    create: (attributes: CreateSeriesParams) => Promise<Series>
    count: (where: FindWhereParams) => Promise <number>
    findById: (id : number) => Promise<Series | null>
    updateById: (id: number, attributes: Partial<CreateSeriesParams>) => Promise<Series | null>
    deleteById: (id: number) => Promise<Series | null>
    addFeaturedSeries: ( seriesId: number, userId: number ) => Promise<FavoriteResult>
    getAllFavoriteSeries: ( userId: number ) => Promise<ReturnFavoriteAll>
    getRandonFeaturedSeries: () => Promise<Series[]>
    getTopTenNewest: () => Promise<Series[]>
    deleteFeaturedSeries: (seriesId: number , userId: number) => Promise<FavoriteResult>
    seriesFeaturedById: (seriesId: number, userId: number) => Promise< Favorite | null>
    likesCreate: (userId: number, seriesId: number) => Promise<Like>
    deleteLike: (userId: number, seriesId: number) => Promise<Like | null>
    alreadyLike: (userId: number , seriesId:number ) => Promise<Like | null>
}