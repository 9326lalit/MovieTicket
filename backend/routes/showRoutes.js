import express from 'express';
import { getShows, createShow,getShowsByMovie } from '../controllers/showController.js';

const router = express.Router();

router.get('/getshow', getShows);
router.post('/createshow', createShow);
router.get('/movie/:movieId', getShowsByMovie);


export default router;
