import { Handler } from "express";
import { SeriesService } from "../services/SeriesService";

export class LikesController{
    constructor( readonly seriesService: SeriesService ){}

    create: Handler = async (req , res , next) => {
        try {
            const userId = +req.params.id;
            const { seriesId } = req.body;
            const addLike = await this.seriesService.addLike(userId,seriesId);
            res.status(201).json(addLike);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req , res , next) => {
        try {
            const userId = +req.params.id;
            const { seriesId } = req.body;
            const deletedLike = await this.seriesService.deleteLike(userId,seriesId);
            res.json(deletedLike);
        } catch (error) {
            next(error)
        }
    }
}