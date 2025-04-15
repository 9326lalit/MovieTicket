// import Movie from '../models/Movie.js';
// import { upload } from '../middleware/uploadMiddleware.js'; // Import the upload middleware
// import dotenv from 'dotenv'; // Import dotenv for environment variables
// dotenv.config(); // Load environment variables from .env file




// // Create a new movie



// export const createMovie = async (req, res) => {
//   try {
//     // Use multer to handle the incoming file
//     upload(req, res, async (err) => {
//       if (err) {
//         return res.status(400).json({ msg: 'Error during file upload', error: err.message });
//       }

//       // Extract the movie details from the request body
//       const {
//         title,
//         description,
//         duration,
//         genre,
//         language,
//         releaseDate
//       } = req.body;

//       // Upload the image to Cloudinary if a file is present
//       let posterUrl = '';
//       if (req.file) {
//         const cloudinaryResponse = await uploadToCloudinary(req.file);
//         posterUrl = cloudinaryResponse.secure_url; // This is the URL of the uploaded image
//       }

//       // Create the new movie
//       const newMovie = new Movie({
//         title,
//         description,
//         duration,
//         genre,
//         language,
//         releaseDate,
//         posterUrl, // Save the URL from Cloudinary
//       });

//       // Save the movie to the database
//       const savedMovie = await newMovie.save();
//       return res.status(201).json(savedMovie);
//     });
//   } catch (err) {
//     res.status(500).json({ msg: 'Failed to create movie', error: err.message });
//   }
// };





// // Get all movies
// export const getMovies = async (req, res) => {
//   try {
//     const movies = await Movie.find();
//     res.json(movies);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// // Get a specific movie
// export const getMovieById = async (req, res) => {
//   try {
//     const movie = await Movie.findById(req.params.id);
//     if (!movie) return res.status(404).json({ msg: 'Movie not found' });
//     res.json(movie);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };


import cloudinary from 'cloudinary';
import Movie from '../models/Movie.js'; // Replace with your actual Movie model

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'djmd1lzrl',
  api_key: '652622144813372',
  api_secret: 'V4savK2k_e-2oZUAVyJphQu6-uY',
});

// Create a new movie with file upload
export const createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      genre,
      language,
      releaseDate
    } = req.body;

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.file;

    // Upload the image to Cloudinary
    cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto' }, // Auto detect file type (image, video, etc.)
      async (error, result) => {
        if (error) {
          return res.status(500).json({ msg: 'Error during file upload', error: error.message });
        }

        // Create new movie with the Cloudinary image URL
        const newMovie = new Movie({
          title,
          description,
          duration,
          genre,
          language,
          releaseDate,
          posterUrl: result.secure_url, // Cloudinary URL
        });

        // Save the new movie to the database
        const savedMovie = await newMovie.save();

        // Respond with the saved movie
        res.status(201).json(savedMovie);
      }
    ).end(file.buffer); // Upload the file buffer to Cloudinary
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create movie', error: err.message });
  }
};

// Get all movies
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch movies', error: err.message });
  }
};

// Get a movie by ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch movie', error: err.message });
  }
};
