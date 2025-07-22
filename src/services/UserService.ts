import { HttpError } from "../errors/HttpError";
import { CreateUserAttributes, IUserRepository, UserWhereParams } from "../repositories/UserRepository";
import bcrypt from 'bcrypt';
import { JwtService } from "./jwtService";

interface GetUsersWithPaginationParams {
    pageSize?: number
    page?: number
    firstName?: string
    role?: "Admin" | "StandardUser"
    sortBy?: "firstName"| "role" | "createdAt"
    order?: "asc" | "desc"
}

export class UserService{

    constructor( readonly userRepository: IUserRepository , readonly jwtService: JwtService ){}

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
                            page,
                            pageSize: limit,
                            total,
                            totalPages: Math.ceil(total/limit)
                        }
                    }
    }

    async createUser(attributes: CreateUserAttributes) {
        const userAlreadyExists = await this.userFindByEmail(attributes.email)
        if(userAlreadyExists) throw new HttpError(409, 'Usuário já existe!')
        const passwordHash = await bcrypt.hash(attributes.password, 10);
        attributes.password = passwordHash;
        const newUser = await this.userRepository.create(attributes)
        return newUser
    }

    async checkPassword (password: string, email: string){
        const user = await this.userRepository.findByEmail(email);
        if(!user) throw new HttpError(404, 'Usuário não encontrado!');
        const correctPassword = await bcrypt.compare(password, user.password);
        if(!correctPassword) throw new HttpError(401, 'Senha incorreta!');
        
        const token = this.jwtService.signToken(user.id, user.email);
        return token
    }

    async userFindByEmail (email: string) {
        const user = await this.userRepository.findByEmail(email);
        if(!user) new HttpError(404, 'Lead não encontrado!');
        return user
    }

    async userUpdate (id: number , attributes: Partial<CreateUserAttributes>) {
        if(attributes.password) {
            const newPassword = await bcrypt.hash(attributes.password, 10);
            attributes.password = newPassword
        }

        const updatedUser= await this.userRepository.updateById(id, attributes);
        if(!updatedUser) new HttpError(404, 'Lead não encontrado!');
        return updatedUser
    }

    async userDelete (id: number) {
        const deletedUser = await this.userRepository.deleteById(id);
        if(!deletedUser) new HttpError(404, 'Lead não encontrado!');
        return {deletedUser: deletedUser}
    }

    async getKeepWatchingList (id: number) {
        const userWatchingList = await this.userRepository.userWatching(id);
        return userWatchingList
    }
}