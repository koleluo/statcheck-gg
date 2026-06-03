import { Router } from 'express';
import { getAllChampions, getChampionById } from '../controllers/championController';

const router = Router();

router.get('/', getAllChampions);
router.get('/:id', getChampionById);

export default router;
