import { Router } from 'express';
import { getMatchById, getRecentMatches } from '../controllers/matchController';

const router = Router();

router.get('/recent', getRecentMatches);
router.get('/:id', getMatchById);

export default router;
