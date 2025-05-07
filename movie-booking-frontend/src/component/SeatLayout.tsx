

import React from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';

interface SeatLayoutProps {
  selectedSeats: number[];
  totalSeats: number;
  handleSeatClick: (seatNumber: number) => void;
  bookedSeats: number[]; // To pass booked seats
}

const SeatLayout: React.FC<SeatLayoutProps> = ({
  selectedSeats = [], // Default value to ensure selectedSeats is always an array
  totalSeats,
  handleSeatClick,
  bookedSeats = [], // Default value to ensure bookedSeats is always an array
}) => {
  const PRICE_PER_SEAT = 150; // Adjust the price here

  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  const totalPrice = selectedSeats.length * PRICE_PER_SEAT;

  return (
    <TooltipProvider>
      <Card className="p-6 shadow-lg border-slate-200">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Select Your Seats</h2>
          <p className="text-slate-500 text-sm">Click on a seat to select or deselect it</p>
        </div>

        {/* Seats Grid */}
        <div className="grid grid-cols-10 gap-3 justify-center mb-6">
          {seats.map((seat) => (
            <Tooltip key={seat}>
              <TooltipTrigger asChild>
                <button
                  className={`flex items-center justify-center w-10 h-10 text-xs font-semibold border rounded transition-all
                    ${bookedSeats.includes(seat) 
                      ? 'bg-red-500 border-red-600 text-white cursor-not-allowed' // Booked seat styling (disabled)
                      : selectedSeats.includes(seat)
                      ? 'bg-emerald-500 border-emerald-600 text-white scale-105'
                      : 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:scale-105'
                    }`}
                  onClick={() => !bookedSeats.includes(seat) && handleSeatClick(seat)} // Prevent clicking on booked seats
                  aria-label={`Seat ${seat}`}
                  disabled={bookedSeats.includes(seat)} // Disable booked seats
                >
                  {seat}
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                <p>Seat {seat}</p>
                <p>₹{PRICE_PER_SEAT}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-4">
          <div>
            <span className="font-medium">{selectedSeats.length}</span> seat(s) selected
          </div>
          <div className="text-xl font-bold">₹{totalPrice}</div>
        </div>

        {/* Selected Seats Badges */}
        {selectedSeats.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedSeats.map((seat) => (
              <Badge key={seat} variant="outline">
                Seat no {seat}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </TooltipProvider>
  );
};

export default SeatLayout;
