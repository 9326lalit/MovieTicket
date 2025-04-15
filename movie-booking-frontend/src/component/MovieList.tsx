
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MovieCard from "./MovieCard";
import { Button } from "../components/ui/button";

interface Movie {
  _id?: string;
  title: string;
  description: string;
  posterUrl?: string;
  rating: number;
  showTime: string;
  ticketPrice: number;
  genre: string;
}

const genres = ["All", "Action", "Horror", "Drama", "Sci-Fi"];

const MovieList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/getall`);
        setMovies(res.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (movie: Movie) => {
    if (!movie._id) return;
    navigate(`/movie/${movie._id}`);
  };

  const filteredMovies =
    selectedGenre === "All"
      ? movies
      : movies.filter((movie) => movie.genre === selectedGenre);

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">🎬 Now Showing</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenre === genre ? "default" : "outline"}
            onClick={() => setSelectedGenre(genre)}
            className="capitalize"
          >
            {genre}
          </Button>
        ))}
      </div>

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie, idx) => (
              <MovieCard key={idx} movie={movie} onClick={() => handleMovieClick(movie)} />

            
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          No movies available in this category.
        </div>
      )}
    </div>
  );
};

export default MovieList;
