import { z } from "zod";

export const CategoryRequestSchema = z.object({
    name: z.string(),
    position: z.number()
})

export const UpdatedCategoryRequestSchema = z.object({
    name: z.string().optional(),
    position: z.number().optional()
})