import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams, useNavigate } from "react-router-dom";

interface Show {
  _id: string;
  date: string;
  time: string;
  price: number;
  bookedSeats: string[];
  movie: {
    title: string;
    description: string;
    posterUrl: string;
    rating: string;
    duration: number;
  };
  theater: {
    name: string;
    location: string;
  };
}

const SeatSelector: React.FC = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/shows/movie/${movieId}`);
        setShows(res.data);
        if (res.data.length > 0) {
          setMovieDetails(res.data[0].movie);
        }
      } catch (err) {
        console.error("Error fetching shows", err);
      }
    };
    fetchShows();
  }, [movieId]);

  useEffect(() => {
    // const formattedDate = selectedDate.toISOString().split("T")[0];
    const formattedDate = selectedDate.toLocaleDateString('en-CA'); // ensures YYYY-MM-DD in local time
    const matchedShows = shows.filter(show => show.date === formattedDate);
    const allTimes = matchedShows.flatMap(show => show.time.split(",").map(t => t.trim()));
    setAvailableTimes(allTimes);
    setSelectedTime(null);
  }, [selectedDate, shows]);

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  const handleSeatClick = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleConfirmClick = () => {
    // Navigate to the payment page and pass booking details
    navigate("/payment", {
      state: {
        movie: movieDetails,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * 10 // Assuming price per seat is 10 for example
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div
        className="w-full h-[400px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${movieDetails?.posterUrl || "https://via.placeholder.com/1500"})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-4xl text-white font-bold">
          {movieDetails?.title || "Loading..."}
        </div>
      </div>

      {movieDetails && (
        <div className="text-center my-6 px-4">
          <p className="text-xl">{movieDetails.description}</p>
          <p className="text-md mt-2">
            ⭐ Rating: {movieDetails.rating} | ⏱ Duration: {movieDetails.duration} mins
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-semibold mb-4">📅 Choose Date</h2>
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            className="rounded-lg overflow-hidden"
          />
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">⏰ Time Slots</h2>
            {availableTimes.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {availableTimes.map((time, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTimeClick(time)}
                    className={`px-5 py-2 rounded-md border font-medium text-lg transition-all ${
                      selectedTime === time
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-black hover:bg-blue-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-black-400">No shows available on this <strong>date.</strong>Choose another date please</p>
            )}
          </div>
        </div>

        <div>
          {selectedTime ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">🎬 Seat Layout</h2>

              <div className="mb-8 text-center">
                <h3 className="text-xl font-bold text-gray-300">🎥 SCREEN</h3>
                <div className="bg-white h-1 my-3 w-3/4 mx-auto"></div>
              </div>

              <div className="grid grid-cols-6 gap-3 justify-items-center">
                {Array.from({ length: 36 }, (_, idx) => {
                  const seatNumber = (idx + 1).toString();
                  const isBooked = Math.random() > 0.7;
                  const isSelected = selectedSeats.includes(seatNumber);
                  return (
                    <button
                      key={seatNumber}
                      onClick={() => !isBooked && handleSeatClick(seatNumber)}
                      className={`w-12 h-12 rounded-md font-semibold transition-all ${
                        isBooked
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-green-500 hover:bg-green-700"
                      }`}
                      disabled={isBooked}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>

              {selectedSeats.length > 0 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleConfirmClick}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-400 mt-10">
              Please select a date and time to view available seats.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
