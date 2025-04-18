// MovieDetailsDialog.tsx
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '../../components/ui/dialog';
import { Button } from '../components/ui/button';
import { StarIcon, CalendarIcon, Clock } from 'lucide-react';

interface MovieDetails {
  title?: string;
  posterUrl?: string;
  genre?: string;
  description?: string;
  rating?: number;
  showTime?: string;
  ticketPrice?: number;
  releaseDate?: string;
  duration?: string;
  director?: string;
  cast?: string[];
}

// interface MovieDetailsDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   movieDetails: MovieDetails | null;
// }

interface MovieDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movieDetails?: MovieDetails | null;
}


const MovieDetailsDialog: React.FC<MovieDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  movieDetails 
}) => {
  if (!movieDetails) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{movieDetails.title || ""}</DialogTitle>
          <DialogDescription>{movieDetails.description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <div className="rounded-md overflow-hidden shadow-md">
            {movieDetails.posterUrl ? (
              <img 
                src={movieDetails.posterUrl} 
                alt={movieDetails.title || "Movie poster"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No poster</span>
              </div>
            )}
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Directoeer</h4>
              <p>{movieDetails.director}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Cast</h4>
              <p>{movieDetails.cast?.join(', ')}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <StarIcon className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <StarIcon className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <StarIcon className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <StarIcon className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <StarIcon className="w-5 h-5 text-muted stroke-muted-foreground" />
              </div>
              <span className="text-sm font-medium">4.0/5</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                <CalendarIcon className="w-3 h-3" />
                <span>2023</span>
              </div>
              <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                <span>2h 35m</span>
              </div>
              {movieDetails.genre?.split(',').map((genre, index) => (
                <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                  {genre.trim()}
                </span>
              ))}
            </div>
            
            <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
              <p>{movieDetails.description || 'No description available.'}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MovieDetailsDialog;
