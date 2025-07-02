import { Handler } from "express";
import { GetSeriesRequestSchema, SeriesRequestSchema, UpdateSeriesRequestSchema } from "./schemas/SeriesRequestSchema";
import { SeriesService } from "../services/SeriesService";

export class SeriesController {

    constructor ( readonly seriesService: SeriesService ){}

    index: Handler = async (req ,res , next ) => {
        try {

            const query = GetSeriesRequestSchema.parse(req.query);
            const { page="1", pageSize="10", name, sortBy="name", order="asc" } = query;

            const series = await this.seriesService.getAllSeries({ 
                name,
                order, 
                page: +page, 
                pageSize: +pageSize ,
                sortBy 
            });
           
            res.json(series)
        } catch (error) {
            next(error)
        }
    }
    
    create: Handler = async (req ,res , next ) => {
        try {
            const body = SeriesRequestSchema.parse(req.body);
            const newSeries = this.seriesService.createSeries(body);
            res.status(201).json(newSeries);
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req ,res , next ) => {
        try {
            const id = +req.params.id;
            const series = await this.seriesService.getSeriesById(id);
            res.json(series);

        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req ,res , next ) => {
        try {
            const id = + req.params.id;
            const body = UpdateSeriesRequestSchema.parse(req.body);
            const updatedSeries = await this.seriesService.updateSeriesById(id, body);
            res.json(updatedSeries);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req ,res , next ) => {
        try {
            const id = + req.params.id;
            const deletedSeries = await this.seriesService.deletedSeriesById(id);
            res.json(deletedSeries);
        } catch (error) {
            next(error)
        }
    }

}