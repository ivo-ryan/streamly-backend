import { Episode, WatchTime } from "@prisma/client";
import { CreateEpisodeParams, EpisodeWhereParams, FindEpisodeParams, IEpisodeRepository } from "../EpisodeRepository";
import { prisma } from "../../database";

export class EpisodePrismaRepository implements IEpisodeRepository{
    find (params: FindEpisodeParams) : Promise<Episode[]>{
        return prisma.episode.findMany({
            where: {
                name:{
                    mode: params.where?.name?.mode,
                    contains: params.where?.name?.like,
                    equals: params.where?.name?.equals                    
                }
            },

            skip: params.offset,
            take: params.limit,
            orderBy: {[params.sortBy ?? "name"]: params.order}
        })
    }

    create (attributes: CreateEpisodeParams) : Promise<Episode>{
        return prisma.episode.create({ data: attributes })
    }

    count (where: EpisodeWhereParams) : Promise<number>{
        return prisma.episode.count({ where: {
             name:{
                    mode: where?.name?.mode,
                    contains: where?.name?.like,
                    equals: where?.name?.equals                    
                }
        } })
    }

    findById (id: number) : Promise<Episode | null>{
        return prisma.episode.findUnique({ where: { id } , include: { series: { select: { name: true, category: true, synopsis: true } } }})
    }

    updateById (id: number, attributes: Partial<CreateEpisodeParams>) : Promise<Episode | null>{
        return prisma.episode.update({ where: { id }, data: attributes })
    }

    deleteById (id: number) : Promise<Episode | null>{
        return prisma.episode.delete({ where: { id } })
    }

    async createWatchEpisode (userId: number, episodeId: number, seconds: number) : Promise<{ success: boolean  } | null>{
        await prisma.watchTime.create({ data: { userId, episodeId, seconds } });

        return {success: true}
    }

    getAllWatchEpisode (userId: number) : Promise<WatchTime[]>{
        return prisma.watchTime.findMany({ where: { userId }, include: { episode: true } })
    }

    watchEpisodeById (userId: number, episodeId: number) : Promise<WatchTime | null>{
        return prisma.watchTime.findUnique({ where: { userId_episodeId: { userId, episodeId } } })
    }

    async updateWatchEpisode (userId: number, episodeId: number, seconds: number) : Promise<{ success: boolean; } | null>{
        await prisma.watchTime.update({ where: { userId_episodeId: { userId, episodeId } }, data: { seconds } })

        return { success: true }
    }

    async deleteWatchEpisode (userId: number, episodeId: number) : Promise<{ success: boolean; } | null>{
        await prisma.watchTime.delete({ where: { userId_episodeId: { userId, episodeId } } });
        return { success: true }
    }
}