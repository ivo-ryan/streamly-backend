import { Handler } from "express";
import { GetSeriesRequestSchema, SeriesRequestSchema, UpdateSeriesRequestSchema } from "./schemas/SeriesRequestSchema";
import { HttpError } from "../errors/HttpError";
import { FindWhereParams, ISeriesRepository } from "../repositories/SeriesRepository";

export class SeriesController {

    constructor ( readonly seriesRepository: ISeriesRepository ){}

    index: Handler = async (req ,res , next ) => {
        try {

            const query = GetSeriesRequestSchema.parse(req.query);
            const { page="1", pageSize="10", name, sortBy="name", order="asc" } = query;
            const limit = +pageSize;
            const offset = ( +page -1 ) * limit;

            const where: FindWhereParams = {}

            if(name) where.name = { like : name , mode: "insensitive" }

            const total = await this.seriesRepository.count(where)

            const series = await this.seriesRepository.find({ where, offset, limit, sortBy, order });
            res.json({
                data: series,
                meta: {
                    page: offset,
                    pageSize: limit,
                    total,
                    totalPages: Math.ceil(total/ limit)
                }

            })
        } catch (error) {
            next(error)
        }
    }
    
    create: Handler = async (req ,res , next ) => {
        try {
            const body = SeriesRequestSchema.parse(req.body);
            const newSeries = await this.seriesRepository.create(body);
            res.status(201).json(newSeries);
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req ,res , next ) => {
        try {
            const id = +req.params.id;
            const series = await this.seriesRepository.findById(id);
            if(!series) throw new HttpError(404, "Series not found!");
            res.json(series);

        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req ,res , next ) => {
        try {
            const id = + req.params.id;
            const body = UpdateSeriesRequestSchema.parse(req.body);
            const updatedSeries = await this.seriesRepository.updateById(id, body);
            if(!updatedSeries) throw new HttpError(404, "Series not found!");
            res.json(updatedSeries);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req ,res , next ) => {
        try {
            const id = + req.params.id;
            const deletedSeries = await this.seriesRepository.deleteById(id);
            if(!deletedSeries) throw new HttpError(404, "Series not found!");
            res.json({  deletedSeries: deletedSeries });
        } catch (error) {
            next(error)
        }
    }

}