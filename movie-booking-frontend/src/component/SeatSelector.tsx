import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, TicketIcon, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Skeleton } from '../../components/ui/skeleton';

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

  // State
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<Array<{ time: string; showId: string }>>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("date");
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isBookingConfirming, setIsBookingConfirming] = useState(false);


  // Memoize theaters list
  const theaters = useMemo(() =>
    Array.from(new Set(shows.map(show => show.theater.name))),
    [shows]
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

        if (res.data.length > 0) {
          const movie = res.data[0].movie;
          setMovieDetails({
            title: movie.title || "check seat selector please",
            posterUrl: movie.posterUrl || "https://tse3.mm.bing.net/th?id=OIP.nJ9vpUZxs9Sj3NGhksv3cgHaNK&pid=Api&P=0&h=220",
            genre: movie.genre || "Action",
            description: movie.description || "No description___ available",
            releaseDate: movie.releaseDate || "error check in seatSelector please",
            duration: movie.duration || "njhjh",
            rating: movie.rating || 7.5,
            director: movie.director || "Unknown from seat selector page",
            cast: movie.cast || ["These error from seatselector page"]
          });


        } else {
          setError("No shows available for this movie.");
        }
      } catch (err) {
        setError("No show available for these movie.");
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [movieId]);


  // Update available times
  useEffect(() => {
    if (theaters.length > 0 && !selectedTheater) {
      setSelectedTheater(theaters[0]);
    }

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const matchedShows = shows.filter(show =>
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
  }, [selectedDate, selectedTheater, shows, theaters]);

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

  const handleSeatClick = useCallback((seat: Seat) => {
    if (seat.isBooked) return;
    setSelectedSeats(prev => prev.some(s => s.id === seat.id)
      ? prev.filter(s => s.id !== seat.id)
      : [...prev, seat]
    );
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <MovieBanner
        movieDetails={movieDetails}
        onShowInfo={() => setShowInfoDialog(true)}
      />

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
              shows={shows} // Pass the API result here
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
                              ))}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">Loading seat availability...</p>
                      </div>
                    ) : (
                      <SeatLayout
                        seats={seats}
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

      <MovieDetailsDialog
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
        movieDetails={movieDetails}
      />
    </div>
  );
};

export default SeatSelector;