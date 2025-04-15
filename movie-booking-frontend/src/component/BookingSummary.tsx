

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
