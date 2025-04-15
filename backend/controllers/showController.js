import Show from '../models/Show.js';
import Movie from '../models/Movie.js';
import Theater from '../models/Theater.js';

// Get all shows
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find().populate('movie theater');
    res.json(shows);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create a new show
export const createShow = async (req, res) => {
  const { movieId, theaterId, date, time, price } = req.body;

  const movie = await Movie.findById(movieId);
  const theater = await Theater.findById(theaterId);

  console.log(movie, theater);


  if (!movie || !theater) return res.status(404).json({ msg: 'Movie or Theater not found' });
  const show = new Show({
    movie: movieId,
    theater: theaterId,
    date,
    time,
    price,
    bookedSeats: [],
  });

  try {
    await show.save();
    res.json(show);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


// Get shows by movie ID
export const getShowsByMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const shows = await Show.find({ movie: movieId })
      .populate("movie", "title image") // only specific movie fields
      .populate("theater", "name location");

    if (!shows.length) {
      return res.status(404).json({ msg: "No shows found for this movie" });
    }

    res.json(shows);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
