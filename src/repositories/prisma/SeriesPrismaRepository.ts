import { Favorite, Like, Prisma, Series } from "@prisma/client";
import { FavoriteResult, CreateSeriesParams, FindSeriesParams, FindWhereParams, ISeriesRepository, ReturnFavoriteAll } from "../SeriesRepository";
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
                                name: true,
                                order: true,
                                secondsLong: true,
                                synopsis:true,
                                videoUrl: true,
                                watchTimes: { select: {  seconds: true } }
                            }        
                        },
                        likes: true
                } 
        })
    }
    
    getTopTenNewest (): Promise<Series[]>{
        return prisma.series.findMany({ take: 10, orderBy: { createdAt: "desc" } })
    }

    updateById (id: number, attributes: Partial<CreateSeriesParams>) : Promise<Series | null>{
        return prisma.series.update({ where: { id }, data: attributes })
    }

    deleteById (id: number) : Promise<Series | null>{
        return prisma.series.delete({ where: { id } })
    }
    

   async addFeaturedSeries (seriesId: number, userId: number) : Promise<FavoriteResult> {
       await prisma.favorite.create( { 
            data: { 
                seriesId,
                userId
            }
        } );

        return { success: true }
   } 

    async getAllFavoriteSeries ( userId: number): Promise<ReturnFavoriteAll>{
        const favorites = await prisma.favorite.findMany({ 
            where: { userId }, 
            include: { serie: { select: { id:true, name: true, synopsis: true, thumbnailUrl: true } } } 
        });

        const user = favorites.map(user => user.userId);
        const series = favorites.map( i => i.serie )

        return {
            userId: user[0],
            series
        }
    }

    getRandonFeaturedSeries (): Promise<Series[]>{
        return prisma.series.findMany({ 
            where: { featured: true }
        })
    }

    seriesFeaturedById (seriesId: number, userId: number) : Promise<Favorite | null> {
        return prisma.favorite.findUnique({ where: { userId_seriesId: {  seriesId, userId} } });    
   }

   async deleteFeaturedSeries (seriesId: number, userId: number) : Promise<FavoriteResult>{
        await prisma.favorite.delete({
                where: {
                    userId_seriesId: { seriesId, userId }
                }
            })

        return { success: true }
    }
    
   likesCreate (userId: number, seriesId: number) : Promise<Like>{
        return prisma.like.create({ data: {userId, seriesId } });
    }


   deleteLike (userId: number, seriesId: number) : Promise<Like | null>{
        return prisma.like.delete({ where: { userId_seriesId: { userId, seriesId } } })
   }

   alreadyLike (userId: number, seriesId: number) : Promise<Like | null>{
        return prisma.like.findUnique({ where: { userId_seriesId: { userId, seriesId } } })
   }

}