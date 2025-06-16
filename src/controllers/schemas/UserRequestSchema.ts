import { z } from "zod";

export const CreateUserRequestSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    birth: z.date(),
    email: z.string(),
    password: z.string(),
    role: z.enum(["Admin", "StandardUser"]).optional()
})


export const UpdatedUserRequestSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    birth: z.date().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    role: z.enum(["Admin", "StandardUser"]).optional()
})