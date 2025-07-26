import { z } from "zod";

const userRoleSchema = z.enum(["Admin", "StandardUser"]);

export const GetUsersRequestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    firstName: z.string().optional(),
    role:userRoleSchema.optional(),
    sortBy: z.enum([ "firstName", "role" , "createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional()
})

export const CreateUserRequestSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    birth: z.coerce.date(),
    email: z.string(),
    password: z.string(),
    role: userRoleSchema.optional()
})


export const UpdatedUserRequestSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    birth: z.coerce.date().optional(),
    email: z.string().optional(),
    role: userRoleSchema.optional()
}).strict()

export const UpdatePasswordRequestSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string()
}).strict();

