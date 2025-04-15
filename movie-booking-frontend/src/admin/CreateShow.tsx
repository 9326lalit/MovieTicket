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
  const [screen, setScreen] = useState("");
  const [price, setPrice] = useState("");
  const [showTime, setShowTime] = useState("");
  const [showDate, setShowDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const movieRes = await axios.get("http://localhost:5000/api/movies/getall");
      const theaterRes = await axios.get("http://localhost:5000/api/theaters/gettheaters");

      setMovies(movieRes.data);
      setTheaters(theaterRes.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!selectedMovieId || !selectedTheaterId || !screen || !price || !showTime || !showDate) {
      alert("Please fill all fields");
      return;
    }
  
    try {
      await axios.post("http://localhost:5000/api/shows/createshow", {
        movieId: selectedMovieId,
        theaterId: selectedTheaterId,
        screen,
        price: Number(price),
        showTime,
        showDate: showDate.toISOString(),
      });
  
      alert("Show Created Successfully!");
      setSelectedMovieId("");
      setSelectedTheaterId("");
      setScreen("");
      setPrice("");
      setShowTime("");
      setShowDate(new Date());
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Failed to create show.");
      } else {
        console.error("Unexpected error:", error);
        alert("Failed to create show.");
      }
    }
  };
  

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Show</CardTitle>
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
              <Label>Screen</Label>
              <Input
                type="text"
                placeholder="e.g. Screen 1"
                value={screen}
                onChange={(e) => setScreen(e.target.value)}
              />
            </div>

            <div>
              <Label>Ticket Price</Label>
              <Input
                type="number"
                placeholder="e.g. 250"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <Label>Show Time</Label>
              <Input
                type="time"
                value={showTime}
                onChange={(e) => setShowTime(e.target.value)}
              />
            </div>

            <div>
              <Label>Show Date</Label>
              <Calendar
                mode="single"
                selected={showDate}
                onSelect={setShowDate}
                className="rounded-md border"
              />
              {showDate && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {format(showDate, "PPP")}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Create Show
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateShow;
