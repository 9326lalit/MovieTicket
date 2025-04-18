

// BookingSummary.tsx
import React from 'react';
import { format } from 'date-fns';
import { Button } from '../components/ui/button';
import { TicketIcon, Calendar, Clock, MapPin } from 'lucide-react';

interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'vip';
  price: number;
  isBooked: boolean;
}

interface MovieDetails {
  title?: string;
  posterUrl?: string;
  genre?: string;
  director?: string;
  cast?: string[];
}

interface BookingSummaryProps {
  movieDetails: MovieDetails | null;
  selectedDate: Date;
  selectedTime: string | null;
  selectedTheater: string | null;
  selectedSeats: Seat[];
  isBookingConfirming: boolean;
  handleConfirmBooking: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  movieDetails,
  selectedDate,
  selectedTime,
  selectedTheater,
  selectedSeats,
  isBookingConfirming,
  handleConfirmBooking
}) => {
  // Calculate total price
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  
  // Group selected seats by type
  const seatsByType = selectedSeats.reduce<Record<string, Seat[]>>((acc, seat) => {
    if (!acc[seat.type]) {
      acc[seat.type] = [];
    }
    acc[seat.type].push(seat);
    return acc;
  }, {});

  return (
    <div className="bg-muted/20 rounded-lg border p-4">
      <h3 className="font-medium text-lg mb-4">Booking Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="text-sm font-medium">{movieDetails?.title}</div>
        
        <div className="flex items-start gap-2 text-sm">
          <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        
        {selectedTime && (
          <div className="flex items-start gap-2 text-sm">
            <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <span>{selectedTime}</span>
          </div>
        )}
        
        {selectedTheater && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <span>{selectedTheater}</span>
          </div>
        )}
      </div>
      
      {selectedSeats.length > 0 && (
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium">Selected Seats</h4>
          
          <div className="space-y-2">
            {Object.entries(seatsByType).map(([type, seats]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="capitalize">
                  {type} ({seats.length}) - {seats.map(s => s.id).join(', ')}
                </span>
                <span>${seats.reduce((sum, seat) => sum + seat.price, 0)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>
      )}
      
      <Button 
        className="w-full" 
        onClick={handleConfirmBooking}
        disabled={selectedSeats.length === 0 || isBookingConfirming}
      >
        {isBookingConfirming ? (
          <>
            <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Processing
          </>
        ) : (
          <>
            <TicketIcon className="h-4 w-4 mr-2" />
            {selectedSeats.length > 0 ? `Book ${selectedSeats.length} Seats` : 'Select Seats'}
          </>
        )}
      </Button>
    </div>
  );
};

export default BookingSummary;