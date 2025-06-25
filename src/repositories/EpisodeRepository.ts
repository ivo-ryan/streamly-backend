import { Episode } from "@prisma/client";

export interface EpisodeWhereParams {
    name?: {
        equals?: string
        mode?: "default" | "insensitive"
        like?: string
    }
}

export interface FindEpisodeParams {
    where?: EpisodeWhereParams
    offset?: number
    limit?: number
    order?: "asc" | "desc"
    sortBy?: "name" | "createdAt"
}

export interface CreateEpisodeParams {
    name: string;
    synopsis: string;
    order: number;
    videoUrl: string;
    secondsLong: number;
    seriesId: number;
}

export interface IEpisodeRepository {
    find: (params: FindEpisodeParams) => Promise<Episode[]>
    create: (attributes: CreateEpisodeParams) => Promise<Episode>
    count: (where: EpisodeWhereParams) => Promise<number>
    findById: (id: number) => Promise<Episode | null>
    updateById: (id: number, attributes: Partial<CreateEpisodeParams>) => Promise<Episode | null>
    deleteById: (id: number) => Promise<Episode | null>
}