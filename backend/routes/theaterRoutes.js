// routes/theaterRoutes.js
import express from 'express';
import { createTheater, getAllTheaters } from '../controllers/theaterController.js';

const router = express.Router();

// Create a theater
router.post('/createtheater', createTheater);

// Get all theaters
router.get('/gettheaters', getAllTheaters);

export default router;
