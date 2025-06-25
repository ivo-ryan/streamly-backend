import { Handler } from "express";
import { EpisodeRequestSchema, GetEpisodeRequestSchema, UpdateEpisodeRequestSchema } from "./schemas/EpisodeRequestSchema";
import { HttpError } from "../errors/HttpError";
import { EpisodeWhereParams, IEpisodeRepository } from "../repositories/EpisodeRepository";

export class EpisodeController {

    constructor( readonly episodeRepository: IEpisodeRepository ){}

    index: Handler = async ( req , res , next ) => {
        try {
            const query = GetEpisodeRequestSchema.parse(req.query);
            const { page="1", pageSize="10", name, order="asc", sortBy="name"} = query;
            const limit = +pageSize;
            const offset =( +page -1 ) * limit

            const where: EpisodeWhereParams = {};

            if(name) where.name = { like: name, mode: "insensitive" };
        
            const total = await this.episodeRepository.count(where);

            const episodes = await this.episodeRepository.find({ where, limit, offset, order, sortBy });
            res.json({
                episodes: episodes,
                page: offset,
                pageSize: limit,
                total,
                totalPages: Math.ceil(total/ limit)
            });
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async ( req , res , next ) => {
        try {
            const body = EpisodeRequestSchema.parse(req.body);
            const newEpisode = await this.episodeRepository.create(body);
            res.status(201).json(newEpisode);
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async ( req , res , next ) => {
        try {
            const id = +req.params.id;
            const episode = await this.episodeRepository.findById(id)
            if(!episode) throw new HttpError(404, " Episode not found ");
            res.json(episode);
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async ( req , res , next ) => {
        try {
            const id = +req.params.id;
            const body = UpdateEpisodeRequestSchema.parse(req.body);
            const updatedEpisode = await this.episodeRepository.updateById(id, body);
            if(!updatedEpisode) throw new HttpError(404, " Episode not found ");
            res.json(updatedEpisode);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async ( req , res , next ) => {
        try {
            const id = +req.params.id;
            const deletedEpisode = await this.episodeRepository.deleteById(id);
            if(!deletedEpisode) throw new HttpError(404, " Episode not found ");
            res.json({ deletedEpisode: deletedEpisode });
        } catch (error) {
            next(error)
        }
    }
}