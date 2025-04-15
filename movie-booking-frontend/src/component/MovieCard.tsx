import { Movie } from '../types/Movie';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
      <img src={movie.posterUrl} alt={movie.title} style={{ width: '200px' }} />
      <h3 className="text-xl font-semibold">{movie.title}</h3>
      <p className="text-sm text-gray-500 mb-2">{movie.genre}</p>
      <p className="text-sm">{movie.description}</p>
      <button
        onClick={onClick}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Book Now
      </button>
    </div>
  );
};

export default MovieCard;
