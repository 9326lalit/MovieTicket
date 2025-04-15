// // src/components/BookingSummary.tsx
// import React from "react";
// import { Button } from "../components/ui/button";
// import { Card, CardContent } from "../components/ui/card";
// import { Badge } from "../components/ui/badge";
// import { Separator } from "../components/ui/separator";

// type BookingSummaryProps = {
//   movieTitle: string;
//   showTime: string;
//   selectedSeats: string[];
//   ticketPrice: number;
//   onCancel: () => void;
//   onConfirm: () => void;
// };

// const BookingSummary: React.FC<BookingSummaryProps> = ({
//   movieTitle,
//   showTime,
//   selectedSeats,
//   ticketPrice,
//   onCancel,
//   onConfirm,
// }) => {
//   const totalPrice = selectedSeats.length * ticketPrice;

//   return (
//     <Card className="max-w-lg w-full bg-white shadow-xl border border-gray-200">
//       <CardContent className="p-6 space-y-4">
//         <h2 className="text-2xl font-bold text-gray-900">🎟️ Booking Summary</h2>

//         <div className="flex items-center gap-4">
//           <img
//             src="https://m.media-amazon.com/images/I/51Z9FtU5HdL._AC_UF894,1000_QL80_.jpg"
//             alt="Movie Poster"
//             className="w-20 h-28 object-cover rounded"
//           />
//           <div>
//             <h3 className="text-lg font-semibold">{movieTitle}</h3>
//             <p className="text-sm text-muted-foreground">{showTime}</p>
//           </div>
//         </div>

//         <Separator />

//         <div className="space-y-2">
//           <h4 className="text-md font-medium">Selected Seats</h4>
//           <div className="flex flex-wrap gap-2">
//             {selectedSeats.length > 0 ? (
//               selectedSeats.map((seat) => (
//                 <Badge key={seat} className="bg-blue-600 text-white">
//                   {seat}
//                 </Badge>
//               ))
//             ) : (
//               <p className="text-sm text-gray-500">No seats selected</p>
//             )}
//           </div>
//         </div>

//         <div className="flex justify-between items-center text-lg font-medium pt-2">
//           <span>Total Price</span>
//           <span className="text-green-600 font-bold">${totalPrice}</span>
//         </div>

//         <div className="flex justify-end gap-4 pt-4">
//           <Button variant="outline" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button onClick={onConfirm} disabled={selectedSeats.length === 0}>
//             Confirm Booking
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default BookingSummary;



import React from 'react';

interface BookingSummaryProps {
  selectedSeats: string[];
  show: {
    movie: { title: string };
    theater: { name: string };
    date: string;
    time: string;
  };
  totalAmount: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ selectedSeats, show, totalAmount }) => {
  return (
    <div>
      <h2>Booking Summary</h2>
      <p>Movie: {show.movie.title}</p>
      <p>Theater: {show.theater.name}</p>
      <p>Date: {show.date}</p>
      <p>Time: {show.time}</p>
      <p>Seats: {selectedSeats.join(', ')}</p>
      <p>Total: ${totalAmount}</p>
    </div>
  );
};

export default BookingSummary;
