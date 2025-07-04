import { HttpError } from "../errors/HttpError";
import { CreateSeriesParams, FindWhereParams, ISeriesRepository } from "../repositories/SeriesRepository";
import { IUserRepository } from "../repositories/UserRepository";

interface GetSeriesParams {
    pageSize?: number
    page?: number
    name?: string
    sortBy?: "name" | "createdAt"
    order?: "asc" | "desc"
}

export class SeriesService {

    constructor( readonly seriesRepository: ISeriesRepository,
                 readonly userRepository: IUserRepository
     ){}

    async getAllSeries({ pageSize=10, name, page=1, order, sortBy }: GetSeriesParams) {
        const limit = pageSize;
        const offset = ( page -1 ) * limit;

        const where: FindWhereParams = {}

        if(name) where.name = { like : name , mode: "insensitive" }

        const total = await this.seriesRepository.count(where)

        const series = await this.seriesRepository.find({ where, offset, limit, sortBy, order });

        return{
                data: series,
                meta: {
                    page,
                    pageSize: limit,
                    total,
                    totalPages: Math.ceil(total/ limit)
                }

              }
    }

    async createSeries(attributes: CreateSeriesParams){
        const newSeries = await this.seriesRepository.create(attributes);
        return newSeries
    }

    async getSeriesById(id: number){
        const series = await this.seriesRepository.findById(id);
        if(!series) throw new HttpError(404, "Series not found!");
        return series
    }

    async updateSeriesById (id: number, attributes: Partial<CreateSeriesParams> ) {
        const updatedSeries = await this.seriesRepository.updateById( id, attributes );
        if(!updatedSeries) throw new HttpError(404, "Series not found!");
        return updatedSeries
    }

    async deletedSeriesById (id:number){
        const deletedSeries = await this.seriesRepository.deleteById(id);
        if(!deletedSeries) throw new HttpError(404, "Series not found!")
        return { deletedSeries: deletedSeries }
    }

    async userAndSeriesExists ( seriesId: number, userId: number) {
        const seriesExists = await this.seriesRepository.findById(seriesId);
        if(!seriesExists) throw new HttpError(404, "Series not found!");
        const userExists = await this.userRepository.findById(userId);
        if(!userExists) throw new HttpError(404, "User not found!");
    }

    async addFavoriteSeries (seriesId: number, userId: number ){
        await this.userAndSeriesExists(seriesId, userId)
        const favoriteExits = await this.seriesRepository.seriesFeaturedById(seriesId, userId);
        if(favoriteExits)  throw new HttpError(409, "Serie já adicionada como favorita!")
        const favoriteSeries = await this.seriesRepository.addFeaturedSeries(seriesId, userId);
        
        return favoriteSeries
    }

    async getRandonSeriesFeatured(){
        const featuredSeries = await this.seriesRepository.getRandonFeaturedSeries();
        const randonFeatured = featuredSeries.sort(() => 0.5 - Math.random());
        return randonFeatured.slice(0, 3);
    }

    async getAllFavoriteSeries ( userId: number) {
        const userExists = await this.userRepository.findById(userId);
        if(!userExists) throw new HttpError(404, "User not found!");
        const favoriteSeries = await this.seriesRepository.getAllFavoriteSeries( userId);
        return favoriteSeries
    }

    async deleteFavoriteSeries (seriesId: number, userId: number) {
        await this.userAndSeriesExists(seriesId, userId)
        const deleteFavoriteSeries = await this.seriesRepository.deleteFeaturedSeries(seriesId, userId);
        return deleteFavoriteSeries;
    }

    async addLike(userId: number, seriesId: number) {
        await this.userAndSeriesExists(seriesId ,userId );
        const addLike = await this.seriesRepository.likesCreate(userId, seriesId);
        return addLike;
    }

    async deleteLike(userId: number, seriesId: number) {
        await this.userAndSeriesExists(seriesId,userId )
        const deletedLike = await this.seriesRepository.deleteLike(userId, seriesId);
        return deletedLike;
    }
}