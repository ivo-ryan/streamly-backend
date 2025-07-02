import { Episode, WatchTime } from "@prisma/client";

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
    createWatchEpisode: ( userId: number, episodeId: number, seconds: number ) => Promise<{success: boolean} | null>
    watchEpisodeById: ( userId: number, episodeId: number) => Promise<WatchTime | null>
    updateWatchEpisode: ( userId: number, episodeId: number, seconds: number ) => Promise<{success: boolean} | null>
    getAllWatchEpisode: ( userId: number) => Promise<WatchTime[]>
    deleteWatchEpisode: ( userId: number, episodeId: number) => Promise<{success: boolean} | null>
}