import { z } from "zod";

export const CreateUserRequestSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    birth: z.date(),
    email: z.string(),
    password: z.string(),
    role: z.enum(["Admin", "StandardUser"]).optional(),
})
