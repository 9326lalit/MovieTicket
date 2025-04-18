


// MovieBanner.tsx
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Button } from '../components/ui/button';

interface MovieDetails {
  title: string;
  posterUrl: string;
  genre: string;
  description: string;
  releaseDate: string; // ISO format
  duration?: string | number;
  rating: number;      // e.g. 7.5
  director: string;
  cast: string[];
}

interface MovieBannerProps {
  movieDetails: MovieDetails | null;
  onShowInfo: () => void;
}

const MovieBanner: React.FC<MovieBannerProps> = ({ movieDetails, onShowInfo }) => {
  if (!movieDetails) return null;

  return (
    <div className="w-full bg-gradient-to-b from-primary/10 to-background relative">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-36 h-52 rounded-md overflow-hidden shadow-lg flex-shrink-0">
          {movieDetails.posterUrl ? (
            <img 
              src={movieDetails.posterUrl || "https://tse3.mm.bing.net/th?id=OIP.nJ9vpUZxs9Sj3NGhksv3cgHaNK&pid=Api&P=0&h=220"} 
              alt={movieDetails.title || "Moviesss poster"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No poster</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{movieDetails.title}</h1>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{movieDetails.description}</h1>


          {movieDetails.genre && (
            <div className="text-sm text-muted-foreground mb-1">{movieDetails.genre}</div>
          )}
          {movieDetails.director && (
            <div className="text-sm mb-1"><span className="font-medium">Director:</span> {movieDetails.director}</div>
          )}
          {movieDetails.cast && movieDetails.cast.length > 0 && (
            <div className="text-sm"><span className="font-medium">Cast:</span> {movieDetails.cast.join(', ')}</div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-4 text-primary" 
            onClick={onShowInfo}
          >
            <InfoIcon className="h-4 w-4 mr-1" />
            Movie Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieBanner;