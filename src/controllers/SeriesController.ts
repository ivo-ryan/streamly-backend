import { Handler } from "express";
import { prisma } from "../database";
import { SeriesRequestSchema, UpdateSeriesRequestSchema } from "./schemas/SeriesRequestSchema";
import { HttpError } from "../errors/HttpError";

export class SeriesController {
    index: Handler = async (req ,res , next ) => {
        try {
            const series = await prisma.series.findMany();
            res.json(series)
        } catch (error) {
            next(error)
        }
    }
    
    create: Handler = async (req ,res , next ) => {
        try {
            const body = SeriesRequestSchema.parse(req.body);
            const newSeries = await prisma.series.create({ data: body });
            res.status(201).json(newSeries);
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req ,res , next ) => {
        try {
            const id = +req.params.id;
            const series = await prisma.series.findUnique({
                where: { id },
                include: {
                    category: true,
                    favorites: true
                }
            });

            if(!series) throw new HttpError(404, "Series not found!");
            res.json(series);

        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req ,res , next ) => {
        try {
            const id = + req.params.id;
            const series = await prisma.series.findUnique({ where: { id } });
            if(!series) throw new HttpError(404, "Series not found!");
            const body = UpdateSeriesRequestSchema.parse(req.body);
            const updatedSeries = await prisma.series.update({ where: { id }, data: body });
            res.json(updatedSeries);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req ,res , next ) => {
        try {
            const id = + req.params.id;
            const series = await prisma.series.findUnique({ where: { id } });
            if(!series) throw new HttpError(404, "Series not found!");
            const deletedSeries = await prisma.series.delete({ where: { id } });
            res.json({  deletedSeries: deletedSeries });
        } catch (error) {
            next(error)
        }
    }

}