import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";

interface Movie {
  _id: string;
  title: string;
}

interface Theater {
  _id: string;
  name: string;
}

const CreateShow: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedTheaterId, setSelectedTheaterId] = useState("");
  const [price, setPrice] = useState("");
  const [showTimes, setShowTimes] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState("");
  const [showDate, setShowDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const movieRes = await axios.get(`http://localhost:5000/api/movies/getall`);
      const theaterRes = await axios.get("http://localhost:5000/api/theaters/gettheaters");
      setMovies(movieRes.data);
      setTheaters(theaterRes.data);
    };
    fetchData();
  }, []);

  const addShowTime = () => {
    if (currentTime && !showTimes.includes(currentTime)) {
      setShowTimes((prev) => [...prev, currentTime]);
      setCurrentTime("");
    }
  };

  const removeShowTime = (time: string) => {
    setShowTimes((prev) => prev.filter((t) => t !== time));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovieId || !selectedTheaterId || !showDate || !price || showTimes.length === 0) {
      alert("Please fill all fields and add at least one time slot.");
      return;
    }

    try {
      const formattedDate = format(showDate, "yyyy-MM-dd");

      const requests = showTimes.map((time) =>
        axios.post("http://localhost:5000/api/shows/createshow", {
          movieId: selectedMovieId,
          theaterId: selectedTheaterId,
          date: formattedDate,
          time: time,
          price: price,
        })
      );

      await Promise.all(requests);
      alert("Shows created successfully!");

      // Reset form
      setSelectedMovieId("");
      setSelectedTheaterId("");
      setPrice("");
      setShowTimes([]);
      setShowDate(new Date());
    } catch (error: any) {
      console.error(error);
      alert("Error creating shows. Check console for more info.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Show</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Movie</Label>
              <Select onValueChange={setSelectedMovieId} value={selectedMovieId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie._id} value={movie._id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Theater</Label>
              <Select onValueChange={setSelectedTheaterId} value={selectedTheaterId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a theater" />
                </SelectTrigger>
                <SelectContent>
                  {theaters.map((theater) => (
                    <SelectItem key={theater._id} value={theater._id}>
                      {theater.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ticket Price</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 888"
              />
            </div>

            <div>
              <Label>Show Time</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={currentTime}
                  onChange={(e) => setCurrentTime(e.target.value)}
                />
                <Button type="button" onClick={addShowTime}>
                  Add Time
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {showTimes.map((time, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded">
                    <span>{time}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => removeShowTime(time)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Show Date</Label>
              <Calendar
                mode="single"
                selected={showDate}
                onSelect={setShowDate}
                className="border rounded-md"
              />
              {showDate && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {format(showDate, "PPP")}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Create Shows
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateShow;
