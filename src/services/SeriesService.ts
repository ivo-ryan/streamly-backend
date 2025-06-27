import { HttpError } from "../errors/HttpError";
import { CreateSeriesParams, FindWhereParams, ISeriesRepository } from "../repositories/SeriesRepository";

interface GetSeriesParams {
    pageSize?: number
    page?: number
    name?: string
    sortBy?: "name" | "createdAt"
    order?: "asc" | "desc"
}

export class SeriesService {

    constructor( readonly seriesRepository: ISeriesRepository ){}

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
                    page: offset,
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
}