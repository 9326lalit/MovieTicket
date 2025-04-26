import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, isAfter, startOfDay, parseISO } from 'date-fns';
import { CalendarIcon, Clock, MapPin, TicketIcon, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';

// Components
import MovieBanner from "./MovieBanner";
import BookingProgress from "./BookingProgress";
import DateSelector from "./DateSelector";
import TheaterSelector from "./TheaterSelector";
import TimeSelector from "./TimeSelector";
import SeatLayout from "./SeatLayout";
import BookingSummary from "./BookingSummary";
import MovieDetailsDialog from "./MovieDetailsDialog";

interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'vip';
  price: number;
  isBooked: boolean;
}

interface Show {
  _id: string;
  date: string;
  time: string;
  theater: {
    _id: string;
    name: string;
  };
  bookedSeats: string[];
  movie: {
    title: string;
    posterUrl: string;
    genre: string;
    description: string;
    releaseDate: string;
    duration: string;
    rating: number;
    director: string;
    cast: string[];
  };
}

interface MovieDetails {
  title: string;
  posterUrl: string;
  genre: string;
  description: string;
  releaseDate: string; // ISO format
  duration?: string | number;
  rating: number;      // e.g. 7.5
  director: string;
  cast: string[];
}


const SeatSelector = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  // Expanded dummySeats array with realistic theater layout
const dummySeats = [
  // Row A (Front Row)
  { id: 'A1', row: 'A', number: 1, type: 'standard', price: 120, isBooked: true },
  { id: 'A2', row: 'A', number: 2, type: 'standard', price: 120, isBooked: false },
  { id: 'A3', row: 'A', number: 3, type: 'standard', price: 120, isBooked: false },
  { id: 'A4', row: 'A', number: 4, type: 'standard', price: 120, isBooked: true },
  { id: 'A5', row: 'A', number: 5, type: 'premium', price: 180, isBooked: false },
  { id: 'A6', row: 'A', number: 6, type: 'premium', price: 180, isBooked: false },
  { id: 'A7', row: 'A', number: 7, type: 'premium', price: 180, isBooked: true },
  { id: 'A8', row: 'A', number: 8, type: 'premium', price: 180, isBooked: false },
  { id: 'A9', row: 'A', number: 9, type: 'standard', price: 120, isBooked: false },
  { id: 'A10', row: 'A', number: 10, type: 'standard', price: 120, isBooked: false },
  { id: 'A11', row: 'A', number: 11, type: 'standard', price: 120, isBooked: true },
  { id: 'A12', row: 'A', number: 12, type: 'standard', price: 120, isBooked: false },
  
  // Row B
  { id: 'B1', row: 'B', number: 1, type: 'standard', price: 120, isBooked: false },
  { id: 'B2', row: 'B', number: 2, type: 'standard', price: 120, isBooked: true },
  { id: 'B3', row: 'B', number: 3, type: 'standard', price: 120, isBooked: false },
  { id: 'B4', row: 'B', number: 4, type: 'premium', price: 180, isBooked: false },
  { id: 'B5', row: 'B', number: 5, type: 'premium', price: 180, isBooked: true },
  { id: 'B6', row: 'B', number: 6, type: 'vip', price: 220, isBooked: false },
  { id: 'B7', row: 'B', number: 7, type: 'vip', price: 220, isBooked: false },
  { id: 'B8', row: 'B', number: 8, type: 'vip', price: 220, isBooked: false },
  { id: 'B9', row: 'B', number: 9, type: 'vip', price: 220, isBooked: true },
  { id: 'B10', row: 'B', number: 10, type: 'premium', price: 180, isBooked: false },
  { id: 'B11', row: 'B', number: 11, type: 'premium', price: 180, isBooked: false },
  { id: 'B12', row: 'B', number: 12, type: 'standard', price: 120, isBooked: true },
  { id: 'B13', row: 'B', number: 13, type: 'standard', price: 120, isBooked: false },
  { id: 'B14', row: 'B', number: 14, type: 'standard', price: 120, isBooked: false },
  
  // Row C
  { id: 'C1', row: 'C', number: 1, type: 'standard', price: 120, isBooked: false },
  { id: 'C2', row: 'C', number: 2, type: 'standard', price: 120, isBooked: false },
  { id: 'C3', row: 'C', number: 3, type: 'standard', price: 120, isBooked: true },
  { id: 'C4', row: 'C', number: 4, type: 'premium', price: 180, isBooked: false },
  { id: 'C5', row: 'C', number: 5, type: 'premium', price: 180, isBooked: false },
  { id: 'C6', row: 'C', number: 6, type: 'vip', price: 220, isBooked: false },
  { id: 'C7', row: 'C', number: 7, type: 'vip', price: 220, isBooked: true },
  { id: 'C8', row: 'C', number: 8, type: 'vip', price: 220, isBooked: false },
  { id: 'C9', row: 'C', number: 9, type: 'vip', price: 220, isBooked: false },
  { id: 'C10', row: 'C', number: 10, type: 'premium', price: 180, isBooked: false },
  { id: 'C11', row: 'C', number: 11, type: 'premium', price: 180, isBooked: true },
  { id: 'C12', row: 'C', number: 12, type: 'standard', price: 120, isBooked: false },
  { id: 'C13', row: 'C', number: 13, type: 'standard', price: 120, isBooked: false },
  { id: 'C14', row: 'C', number: 14, type: 'standard', price: 120, isBooked: true },
  { id: 'C15', row: 'C', number: 15, type: 'standard', price: 120, isBooked: false },
  
  // Row D
  { id: 'D1', row: 'D', number: 1, type: 'standard', price: 120, isBooked: false },
  { id: 'D2', row: 'D', number: 2, type: 'standard', price: 120, isBooked: true },
  { id: 'D3', row: 'D', number: 3, type: 'standard', price: 120, isBooked: false },
  { id: 'D4', row: 'D', number: 4, type: 'standard', price: 120, isBooked: false },
  { id: 'D5', row: 'D', number: 5, type: 'premium', price: 180, isBooked: false },
  { id: 'D6', row: 'D', number: 6, type: 'premium', price: 180, isBooked: true },
  { id: 'D7', row: 'D', number: 7, type: 'premium', price: 180, isBooked: false },
  { id: 'D8', row: 'D', number: 8, type: 'premium', price: 180, isBooked: false },
  { id: 'D9', row: 'D', number: 9, type: 'premium', price: 180, isBooked: true },
  { id: 'D10', row: 'D', number: 10, type: 'premium', price: 180, isBooked: false },
  { id: 'D11', row: 'D', number: 11, type: 'standard', price: 120, isBooked: false },
  { id: 'D12', row: 'D', number: 12, type: 'standard', price: 120, isBooked: true },
  { id: 'D13', row: 'D', number: 13, type: 'standard', price: 120, isBooked: false },
  { id: 'D14', row: 'D', number: 14, type: 'standard', price: 120, isBooked: false },
  { id: 'D15', row: 'D', number: 15, type: 'standard', price: 120, isBooked: true },
  { id: 'D16', row: 'D', number: 16, type: 'standard', price: 120, isBooked: false },
  
  // Row E
  { id: 'E1', row: 'E', number: 1, type: 'standard', price: 120, isBooked: true },
  { id: 'E2', row: 'E', number: 2, type: 'standard', price: 120, isBooked: false },
  { id: 'E3', row: 'E', number: 3, type: 'standard', price: 120, isBooked: false },
  { id: 'E4', row: 'E', number: 4, type: 'standard', price: 120, isBooked: true },
  { id: 'E5', row: 'E', number: 5, type: 'standard', price: 120, isBooked: false },
  { id: 'E6', row: 'E', number: 6, type: 'standard', price: 120, isBooked: false },
  { id: 'E7', row: 'E', number: 7, type: 'standard', price: 120, isBooked: true },
  { id: 'E8', row: 'E', number: 8, type: 'standard', price: 120, isBooked: false },
  { id: 'E9', row: 'E', number: 9, type: 'standard', price: 120, isBooked: false },
  { id: 'E10', row: 'E', number: 10, type: 'standard', price: 120, isBooked: true },
  { id: 'E11', row: 'E', number: 11, type: 'standard', price: 120, isBooked: false },
  { id: 'E12', row: 'E', number: 12, type: 'standard', price: 120, isBooked: false },
  { id: 'E13', row: 'E', number: 13, type: 'standard', price: 120, isBooked: true },
  { id: 'E14', row: 'E', number: 14, type: 'standard', price: 120, isBooked: false },
  { id: 'E15', row: 'E', number: 15, type: 'standard', price: 120, isBooked: false },
  { id: 'E16', row: 'E', number: 16, type: 'standard', price: 120, isBooked: true },
  { id: 'E17', row: 'E', number: 17, type: 'standard', price: 120, isBooked: false },
  
  // Row F (Back Row)
  { id: 'F1', row: 'F', number: 1, type: 'standard', price: 120, isBooked: false },
  { id: 'F2', row: 'F', number: 2, type: 'standard', price: 120, isBooked: true },
  { id: 'F3', row: 'F', number: 3, type: 'standard', price: 120, isBooked: false },
  { id: 'F4', row: 'F', number: 4, type: 'standard', price: 120, isBooked: false },
  { id: 'F5', row: 'F', number: 5, type: 'standard', price: 120, isBooked: true },
  { id: 'F6', row: 'F', number: 6, type: 'standard', price: 120, isBooked: false },
  { id: 'F7', row: 'F', number: 7, type: 'standard', price: 120, isBooked: false },
  { id: 'F8', row: 'F', number: 8, type: 'standard', price: 120, isBooked: true },
  { id: 'F9', row: 'F', number: 9, type: 'standard', price: 120, isBooked: false },
  { id: 'F10', row: 'F', number: 10, type: 'standard', price: 120, isBooked: false },
  { id: 'F11', row: 'F', number: 11, type: 'standard', price: 120, isBooked: true },
  { id: 'F12', row: 'F', number: 12, type: 'standard', price: 120, isBooked: false },
  { id: 'F13', row: 'F', number: 13, type: 'standard', price: 120, isBooked: false },
  { id: 'F14', row: 'F', number: 14, type: 'standard', price: 120, isBooked: true },
  { id: 'F15', row: 'F', number: 15, type: 'standard', price: 120, isBooked: false },
  { id: 'F16', row: 'F', number: 16, type: 'standard', price: 120, isBooked: false },
  { id: 'F17', row: 'F', number: 17, type: 'standard', price: 120, isBooked: true },
  { id: 'F18', row: 'F', number: 18, type: 'standard', price: 120, isBooked: false },
];

  

  // State
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [shows, setShows] = useState<Show[]>([]);
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<Array<{ time: string; showId: string }>>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [noFutureShows, setNoFutureShows] = useState(false);
  const [selectedTab, setSelectedTab] = useState("date");
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isBookingConfirming, setIsBookingConfirming] = useState(false);
  const [totalSeats, setTotalSeats] = useState(0)


  // Filter out past dates
  useEffect(() => {
    if (shows.length > 0) {
      const today = startOfDay(new Date());
      const futureShows = shows.filter(show => isAfter(parseISO(show.date), today));
      
      
      setFilteredShows(futureShows);
      
      if (futureShows.length === 0) {
        setNoFutureShows(true);
      } else {
        // Set the default date to the earliest future date available
        const earliestDate = new Date(Math.min(...futureShows.map(show => new Date(show.date).getTime())));
        setSelectedDate(earliestDate);
      }
      
    }
  }, [shows]);

  // Memoize theaters list from filtered shows
  const theaters = useMemo(() =>
    Array.from(new Set(filteredShows.map(show => show.theater.name))),
    [filteredShows]
  );

  // Handle responsive layout
  useEffect(() => {
    const checkScreenSize = () => setIsMobileView(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Show[]>(
          `https://movizonebackend.onrender.com/api/shows/movie/${movieId}`
        );
  
        setShows(res.data);
        if (res.data.length) {
          setTotalSeats(res.data[0].theater.seats)
        }
  
        if (res.data.length > 0) {
          const movie = res.data[0].movie;
          const theaterSeats = res.data[0].theater.seats;
          setSeats(theaterSeats); // <-- 🛠️ setSeats added here
          console.log("Seats are...",seats);

          console.log("Theater Seats Available:", theaterSeats);
  
          setMovieDetails({
            title: movie.title || "Untitled Movie",
            posterUrl: movie.posterUrl || "https://tse3.mm.bing.net/th?id=OIP.nJ9vpUZxs9Sj3NGhksv3cgHaNK&pid=Api&P=0&h=220",
            genre: movie.genre || "Action",
            description: movie.description || "No description available",
            releaseDate: movie.releaseDate || new Date().toISOString(),
            duration: movie.duration || "120 min",
            rating: movie.rating || 7.5,
            director: movie.director || "Unknown Director",
            cast: movie.cast || ["Cast information unavailable"]
          });
        } else {
          setError("No shows available for this movie.");
        }
      } catch (err) {
        setError("Failed to load shows for this movie.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchShows();
  }, [movieId]);
  

  // Update available times based on filtered shows
  useEffect(() => {
    if (theaters.length > 0 && !selectedTheater) {
      setSelectedTheater(theaters[0]);
    }

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const matchedShows = filteredShows.filter(show =>
      show.date === formattedDate &&
      (!selectedTheater || show.theater.name === selectedTheater)
    );

    const times = matchedShows.flatMap(show =>
      show.time.split(",").map(t => ({
        time: t.trim(),
        showId: show._id
      }))
    );

    setAvailableTimes(times);
    setSelectedTime(null);
    setSelectedShowId(null);
    setSelectedSeats([]);
  }, [selectedDate, selectedTheater, filteredShows, theaters]);

  // Seat generation logic
  const generateSeats = (bookedSeats: string[]): Seat[] => {
    const seats: Seat[] = [];

    // Standard seats (rows A-E)
    for (const row of ['A', 'B', 'C', 'D', 'E']) {
      for (let num = 1; num <= 12; num++) {
        const id = `${row}${num}`;
        seats.push({
          id,
          row,
          number: num,
          type: "standard",
          price: 150,
          isBooked: bookedSeats.includes(id) || Math.random() > 0.7
        });
      }
    }

    // Premium seats (rows F-H)
    for (const row of ['F', 'G', 'H']) {
      for (let num = 1; num <= 12; num++) {
        const id = `${row}${num}`;
        seats.push({
          id,
          row,
          number: num,
          type: "premium",
          price: 200,
          isBooked: bookedSeats.includes(id) || Math.random() > 0.5
        });
      }
    }

    // VIP seats (row J)
    for (const row of ['J']) {
      for (let num = 1; num <= 8; num++) {
        const id = `${row}${num}`;
        seats.push({
          id,
          row,
          number: num,
          type: "vip",
          price: 350,
          isBooked: bookedSeats.includes(id) || Math.random() > 0.3
        });
      }
    }

    return seats;
  };

  // Fetch seat availability
  const fetchSeatAvailability = useCallback(async () => {
    if (!selectedShowId) return;

    setAvailabilityLoading(true);
    try {
      const show = shows.find(s => s._id === selectedShowId);
      const bookedSeats = show?.bookedSeats || [];
      setSeats(generateSeats(bookedSeats));
    } catch (err) {
      setError("Failed to load seat availability. Please try again later.");
    } finally {
      setAvailabilityLoading(false);
    }
  }, [selectedShowId, shows]);

  useEffect(() => {
    fetchSeatAvailability();
  }, [fetchSeatAvailability]);

  // Handlers
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
    setSelectedTab("theater");
  }, []);

  const handleTheaterSelect = useCallback((theater: string) => {
    setSelectedTheater(theater);
    setSelectedTab("time");
  }, []);

  const handleTimeSelect = useCallback((time: string, showId: string) => {
    setSelectedTime(time);
    setSelectedShowId(showId);
    setSelectedTab("seats");
  }, []);

  // const handleSeatClick = useCallback((seat: Seat) => {
  //   if (seat.isBooked) return;
  //   setSelectedSeats(prev => prev.some(s => s.id === seat.id)
  //     ? prev.filter(s => s.id !== seat.id)
  //     : [...prev, seat]
  //   );
  // }, []);

  const handleSeatClick = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };
  

  const handleConfirmBooking = useCallback(async () => {
    if (!selectedSeats.length) return;

    setIsBookingConfirming(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate("/payment", {
        state: {
          movie: movieDetails,
          date: selectedDate,
          time: selectedTime,
          theater: selectedTheater,
          seats: selectedSeats,
          totalPrice: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
          bookingId: "BK" + Math.floor(Math.random() * 10000000)
        }
      });
    } catch (err) {
      setError("Failed to confirm booking. Please try again.");
    } finally {
      setIsBookingConfirming(false);
    }
  }, [selectedSeats, movieDetails, selectedDate, selectedTime, selectedTheater, navigate]);

  // Progress indicators
  const getStepStatus = useCallback((step: string) => {
    const steps = ["date", "theater", "time", "seats"];
    const currentIndex = steps.indexOf(selectedTab);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return "complete";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  }, [selectedTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (noFutureShows) {
    return (
      <div className="container mx-auto py-10 px-4">
        {movieDetails && (
          <MovieBanner
            movieDetails={movieDetails}
            onShowInfo={() => setShowInfoDialog(true)}
          />
        )}
        
        <Alert className="mt-8 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No upcoming shows</AlertTitle>
          <AlertDescription>
            There are no future shows scheduled for this movie. Please check back later or explore other movies.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate("/movies")}>
            Browse Other Movies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {movieDetails && (
        <MovieBanner
          movieDetails={movieDetails}
          onShowInfo={() => setShowInfoDialog(true)}
        />
      )}

      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Book Your Tickets</h2>
          <BookingProgress
            steps={["date", "theater", "time", "seats"]}
            currentStep={selectedTab}
            getStepStatus={getStepStatus}
          />
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="date">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Date
            </TabsTrigger>
            <TabsTrigger value="theater" disabled={!selectedDate}>
              <MapPin className="h-4 w-4 mr-2" />
              Theater
            </TabsTrigger>
            <TabsTrigger value="time" disabled={!selectedTheater}>
              <Clock className="h-4 w-4 mr-2" />
              Time
            </TabsTrigger>
            <TabsTrigger value="seats" disabled={!selectedTime}>
              <TicketIcon className="h-4 w-4 mr-2" />
              Seats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="date" className="mt-6">
            <DateSelector
              selectedDate={selectedDate}
              isCalendarOpen={isCalendarOpen}
              setIsCalendarOpen={setIsCalendarOpen}
              handleDateSelect={handleDateSelect}
              shows={filteredShows} // Pass filtered shows that only contain future dates
            />
          </TabsContent>

          <TabsContent value="theater" className="mt-6">
            <TheaterSelector
              theaters={theaters}
              selectedTheater={selectedTheater}
              handleTheaterSelect={handleTheaterSelect}
            />
          </TabsContent>

          <TabsContent value="time" className="mt-6">
            <TimeSelector
              availableTimes={availableTimes}
              selectedTime={selectedTime}
              handleTimeSelect={handleTimeSelect}
            />
          </TabsContent>

          <TabsContent value="seats" className="mt-6">
            <Card className="max-w-4xl mx-auto shadow-lg border-primary/5">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center">
                  <TicketIcon className="h-5 w-5 mr-2 text-primary" />
                  Select Seats
                </CardTitle>
                <CardDescription>
                  Choose your seats for {format(selectedDate, "MMMM d")} at {selectedTime}, {selectedTheater}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-10 text-center relative">
                  <div className="h-3 bg-gradient-to-r from-primary/50 via-primary to-primary/50 w-3/4 mx-auto rounded mb-1"></div>
                  <div className="h-10 bg-gradient-to-b from-primary/30 to-transparent w-2/3 mx-auto rounded-t"></div>
                  <div className="text-muted-foreground text-sm font-medium">SCREEN</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    {availabilityLoading ? (
                      <div className="h-[450px] rounded-md border p-4 bg-muted/10 flex flex-col items-center justify-center space-y-6">
                        <div className="space-y-4 w-full">
                          {[1, 2, 3, 4, 5].map(row => (
                            <div key={row} className="flex justify-center space-x-2">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(col => (
                                <Skeleton key={col} className="w-8 h-8 rounded" />
                                // <h3>1,2,3,4,5,6,7,8,9,0</h3>
                              ))}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">Loading seat availability...</p>
                      </div>
                    ) : (
                      // <SeatLayout
                      //   seats={seats}
                      //   selectedSeats={selectedSeats}
                      //   handleSeatClick={handleSeatClick}
                      // />

                      <SeatLayout
                      totalSeats={totalSeats}
                      selectedSeats={selectedSeats}
                      handleSeatClick={handleSeatClick}
                    />

                   
                    )}
                  </div>

                  <BookingSummary
                    movieDetails={movieDetails}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedTheater={selectedTheater}
                    selectedSeats={selectedSeats}
                    isBookingConfirming={isBookingConfirming}
                    handleConfirmBooking={handleConfirmBooking}
                  />
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/10 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-sm bg-blue-100 border border-blue-200"></div>
                    <span className="text-sm">Standard ($10)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-sm bg-amber-100 border border-amber-200"></div>
                    <span className="text-sm">Premium ($15)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-sm bg-purple-100 border border-purple-200"></div>
                    <span className="text-sm">VIP ($25)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-sm bg-gray-300"></div>
                    <span className="text-sm">Unavailable</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t flex justify-between py-4">
                <Button variant="outline" onClick={() => setSelectedTab("time")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  disabled={selectedSeats.length === 0 || isBookingConfirming}
                >
                  {isBookingConfirming ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <TicketIcon className="h-4 w-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {movieDetails && (
        <MovieDetailsDialog
          open={showInfoDialog}
          onOpenChange={setShowInfoDialog}
          movieDetails={movieDetails}
        />
      )}
    </div>
  );
};

export default SeatSelector;