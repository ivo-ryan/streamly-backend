import { UserController } from "./controllers/UserController";
import { CategoryController } from "./controllers/CategoryController";
import { SeriesController } from "./controllers/SeriesController";
import { EpisodeController } from "./controllers/EpisodeController";
import { UserPrismaRepository } from "./repositories/prisma/UserPrismaRepository";
import { CategoryPrismaRepository } from "./repositories/prisma/CategoryPrismaRepository";
import { SeriesPrismaRepository } from "./repositories/prisma/SeriesPrismaRepository";
import { EpisodePrismaRepository } from "./repositories/prisma/EpisodePrismaRepository";
import { UserService } from "./services/UserService";
import { CategoryService } from "./services/CategoryService";
import { SeriesService } from "./services/SeriesService";
import { EpisodeService } from "./services/EpisodeService";

const userPrismaRepository = new UserPrismaRepository();
const categoryPrismaRepository = new CategoryPrismaRepository();
const seriesPrismaRepository = new SeriesPrismaRepository();
const episodePrismaRepository = new EpisodePrismaRepository();

const userService = new UserService(userPrismaRepository);
const categoryService = new CategoryService(categoryPrismaRepository);
const seriesService = new SeriesService(seriesPrismaRepository);
const episodeService = new EpisodeService(episodePrismaRepository)

export const userController = new UserController(userService);
export const categoryController = new CategoryController(categoryService);
export const seriesController = new SeriesController(seriesService);
export const episodeController = new EpisodeController(episodeService);