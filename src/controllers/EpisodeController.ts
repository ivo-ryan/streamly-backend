import { Handler } from "express";
import { EpisodeRequestSchema, GetEpisodeRequestSchema,  UpdateEpisodeRequestSchema, VideoUrlRequestSchema } from "./schemas/EpisodeRequestSchema";
import { EpisodeService } from "../services/EpisodeService";
import { HttpError } from "../errors/HttpError";

export class EpisodeController {

    constructor( readonly episodeServise: EpisodeService ){}

    index: Handler = async ( req , res , next ) => {
        try {
            const query = GetEpisodeRequestSchema.parse(req.query);
            const { page="1", pageSize="10", name, order="asc", sortBy="name"} = query;
            const episodes = await this.episodeServise.getAllEpisodes({
                page: +page,
                pageSize: +pageSize,
                name,
                order,
                sortBy
            })
            
            res.json(episodes);
        } catch (error) {
            next(error)
        }
    }

    stream: Handler = async (req , res , next ) => {
        try {
            const { videoUrl } = VideoUrlRequestSchema.parse(req.query) ;
            const range = req.headers.range;
            const { file, head } = await this.episodeServise.streamEpisode(videoUrl, range);
            res.writeHead(206, head);
            file.pipe(res);

        } catch (error) {
            next(error)
        }
    }

    create: Handler = async ( req , res , next ) => {
        try {
            const body = EpisodeRequestSchema.parse(req.body);
            const newEpisode = await this.episodeServise.createEpisode(body);
            res.status(201).json(newEpisode);
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async ( req , res , next ) => {
        try {
            const id = +req.params.id;
            const episode = await this.episodeServise.getEpisodeById(id)
            res.json(episode);
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async ( req , res , next ) => {
        try {
            const id = +req.params.id;
            const body = UpdateEpisodeRequestSchema.parse(req.body);
            const updatedEpisode = await this.episodeServise.updateEpisode(id, body);
            res.json(updatedEpisode);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async ( req , res , next ) => {
        try {
            const id = +req.params.id;
            const deletedEpisode = await this.episodeServise.deleteEpisode(id);
            res.json({ deletedEpisode: deletedEpisode });
        } catch (error) {
            next(error)
        }
    }
}