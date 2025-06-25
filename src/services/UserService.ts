import { HttpError } from "../errors/HttpError";
import { CreateUserAttributes, IUserRepository, UserWhereParams } from "../repositories/UserRepository";

interface GetUsersWithPaginationParams {
    pageSize?: number
    page?: number
    firstName?: string
    role?: "Admin" | "StandardUser"
    sortBy?: "firstName"| "role" | "createdAt"
    order?: "asc" | "desc"
}

export class UserService{

    constructor( readonly userRepository: IUserRepository ){}

    async getAllUsersPaginated({ page=1, firstName, pageSize=10, role, order, sortBy }: GetUsersWithPaginationParams) {
        const limit = pageSize;
        const offset = (page -1) * limit;

        const where: UserWhereParams = {};
        if(firstName) where.firstName = { like: firstName, mode: "insensitive" };
        if(role) where.role = role;

        const users = await this.userRepository.find({ where, offset, limit, order, sortBy });

        const total = await this.userRepository.count(where);

            return {
                        data: users,
                        meta: {
                            page: offset,
                            pageSize: limit,
                            total,
                            totalPages: Math.ceil(total/limit)
                        }
                    }
    }

    async createUser(attributes: CreateUserAttributes) {
         const newUser = await this.userRepository.create(attributes)
         return newUser
    }

    async userFindById (id : number) {
        const user = await this.userRepository.findById(+id);
        if(!user) new HttpError(404, 'Lead não encontrado!');
        return user
    }

    async userUpdate (id: number , attributes: Partial<CreateUserAttributes>) {
        const updatedUser= await this.userRepository.updateById(id, attributes);
        if(!updatedUser) new HttpError(404, 'Lead não encontrado!');
        return updatedUser
    }

    async userDelete (id: number) {
        const deletedUser = await this.userRepository.deleteById(id);
        if(!deletedUser) new HttpError(404, 'Lead não encontrado!');
        return {deletedUser: deletedUser}
    }
}