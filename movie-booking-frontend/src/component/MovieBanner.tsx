import { Clock, Calendar, Star, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

interface MovieBannerProps {
  movieDetails: {
    title: string;
    posterUrl: string;
    genre?: string;
    duration?: string | number;
    releaseDate?: string;
    rating?: number;
    director?: string;
  };
  onShowInfo: () => void;
}

const MovieBanner = ({ movieDetails, onShowInfo }: MovieBannerProps) => {
  // Format release date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Date unavailable';
    }
  };

  // Format duration
  const formatDuration = (duration: string | number | undefined) => {
    if (!duration) return 'Duration N/A';
    
    if (typeof duration === 'number') {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours}h ${minutes}m`;
    }
    
    return duration;
  };

  return (
    <div className="relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
      
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30" 
        style={{ 
          backgroundImage: `url(${movieDetails.posterUrl})`,
          backgroundPosition: 'center 20%',
          filter: 'blur(8px)'
        }}
      />
      
      <div className="container mx-auto relative z-10 px-4 pt-16 pb-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Movie poster */}
          <div className="w-full md:w-64 overflow-hidden rounded-lg shadow-xl">
            <img 
              src={movieDetails.posterUrl} 
              alt={movieDetails.title}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Movie info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movieDetails.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {movieDetails.rating && (
                <Badge variant="outline" className="flex items-center gap-1 border-amber-400/30 bg-amber-400/10">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-amber-400 font-medium">{movieDetails.rating.toFixed(1)}</span>
                </Badge>
              )}
              
              {/* {movieDetails.genre && (
                <Badge variant="outline" className="border-primary/30 bg-primary/10">
                  {movieDetails.genre.split(',')[0]}
                </Badge>
              )} */}
              
              {movieDetails.duration && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(movieDetails.duration)}
                </div>
              )}
              
              {movieDetails.releaseDate && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(movieDetails.releaseDate)}
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShowInfo}
              className="mb-4"
            >
              <Info className="h-4 w-4 mr-2" />
              More Info
            </Button>
            
            {movieDetails.director && (
              <p className="text-sm text-muted-foreground mt-2">
                <span className="font-medium">Director:</span> {movieDetails.director}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieBanner;