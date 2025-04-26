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
  handleSeatClick: (seatNumber: number) => void;
}

const SeatLayout: React.FC<SeatLayoutProps> = ({
  selectedSeats,
  handleSeatClick,
}) => {
  const totalSeats = 90;
  const PRICE_PER_SEAT = 120; // Adjust the price here

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
                    ${selectedSeats.includes(seat)
                      ? 'bg-emerald-500 border-emerald-600 text-white scale-105'
                      : 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:scale-105'
                    }`}
                  onClick={() => handleSeatClick(seat)}
                  aria-label={`Seat ${seat}`}
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
                Seat {seat}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </TooltipProvider>
  );
};

export default SeatLayout;











// import React, { useState, useEffect } from 'react';
// import { Card } from '../components/ui/card';
// import { Badge } from '../components/ui/badge';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
// import { Skeleton } from '../../components/ui/skeleton';

// interface Seat {
//   id: string;
//   row: string;
//   number: number;
//   type: 'standard' | 'premium' | 'vip';
//   price: number;
//   isBooked: boolean;
// }

// interface SeatLayoutProps {
//   initialSeats: Seat[];
//   selectedSeats: Seat[];
//   handleSeatClick: (seat: Seat) => void;
//   showId?: string; // Movie showing ID to check availability
// }

// const SeatLayout: React.FC<SeatLayoutProps> = ({
//   initialSeats,
//   selectedSeats,
//   handleSeatClick,
//   showId = "default-show-id"
// }) => {
//   const [seats, setSeats] = useState<Seat[]>(initialSeats);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch seat availability from API
//   useEffect(() => {
//     const fetchSeatAvailability = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         // Replace with your actual API endpoint
//         const response = await fetch(`/api/showings/${showId}/seats`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch seat availability');
//         }
        
//         const data = await response.json();
        
//         // Update seats with booking status from API
//         const updatedSeats = initialSeats.map(seat => {
//           // Find if this seat is booked in the API response
//           const bookedSeat = data.bookedSeats.find(
//             (bookedSeat: string) => bookedSeat === seat.id
//           );
          
//           return {
//             ...seat,
//             isBooked: !!bookedSeat
//           };
//         });
        
//         setSeats(updatedSeats);
//       } catch (err) {
//         console.error('Error fetching seat availability:', err);
//         setError('Could not load seat availability. Using cached data.');
//         // Fallback to initial seats data
//         setSeats(initialSeats);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSeatAvailability();
    
//     // Optional: Set up polling to refresh seat data periodically
//     const pollingInterval = setInterval(fetchSeatAvailability, 30000); // every 30 seconds
    
//     return () => clearInterval(pollingInterval);
//   }, [showId, initialSeats]);

//   // Group seats by row
//   const seatsByRow = (seats ?? []).reduce<Record<string, Seat[]>>((acc, seat) => {
//     if (!acc[seat.row]) {
//       acc[seat.row] = [];
//     }
//     acc[seat.row].push(seat);
//     return acc;
//   }, {});

//   // Sort rows alphabetically
//   const rows = Object.keys(seatsByRow).sort();

//   // Total price calculation
//   const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

//   // Real-time check if a seat can be selected (not booked and not locked by another user)
//   const isSeatSelectable = (seat: Seat) => {
//     return !seat.isBooked;
//   };

//   return (
//     <TooltipProvider>
//       <Card className="p-6 shadow-lg border-slate-200">
//         <div className="flex flex-col items-center space-y-8">
//           {/* Title */}
//           <div className="text-center">
//             <h2 className="text-2xl font-bold text-slate-800">Select Your Seats</h2>
//             <p className="text-slate-500 text-sm">Click on a seat to select or deselect it</p>
            
//             {error && (
//               <p className="text-red-500 text-xs mt-1">{error}</p>
//             )}
//           </div>
          
//           {/* Main seat layout with curved effect */}
//           <div className="w-full overflow-auto py-6">
//             {loading ? (
//               // Loading state
//               <div className="space-y-2">
//                 {[1, 2, 3, 4, 5].map(row => (
//                   <div key={row} className="flex items-center">
//                     <Skeleton className="w-8 h-6 mr-3" />
//                     <div className="flex gap-1">
//                       {Array(row + 10).fill(0).map((_, i) => (
//                         <Skeleton key={i} className="w-8 h-8" />
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               // Seats layout
//               <div className="flex flex-col items-center">
//                 {rows.map((row, rowIndex) => {
//                   // Calculate spacing for aisles and curved effect
//                   const rowPadding = rowIndex * 4; // Increasing padding for back rows
                  
//                   return (
//                     <div 
//                       key={row}
//                       className="flex items-center my-1.5"
//                       style={{
//                         paddingLeft: `${rowPadding}px`,
//                         paddingRight: `${rowPadding}px`
//                       }}
//                     >
//                       {/* Row indicator */}
//                       <div className="w-8 mr-3 text-right">
//                         <Badge variant="outline" className="font-bold text-slate-700">{row}</Badge>
//                       </div>
                      
//                       {/* Seats in this row */}
//                       <div className="flex gap-1">
//                         {seatsByRow[row]
//                           .sort((a, b) => a.number - b.number)
//                           .map((seat, seatIndex) => {
//                             // Create gaps for aisles
//                             const isAisle = seat.number % 4 === 0 && seat.number !== seatsByRow[row].length;

//                             // Determine seat styling based on type and status
//                             let seatClassName = "flex items-center justify-center w-8 h-8 border-2 rounded-t-lg shadow transition-all duration-150";
//                             let textColor = "text-xs font-semibold";
                            
//                             // Selected state
//                             if (selectedSeats.some(s => s.id === seat.id)) {
//                               seatClassName += " border-emerald-600 shadow-emerald-200 scale-105 z-10";
//                               textColor = "text-white font-bold";
                              
//                               switch (seat.type) {
//                                 case 'standard':
//                                   seatClassName += " bg-emerald-500";
//                                   break;
//                                 case 'premium':
//                                   seatClassName += " bg-emerald-600";
//                                   break;
//                                 case 'vip':
//                                   seatClassName += " bg-emerald-700";
//                                   break;
//                               }
//                             } 
//                             // Booked state
//                             else if (seat.isBooked) {
//                               seatClassName += " bg-gray-300 border-gray-400 opacity-50 cursor-not-allowed";
//                             } 
//                             // Available state based on type
//                             else {
//                               switch (seat.type) {
//                                 case 'standard':
//                                   seatClassName += " bg-blue-50 border-blue-200 hover:bg-blue-100";
//                                   break;
//                                 case 'premium':
//                                   seatClassName += " bg-amber-50 border-amber-200 hover:bg-amber-100";
//                                   break;
//                                 case 'vip':
//                                   seatClassName += " bg-purple-50 border-purple-200 hover:bg-purple-100";
//                                   break;
//                               }
//                               seatClassName += " hover:scale-105 hover:shadow-md";
//                             }

//                             return (
//                               <React.Fragment key={seat.id}>
//                                 <Tooltip>
//                                   <TooltipTrigger asChild>
//                                     <button
//                                       className={seatClassName}
//                                       disabled={!isSeatSelectable(seat)}
//                                       onClick={() => handleSeatClick(seat)}
//                                       aria-label={`${seat.row}${seat.number} - ${seat.type} - $${seat.price}`}
//                                     >
//                                       <span className={textColor}>{seat.number}</span>
//                                     </button>
//                                   </TooltipTrigger>
//                                   <TooltipContent className="text-xs">
//                                     <p>Seat {seat.row}{seat.number}</p>
//                                     <p className="capitalize">{seat.type} - ${seat.price}</p>
//                                     {seat.isBooked && <p className="text-red-500">Already booked</p>}
//                                   </TooltipContent>
//                                 </Tooltip>
                                
//                                 {/* Add space after every 4th seat for an aisle */}
//                                 {isAisle && <div className="w-3" />}
//                               </React.Fragment>
//                             );
//                           })}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
          
//           {/* Selected seats summary */}
//           <div className="w-full border-t border-gray-200 pt-4">
//             <div className="flex justify-between items-center">
//               <p className="text-slate-600">
//                 <span className="font-medium">{selectedSeats.length}</span> {selectedSeats.length === 1 ? 'seat' : 'seats'} selected
//               </p>
//               <p className="text-xl font-bold text-slate-800">
//                 ${totalPrice.toFixed(2)}
//               </p>
//             </div>
            
//             {/* Show selected seats */}
//             {selectedSeats.length > 0 && (
//               <div className="flex flex-wrap gap-2 mt-3">
//                 {selectedSeats.map(seat => (
//                   <Badge key={seat.id} variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
//                     {seat.row}{seat.number}
//                   </Badge>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           {/* Seat type indicators */}
//           <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 w-full">
//             <div className="flex items-center gap-1">
//               <div className="w-4 h-4 rounded-sm bg-blue-50 border border-blue-200" />
//               <span>Standard ($120)</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-4 h-4 rounded-sm bg-amber-50 border border-amber-200" />
//               <span>Premium ($180)</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-4 h-4 rounded-sm bg-purple-50 border border-purple-200" />
//               <span>VIP ($220)</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-4 h-4 rounded-sm bg-gray-300 border border-gray-400 opacity-50" />
//               <span>Unavailable</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-4 h-4 rounded-sm bg-emerald-500 border border-emerald-600" />
//               <span>Selected</span>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </TooltipProvider>
//   );
// };

// export default SeatLayout;