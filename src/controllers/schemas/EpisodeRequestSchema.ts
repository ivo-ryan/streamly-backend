import { z } from "zod";

export const GetEpisodeRequestSchema = z.object({
    name: z.string(),
    page: z.string(),
    pageSize: z.string(),
    order: z.enum(["asc", "desc"]),
    sortBy: z.enum(["name", "createdAt"])
})

export const EpisodeRequestSchema = z.object({
    name: z.string(),
    synopsis: z.string(),
    order: z.number(),
    videoUrl: z.string(),
    secondsLong: z.number(),
    seriesId: z.number()
})

export const UpdateEpisodeRequestSchema = z.object({
    name: z.string().optional(),
    synopsis: z.string().optional(),
    order: z.number().optional(),
    videoUrl: z.string().optional(),
    secondsLong: z.number().optional(),
    seriesId: z.number().optional()
})