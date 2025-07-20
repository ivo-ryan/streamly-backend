import { Handler } from "express";
import { SeriesService } from "../services/SeriesService";
import { AuthenticatedRequest } from "../middlewares/auth";

export class LikesController{
    constructor( readonly seriesService: SeriesService ){}

    create: Handler = async (req: AuthenticatedRequest , res , next) => {
        try {
            const userId = req.user!.id;
            const { seriesId } = req.body;
            const addLike = await this.seriesService.addLike(userId,seriesId);
            res.status(201).json(addLike);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req: AuthenticatedRequest , res , next) => {
        try {
            const userId = req.user!.id;
            const seriesId  = +req.params.id;
            const deletedLike = await this.seriesService.deleteLike(userId,seriesId);
            res.json(deletedLike);
        } catch (error) {
            next(error)
        }
    }

    getTopTenSeries: Handler = async (req , res , next) => {
        try {
            const topTenSeries = await this.seriesService.getTopTenSeries();
            res.json(topTenSeries)
        } catch (error) {
            next(error) 
        }
    }
}