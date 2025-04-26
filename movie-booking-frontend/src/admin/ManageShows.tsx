import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';
import { Edit, Trash2 } from 'lucide-react';

interface Show {
  _id: string;
  movie: { title: string } | null;
  theater: { name: string } | null;
  date: string;
  time: string;
  price: number;
  bookedSeats: string[];
}

const ManageShows: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortType, setSortType] = useState<'date' | 'bookings' | 'price'>('date');

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await axios.get<Show[]>('http://localhost:5000/api/shows/getshow');
        setShows(res.data);
      } catch (err) {
        console.error('Failed to load shows:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this show?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/shows/delete/${id}`);
      setShows((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const sortShows = (shows: Show[], type: 'date' | 'bookings' | 'price') => {
    return shows.sort((a, b) => {
      if (type === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (type === 'bookings') return b.bookedSeats.length - a.bookedSeats.length;
      if (type === 'price') return b.price - a.price;
      return 0;
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.h1
        className="text-4xl font-bold text-center mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🎥 Manage Shows
      </motion.h1>

      <div className="flex justify-center mb-6">
        <select
          className="border px-4 py-2 rounded-md shadow-sm"
          value={sortType}
          onChange={(e) => setSortType(e.target.value as 'date' | 'bookings' | 'price')}
        >
          <option value="date">Sort by Date</option>
          <option value="bookings">Sort by Bookings</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : shows.length === 0 ? (
        <p className="text-center text-gray-500">No shows found.</p>
      ) : (
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortShows(shows, sortType).map((show) => (
              <Card key={show._id} className="shadow-lg hover:shadow-2xl transition-shadow rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {show.movie?.title || 'Untitled Movie'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    🎭 <span className="font-medium">Theater:</span>{' '}
                    {show.theater?.name || 'Unknown'}
                  </p>
                  <Separator />
                  <p>
                    📅 <span className="font-medium">Date:</span>{' '}
                    {new Date(show.date).toLocaleDateString()}
                  </p>
                  <p>
                    🕒 <span className="font-medium">Time:</span> {show.time}
                  </p>
                  <p>
                    💰 <span className="font-medium">Price:</span> ₹{show.price}
                  </p>
                  <p>
                    🎟️ <span className="font-medium">Booked:</span>{' '}
                    {show.bookedSeats.length} seats
                  </p>
                  <p>
                    🆔 <span className="font-medium">Show ID:</span>{' '}
                    {show._id}
                  </p>
                  <Separator />
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(show._id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ManageShows;
