// SeatLayout.tsx
import React from 'react';
import { cn } from '../lib/utils';

interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'vip';
  price: number;
  isBooked: boolean;
}

interface SeatLayoutProps {
  seats: Seat[];
  selectedSeats: Seat[];
  handleSeatClick: (seat: Seat) => void;
}

const SeatLayout: React.FC<SeatLayoutProps> = ({ seats, selectedSeats, handleSeatClick }) => {
  // Group seats by row
  const seatsByRow = seats.reduce<Record<string, Seat[]>>((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // Get unique rows and sort them
  const rows = Object.keys(seatsByRow).sort();

  // Function to determine seat color based on type and status
  const getSeatColor = (seat: Seat) => {
    if (seat.isBooked) {
      return 'bg-gray-300 cursor-not-allowed opacity-50';
    }
    
    if (selectedSeats.some(s => s.id === seat.id)) {
      return 'bg-primary text-primary-foreground border-primary-foreground';
    }
    
    switch (seat.type) {
      case 'standard':
        return 'bg-blue-100 border-blue-200 hover:bg-blue-200';
      case 'premium':
        return 'bg-amber-100 border-amber-200 hover:bg-amber-200';
      case 'vip':
        return 'bg-purple-100 border-purple-200 hover:bg-purple-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 overflow-x-auto">
      {rows.map((row) => (
        <div key={row} className="flex items-center">
          <div className="w-6 text-center font-medium text-sm mr-3">{row}</div>
          <h3>Seat Layout</h3>
          <div className="flex space-x-2">
            {seatsByRow[row].sort((a, b) => a.number - b.number).map((seat) => (
              <button
                key={seat.id}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-sm border text-xs font-medium transition-colors",
                  getSeatColor(seat)
                )}
                disabled={seat.isBooked}
                onClick={() => handleSeatClick(seat)}
                title={`${seat.row}${seat.number} - ${seat.type} - $${seat.price}`}
              >
                {seat.number}
              </button>
            ))}
          </div>
        </div>
      ))}
      
      <div className="mt-4 w-full flex justify-center">
        <span className="text-sm text-muted-foreground">
          {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} selected
        </span>
      </div>
    </div>
  );
};

export default SeatLayout;