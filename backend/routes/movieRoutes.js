// import express from 'express';
// import { getMovies, getMovieById,createMovie } from '../controllers/movieController.js';
// import multer from 'multer';
// import cloudinary from 'cloudinary';
// const router = express.Router();

// // Initialize multer storage for file upload
// const storage = multer.memoryStorage();  // Store file in memory
// const upload = multer({ storage });


// router.post('/create',upload.single('poster'), createMovie);
// router.get('/getall', getMovies);
// router.get('/:id', getMovieById);

// export default router;



import express from 'express';
import multer from 'multer';
import { createMovie, getMovies, getMovieById } from '../controllers/movieController.js';

// Set up multer for file upload
const storage = multer.memoryStorage(); // Store file in memory temporarily
const upload = multer({ storage });

// Initialize the router
const router = express.Router();

// Route to create a movie with file upload
router.post('/create', upload.single('poster'), createMovie);

// Route to get all movies
router.get('/getall', getMovies);

// Route to get a movie by ID
router.get('/:id', getMovieById);

export default router;
