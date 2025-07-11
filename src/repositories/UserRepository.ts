import { User } from "@prisma/client";

export interface UserWhereParams {
    firstName?: {
        equals?: string
        like?: string
        mode?: "default" | "insensitive"
    }
    role?: "Admin" | "StandardUser"

}

export interface FindUserParams {
    where?: UserWhereParams
    sortBy?: "firstName" | "role" | "createdAt"
    order?: "asc" | "desc"
    limit?: number
    offset?: number
}

export interface CreateUserAttributes {
    firstName: string
    lastName: string
    phone: string
    birth: Date
    email: string
    password: string
    role?: "Admin" | "StandardUser"
}

export interface IUserRepository {
    find : (params: FindUserParams) => Promise<User[]>
    create: (attributes: CreateUserAttributes) => Promise<User>
    count: (where: UserWhereParams) => Promise<number>
    findByEmail: (email: string) => Promise< User | null >
    findById: (id: number) => Promise< User | null >
    updateById: (id: number, attributes: Partial<CreateUserAttributes>) => Promise< User | null >
    deleteById: (id: number) => Promise< User | null >
}