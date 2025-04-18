import { useState } from 'react';
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { Movie } from '../types/Movie';
import { Calendar, Clock, Heart, Info, Star, Ticket } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Coming Soon';

  return (
    <TooltipProvider>
      <Card 
        className="overflow-hidden transition-all duration-300 hover:shadow-xl bg-card w-full max-w-xs border-0 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-white">
          {/* Movie Poster */}
          {movie.posterUrl ? (
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className={`h-full w-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105 opacity-95' : 'scale-100'}`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
              <Info className="h-16 w-16 text-gray-600" />
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="secondary" className="rounded-md flex items-center gap-1 bg-black/60 backdrop-blur-sm border-yellow-500/50">
              <Star className="fill-yellow-500 stroke-yellow-500 h-3 w-3" />
              <span className="text-yellow-500">{movie.rating || '8.5'}</span>
            </Badge>
          </div>
          
          {/* Genre Badge */}
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="outline" className="rounded-md bg-black/60 backdrop-blur-sm border-primary/50 text-primary">
              {movie.genre}
            </Badge>
          </div>
          
          {/* Quick Actions - Visible on Hover */}
          <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full bg-black/60 backdrop-blur-sm hover:bg-primary/80">
                  <Heart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to Favorites</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full bg-black/60 backdrop-blur-sm hover:bg-primary/80">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More Info</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <h3 className="font-bold text-lg text-white line-clamp-1">{movie.title}</h3>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          {/* Movie Info */}
          <div className="flex items-center justify-between text-xs text-black">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{movie.duration || '2h 15m'}</span>
            </div>
            <div className="flex items-center gap-1 ">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {movie.description}
          </p>
          
          {/* Show Times Preview */}
          <div className="flex flex-wrap gap-1">
            {movie.showTimes?.length ? (
              movie.showTimes.map((time, index) => (
                <Badge 
                  key={index} 
                  variant={index === 2 ? "secondary" : "outline"} 
                  className={`rounded-sm text-xs ${index === 2 ? 'bg-primary/20 text-primary' : 'hover:bg-accent'}`}
                >
                  {time}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">Check date click on Book Now...</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={onClick} 
            className="w-full gap-2"
            variant="default"
          >
            <Ticket className="h-4 w-4" />
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default MovieCard;
