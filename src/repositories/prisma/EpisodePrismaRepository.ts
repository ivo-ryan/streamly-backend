import { Episode } from "@prisma/client";
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
            orderBy: {[params.sortBy="name"]: params.order}
        })
    }

    create (attributes: CreateEpisodeParams) : Promise<Episode>{
        return prisma.episode.create({ data: attributes })
    }

    count (where: EpisodeWhereParams) : Promise<number>{
        return prisma.episode.count({ where })
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


}