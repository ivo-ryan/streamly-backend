import { z } from "zod";

export const SeriesRequestSchema = z.object({
    name: z.string(),
    synopsis: z.string(),
    thumbnailUrl: z.string(),
    featured: z.boolean(),
    categoryId: z.number()
})

export const UpdateSeriesRequestSchema = z.object({
    name: z.string().optional(),
    synopsis: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    featured: z.boolean().optional(),
    categoryId: z.number().optional()
})