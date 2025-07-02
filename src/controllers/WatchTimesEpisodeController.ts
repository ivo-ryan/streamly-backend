import { Handler } from "express";
import { EpisodeService } from "../services/EpisodeService";

export class WatchTimesEpisodeController {

    constructor( readonly episodeService: EpisodeService ){}

    addWatchingEpisode: Handler = async (req , res, next ) => {
        try {
            const userId = +req.params.id;
            const { episodeId, seconds } = req.body;
            const watchEpisode = await this.episodeService.createWatchingEpisode(userId, episodeId, seconds);
            res.status(201).json(watchEpisode);
        } catch (error) {
           next(error) 
        }
    }

    getAllWatchingEpisode: Handler = async (req , res, next ) => {
        try {
            const userId = +req.params.id;
            const watchEpisode = await this.episodeService.getAllWatchingEpisode(userId);
            res.json(watchEpisode);
        } catch (error) {
           next(error) 
        }
    }

    getByIdWatchingEpisode: Handler = async (req , res , next ) => {
        try {
            const userId = +req.params.id;
            const { episodeId } = req.body;
            const watchEpisodeById = await this.episodeService.watchEpisodeById(userId, episodeId);
            res.json(watchEpisodeById)
        } catch (error) {
            next(error)
        }
    }

    updateWatchingEpisode: Handler = async (req , res, next ) => {
        try {
            const { userId, episodeId, seconds } = req.body;
            const updatedWatchEpisode = await this.episodeService.updateWatchEpisode(userId, episodeId, seconds);
            res.json(updatedWatchEpisode);
        } catch (error) {
           next(error) 
        }
    }

    deleteWatchEpisode: Handler = async (req , res, next ) => {
        try {
            const { userId, episodeId } = req.body;
            const deletedWatchEpisode = await this.episodeService.deleteWatchEpisode(userId, episodeId);
            res.json(deletedWatchEpisode);
        } catch (error) {
           next(error) 
        }
    }
}