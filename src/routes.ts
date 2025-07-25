import { Router } from "express";
import { categoryController, episodeController, favoriteSeriesController, likesController, seriesController, userController, watchingEpisodeController } from "./container";
import { ensureAuth, ensureAuthViaQuery } from "./middlewares/auth";

const router = Router();

router.get('/users', userController.index);
router.post('/users', userController.create);
router.get('/users/email', userController.show);
router.post('/auth/login', userController.login);
router.get('/account', ensureAuth, userController.getAccount);
router.put('/users/:id', ensureAuth, userController.update);
router.delete('/users/:id', userController.delete);

router.get('/categories', ensureAuth , categoryController.index);
router.post('/categories', ensureAuth, categoryController.create);
router.get('/categories/:id', categoryController.show);
router.put('/categories/:id', categoryController.update);
router.delete('/categories/:id', ensureAuth,  categoryController.delete);

router.get('/series', seriesController.index);
router.post('/series', seriesController.create);
router.get('/series/featured', favoriteSeriesController.getRandonFeaturedSeries);
router.get('/series/newest', seriesController.getTopTenNewest);
router.get('/series/popular', ensureAuth, likesController.getTopTenSeries);
router.get('/series/:id', ensureAuth, seriesController.show);
router.put('/series/:id', seriesController.update);
router.delete('/series/:id', seriesController.delete);

router.get('/favorites', ensureAuth, favoriteSeriesController.getAllFavorites);
router.post('/favorites', ensureAuth, favoriteSeriesController.addFavorite);
router.delete('/favorites', ensureAuth, favoriteSeriesController.deleteFavorite);

router.post('/likes', ensureAuth, likesController.create );
router.delete('/likes/:id',ensureAuth,  likesController.delete);

router.get('/episodes', episodeController.index);
router.post('/episodes', ensureAuth, episodeController.create);
router.get('/episodes/stream', ensureAuthViaQuery,  episodeController.stream);

router.get('/episodes/WatchTime',ensureAuth , watchingEpisodeController.getAllWatchingEpisode);

router.get('/episodes/:id', episodeController.show);
router.put('/episodes/:id', episodeController.update);
router.delete('/episodes/:id', episodeController.delete);

router.get('/watching', ensureAuth, userController.getListWatching);

router.post('/episodes/:id/WatchTime',ensureAuth , watchingEpisodeController.addWatchingEpisode);
router.get('/episodes/:id/Watching',ensureAuth , watchingEpisodeController.getByIdWatchingEpisode);
router.put('/episodes/:id/WatchTime',ensureAuth , watchingEpisodeController.updateWatchingEpisode);
router.delete('/episodes/:id/WatchTime',ensureAuth , watchingEpisodeController.deleteWatchEpisode);


export { router };