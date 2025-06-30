import { Prisma, Series } from "@prisma/client";
import { AddFavoriteResult, AddFeaturedSeries, CreateSeriesParams, FindSeriesParams, FindWhereParams, ISeriesRepository } from "../SeriesRepository";
import { prisma } from "../../database";

export class SeriesPrismaRepository implements ISeriesRepository {
    find (params: FindSeriesParams) : Promise<Series[]>{

        let where: Prisma.SeriesWhereInput = {
            name: {
                    equals: params.where?.name?.equals ,
                    contains: params.where?.name?.like ,
                    mode: params.where?.name?.mode     
                }
        }

        return prisma.series.findMany({
            where,
            skip: params.offset,
            take: params.limit,
            orderBy: {[params.sortBy ?? "name"]: params.order}
        })
    }

    create (attributes: CreateSeriesParams) : Promise<Series>{
        return prisma.series.create({ data: attributes })
    }

    count (where: FindWhereParams) : Promise<number>{
        return prisma.series.count({ where: {
            name: {
                    equals: where?.name?.equals ,
                    contains: where?.name?.like ,
                    mode: where?.name?.mode     
                }
        } })
    }

    findById (id: number) : Promise<Series | null>{
        return prisma.series.findUnique({ 
            where: { id },
            include: { 
                episodes: { select: {
                    id: true,
                    name: true,
                    order: true,
                    secondsLong: true,
                    seriesId: true,
                    synopsis:true,
                    videoUrl: true,
                    watchTimes: { select: {  seconds: true } }
                } }
            } 
        })
    }

    updateById (id: number, attributes: Partial<CreateSeriesParams>) : Promise<Series | null>{
        return prisma.series.update({ where: { id }, data: attributes })
    }

    deleteById (id: number) : Promise<Series | null>{
        return prisma.series.delete({ where: { id } })
    }

   addFeaturedSeries (seriesId: number, userId: number) : Promise<AddFavoriteResult> {
    prisma.favorite.create( { 
        data: { 
            seriesId,
            userId
         }
     } )

     return { success: true }
   } 
    
}