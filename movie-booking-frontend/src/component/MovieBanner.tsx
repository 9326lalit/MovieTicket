import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Button } from '../components/ui/button';

interface MovieDetails {
  title: string;
  posterUrl?: string;
  genre: string;
  description: string;
  releaseDate: string; // ISO format
  duration?: string | number;
  rating: number;
}

interface MovieBannerProps {
  movieDetails: MovieDetails | null;
  onShowInfo: () => void;
}

const MovieBanner: React.FC<MovieBannerProps> = ({ movieDetails, onShowInfo }) => {
  if (!movieDetails) return null;

  const {
    title,
    posterUrl,
    genre,
    description,
    releaseDate,
    duration,
    rating,
  } = movieDetails;

  return (
    <section className="w-full bg-gradient-to-b from-primary/10 to-background py-6">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        
        {/* Movie Poster */}
        <div className="w-36 h-52 sm:w-40 sm:h-60 rounded-md overflow-hidden shadow-md border bg-muted flex-shrink-0">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${title} Poster`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
              No poster
            </div>
          )}
        </div>

        {/* Movie Details */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

          <div className="text-sm text-foreground space-y-1">
            <div><strong>Genre:</strong> {genre}</div>
            <div><strong>Release:</strong> {new Date(releaseDate).toLocaleDateString()}</div>
            {duration && <div><strong>Duration:</strong> {duration} mins</div>}
            <div><strong>Rating:</strong> {rating}/10</div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mt-3 text-primary border-primary"
            onClick={onShowInfo}
          >
            <InfoIcon className="h-4 w-4 mr-2" />
            More Details
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MovieBanner;
