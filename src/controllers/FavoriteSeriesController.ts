import { Handler } from "express";
import { SeriesService } from "../services/SeriesService";
import { AuthenticatedRequest } from "../middlewares/auth";

export class FavoriteSeriesController{

    constructor( readonly seriesService: SeriesService ){}
    
    addFavorite: Handler = async (req: AuthenticatedRequest , res , next ) => {
        try {
            const userId = req.user!.id;
            const { seriesId } = req.body;
            const addFavorite = await this.seriesService.addFavoriteSeries(seriesId, userId);
            res.json(addFavorite);
        } catch (error) {
            next(error)
        }
    }

    getRandonFeaturedSeries: Handler = async (req , res , next) => {
        try {
            const randomFeatured = await this.seriesService.getRandonSeriesFeatured();
            res.json(randomFeatured);
        } catch (error) {
            next(error)
        }
    }

    getAllFavorites: Handler = async (req:AuthenticatedRequest , res , next ) => {
        try {
            const userId = req.user!.id;
            const favorites = await this.seriesService.getAllFavoriteSeries(userId);
            res.json(favorites);
        } catch (error) {
            next(error)
        }
    }

    deleteFavorite: Handler = async (req: AuthenticatedRequest , res , next ) => {
        try {
            const userId = req.user!.id;
            const { seriesId } = req.body;
            const deleteFavoriteSeries = await this.seriesService.deleteFavoriteSeries(seriesId, userId);
            res.json(deleteFavoriteSeries);
        } catch (error) {
            next(error)
        }
    }
}