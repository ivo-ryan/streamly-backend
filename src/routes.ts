import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { CategoryController } from "./controllers/CategoryController";
import { SeriesController } from "./controllers/SeriesController";
import { EpisodeController } from "./controllers/EpisodeController";
import { UserPrismaRepository } from "./repositories/prisma/UserPrismaRepository";
import { CategoryPrismaRepository } from "./repositories/prisma/CategoryPrismaRepository";
import { SeriesPrismaRepository } from "./repositories/prisma/SeriesPrismaRepository";
import { EpisodePrismaRepository } from "./repositories/prisma/EpisodePrismaRepository";

const router = Router();

const userPrismaRepository = new UserPrismaRepository();
const categoryPrismaRepository = new CategoryPrismaRepository();
const seriesPrismaRepository = new SeriesPrismaRepository();
const episodePrismaRepository = new EpisodePrismaRepository();

const userController = new UserController(userPrismaRepository);
const categoryController = new CategoryController(categoryPrismaRepository);
const seriesController = new SeriesController(seriesPrismaRepository);
const episodeController = new EpisodeController(episodePrismaRepository);

router.get('/users', userController.index);
router.post('/users', userController.create);
router.get('/users/:id', userController.show);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

router.get('/categories', categoryController.index);
router.post('/categories', categoryController.create);
router.get('/categories/:id', categoryController.show);
router.put('/categories/:id', categoryController.update);
router.delete('/categories/:id', categoryController.delete);

router.get('/series', seriesController.index);
router.post('/series', seriesController.create);
router.get('/series/:id', seriesController.show);
router.put('/series/:id', seriesController.update);
router.delete('/series/:id', seriesController.delete);

router.get('/episodes', episodeController.index);
router.post('/episodes', episodeController.create);
router.get('/episodes/:id', episodeController.show);
router.put('/episodes/:id', episodeController.update);
router.delete('/episodes/:id', episodeController.delete);

export { router };