import { Router } from "express";
import { categoryController, episodeController, seriesController, userController } from "./container";


const router = Router();



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