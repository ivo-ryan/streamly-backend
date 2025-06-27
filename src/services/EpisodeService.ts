
import { partialUtil } from "zod/dist/types/v3/helpers/partialUtil";
import { CreateEpisodeParams, EpisodeWhereParams, IEpisodeRepository } from "../repositories/EpisodeRepository";
import { HttpError } from "../errors/HttpError";

interface GetEpisodesAttributes {
    pageSize?: number
    page?: number
    name?: string
    order?: "asc" | "desc"
    sortBy?: "name" | "createdAt"
}

export class EpisodeService{
    constructor( readonly episodeRepository: IEpisodeRepository ){}

    async getAllEpisodes({ name, order, page=1 , pageSize=10 , sortBy }: GetEpisodesAttributes){
        const limit = +pageSize;
        const offset =( +page -1 ) * limit

        const where: EpisodeWhereParams = {};

        if(name) where.name = { like: name, mode: "insensitive" };
    
        const total = await this.episodeRepository.count(where);

        const episodes = await this.episodeRepository.find({ where, limit, offset, order, sortBy });
        

        return {
                episodes: episodes,
                page: offset,
                pageSize: limit,
                total,
                totalPages: Math.ceil(total/ limit)
            }
    }

    async createEpisode (attributes: CreateEpisodeParams) {
        const newEpisode = await this.episodeRepository.create(attributes)
        return newEpisode
    }

    async getEpisodeById (id: number) {
        const episode = await this.episodeRepository.findById(id);
        if(!episode) throw new HttpError(404, "Episode not found!")
        return episode
    }

    async updateEpisode(id: number, attributes: Partial<CreateEpisodeParams>){
        const updatedEpisode = await this.episodeRepository.updateById(id, attributes);
        if(!updatedEpisode) throw new HttpError(404, "Episode not found!")
        
        return updatedEpisode
    }

    async deleteEpisode (id: number){
        const deletedEpisode = await this.episodeRepository.deleteById(id);
        if(!deletedEpisode) throw new HttpError(404, "Episode not found!")
        return { deletedEpisode: deletedEpisode }
    }
}