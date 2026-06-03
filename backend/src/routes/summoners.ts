import { Router } from 'express';
import { getAllSummoners, getSummonerByName, searchSummoners } from '../controllers/summonerController';

const router = Router();

router.get('/', getAllSummoners);
router.get('/search', searchSummoners);
router.get('/:name', getSummonerByName);

export default router;
