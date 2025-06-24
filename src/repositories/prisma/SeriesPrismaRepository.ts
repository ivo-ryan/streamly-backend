import { Series } from "@prisma/client";
import { CreateSeriesParams, FindSeriesParams, FindWhereParams, ISeriesRepository } from "../SeriesRepository";
import { prisma } from "../../database";

export class SeriesPrismaRepository implements ISeriesRepository {
    find (params: FindSeriesParams) : Promise<Series[]>{
        return prisma.series.findMany({
            where: {
                name: {
                    equals: params.where?.name?.equals,
                    contains: params.where?.name?.like,
                    mode: params.where?.name?.mode      
                }
            },

            skip: params.offset,
            take: params.limit,
            orderBy: {[params.sortBy="name"]: params.order}
        })
    }

    create (attributes: CreateSeriesParams) : Promise<Series>{
        return prisma.series.create({ data: attributes })
    }

    count (where: FindWhereParams) : Promise<number>{
        return prisma.series.count({ where })
    }

    findById (id: number) : Promise<Series | null>{
        return prisma.series.findUnique({ where: { id } })
    }

    updateById (id: number, attributes: Partial<CreateSeriesParams>) : Promise<Series | null>{
        return prisma.series.update({ where: { id }, data: attributes })
    }

    deleteById (id: number) : Promise<Series | null>{
        return prisma.series.delete({ where: { id } })
    }
    
}