import { User } from "@prisma/client";
import { CreateUserAttributes, FindUserParams, IUserRepository, UpdateUser, UserWhereParams } from "../UserRepository";
import { prisma } from "../../database";

export class UserPrismaRepository implements IUserRepository {
    find (params: FindUserParams): Promise<User[]>{
        return prisma.user.findMany({
            where: {
                firstName: {
                    contains: params.where?.firstName?.like,
                    equals: params.where?.firstName?.equals,
                    mode: params.where?.firstName?.mode
                },
                role: params.where?.role
            },
            skip: params.offset,
            take: params.limit,
            orderBy: { [params.sortBy ?? "firstName"]: params.order }
        })
    }

    create (attributes: CreateUserAttributes): Promise<User>{
        return prisma.user.create({ data: attributes })
    }

    count (where: UserWhereParams): Promise<number>{
        return prisma.user.count({ where: {
            firstName: {
                    contains: where?.firstName?.like,
                    equals: where?.firstName?.equals,
                    mode: where?.firstName?.mode
                },
                role: where?.role
        } })
    }

    findByEmail (email: string): Promise<User | null>{
        return prisma.user.findUnique({ where: { email } })
    }
        
    findById (id: number): Promise<User | null>{
        return prisma.user.findUnique({ where: { id } })
    }

    updateById (id: number, attributes: UpdateUser): Promise<UpdateUser | null>{
        return prisma.user.update({ where: { id }, data: attributes })
    }

    deleteById (id: number): Promise<User | null>{
        return prisma.user.delete({ where: { id } })
    }

    userWatching (id: number): Promise<User | null>{
        return prisma.user.findUnique({
            where: { id },
            include: { watchTimes: {include: {episode: { include: { series: true } } },
                orderBy: { 'updatedAt': 'desc'}
            }}
        })
    }
    updatePassword (id: number, password: string): Promise<User | null>{
        return prisma.user.update({ data: { password }, where: { id } })
    }
    
}