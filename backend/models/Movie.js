import mongoose from 'mongoose';
const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: Number,
  posterUrl: String,
  language: String,
  genre: [String],
  releaseDate: Date
});
const Movie = mongoose.model('Movie', movieSchema);
export default Movie;