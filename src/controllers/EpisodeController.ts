import { Handler } from "express";
import { prisma } from "../database";
import { EpisodeRequestSchema, UpdateEpisodeRequestSchema } from "./schemas/EpisodeRequestSchema";
import { HttpError } from "../errors/HttpError";

export class EpisodeController {
    index: Handler = async ( req , res , next ) => {
        try {
            const episodes = await prisma.episode.findMany();
            res.json(episodes);
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async ( req , res , next ) => {
        try {
            const body = EpisodeRequestSchema.parse(req.body);
            const newEpisode = await prisma.episode.create({ data: body });
            res.status(201).json(newEpisode);
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async ( req , res , next ) => {
        try {
            const id = +req.params.id;
            const episode = await prisma.episode.findUnique({ 
                where: { id } ,
                include: {
                    series: { 
                        select: { name: true , synopsis: true } 
                    }
                }
            });
            if(!episode) throw new HttpError(404, " Episode not found ");
            res.json(episode);
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async ( req , res , next ) => {
        try {
            const id = +req.params.id;
            const episode = await prisma.episode.findUnique({ where: { id } });
            if(!episode) throw new HttpError(404, " Episode not found ");
            const body = UpdateEpisodeRequestSchema.parse(req.body);
            const updatedEpisode = await prisma.episode.update({ where: { id }, data: body });
            res.json(updatedEpisode);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async ( req , res , next ) => {
        try {
            const id = +req.params.id;
            const episode = await prisma.episode.findUnique({ where: { id } });
            if(!episode) throw new HttpError(404, " Episode not found ");
            const deletedEpisode = await prisma.episode.delete({ where: { id } });
            res.json({ deletedEpisode: deletedEpisode });
        } catch (error) {
            next(error)
        }
    }
}