import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

interface Seat {
  id: string;
  row: string;
  number: number;
  type: string;
  price: number;
  isBooked: boolean;
}

interface Booking {
  _id: string;
  movieTitle: string;
  date: string;
  time: string;
  seats: Seat[];
  totalPrice: number;
  paymentMethod: string;
  cardNumber: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

const AllBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('https://movizonebackend.onrender.com/api/bookings/getallbookings');
        setBookings(res.data.bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-60 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">🎟️ All Movie Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {bookings.map((booking) => (
          <Card key={booking._id} className="rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-indigo-700">{booking.movieTitle}</h2>
                <span className="text-sm text-gray-500">📅 {new Date(booking.createdAt).toLocaleDateString()}</span>
              </div>
              <Separator className="my-2" />
              <div className="text-sm text-gray-700 space-y-1">
                <p>🎬 <span className="font-medium">Show Date:</span> {new Date(booking.date).toLocaleDateString()}</p>
                <p>🕒 <span className="font-medium">Time:</span> {booking.time}</p>
                <p>💳 <span className="font-medium">Payment:</span> {booking.paymentMethod.toUpperCase()}</p>
                <p>💰 <span className="font-medium">Total Price:</span> ₹{booking.totalPrice}</p>
              </div>
              <Separator className="my-2" />
              <div className="space-y-1">
                <p className="font-semibold text-gray-800">🎫 Seats Booked:</p>
                <div className="flex flex-wrap gap-2">
                  {booking.seats.map((seat) => (
                    <Badge key={seat.id} className="bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-md px-3 py-1 text-xs">
                      {seat.row}{seat.number} - {seat.type.charAt(0).toUpperCase() + seat.type.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-gray-800">👤 Booked By:</p>
                <p>🧑 {booking.fullName}</p>
                <p>📧 {booking.email}</p>
                <p>📞 {booking.phone}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllBookings;