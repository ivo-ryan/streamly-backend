
import { CreateEpisodeParams, EpisodeWhereParams, IEpisodeRepository } from "../repositories/EpisodeRepository";
import { HttpError } from "../errors/HttpError";
import { IUserRepository } from "../repositories/UserRepository";
import fs from "fs";
import path from "path";

interface GetEpisodesAttributes {
    pageSize?: number
    page?: number
    name?: string
    order?: "asc" | "desc"
    sortBy?: "name" | "createdAt"
}



export class EpisodeService{
    constructor( readonly episodeRepository: IEpisodeRepository , readonly userRepository: IUserRepository){}

    async getAllEpisodes({ name, order, page=1 , pageSize=10 , sortBy }: GetEpisodesAttributes){
        const limit = +pageSize;
        const offset =( +page -1 ) * limit

        const where: EpisodeWhereParams = {};

        if(name) where.name = { like: name, mode: "insensitive" };
    
        const total = await this.episodeRepository.count(where);

        const episodes = await this.episodeRepository.find({ where, limit, offset, order, sortBy });
        

        return {
                episodes: episodes,
                page,
                pageSize: limit,
                total,
                totalPages: Math.ceil(total/ limit)
            }
    }

    async createEpisode (attributes: CreateEpisodeParams) {
        const newEpisode = await this.episodeRepository.create(attributes)
        return newEpisode
    }

    async streamEpisode (videoUrl: string, range: string | undefined) {
        const filePath = path.join(__dirname, '..', '..', 'uploads', videoUrl);
        const fileStat = fs.statSync(filePath);

        if(range) {
            const parts = range.replace(/bytes/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size -1;
            const chunkSize = (end - start) +1;
            const file = fs.createReadStream(filePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4'
            }
            return { file, head }
        }else{
            const head = {
                'Content-Length': fileStat.size,
                'Content-Type': 'video/mp4'
            }

            const file = fs.createReadStream(filePath);

            return{ file, head }
        }
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

    async userAndEpisodeExists (userId: number, episodeId: number) {
        const episode = await this.episodeRepository.findById(episodeId);
        if(!episode) throw new HttpError(404, "Episode not found!");
        const user = await this.userRepository.findById(userId);
        if(!user) throw new HttpError(404, "User not found!");
    }

    async createWatchingEpisode (userId:number, episodeId: number, seconds: number) {
        await this.userAndEpisodeExists(userId, episodeId);
        const watchEpisodeExists = await this.episodeRepository.watchEpisodeById(userId, episodeId);
        if(watchEpisodeExists) throw new HttpError(409, "Watch time episode has already been created!")
        const watchEpisode = await this.episodeRepository.createWatchEpisode(userId, episodeId, seconds);
        return watchEpisode
    }

    async getAllWatchingEpisode(userId: number) {
        const user = await this.userRepository.findById(userId);
        if(!user) throw new HttpError(404, "User not found!");
        const getAllWatchEpisode = await this.episodeRepository.getAllWatchEpisode(userId);
        return getAllWatchEpisode
    }

    async watchEpisodeById (userId: number, episodeId: number) {
        await this.userAndEpisodeExists(userId, episodeId);
        const watchingEpisode = await this.episodeRepository.watchEpisodeById(userId, episodeId);
        return watchingEpisode
    }

    async updateWatchEpisode (userId: number, episodeId: number, seconds: number){
        await  this.userAndEpisodeExists(userId, episodeId);
        const updateWatchEpisode = await this.episodeRepository.updateWatchEpisode(userId, episodeId, seconds);
        return updateWatchEpisode
    }

    async deleteWatchEpisode (userId:number, episodeId: number) {
        await this.userAndEpisodeExists(userId, episodeId);
        const deleteWatchEpisode = await this.episodeRepository.deleteWatchEpisode(userId, episodeId);
        return deleteWatchEpisode
    }


}