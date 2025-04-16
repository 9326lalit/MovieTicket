import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Star, MapPin, TicketIcon, Info, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Calendar } from "../components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { ScrollArea } from "../components/ui/scroll-area";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";

// Types
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
    genre?: string;
    director?: string;
    cast?: string[];
  };
  theater: {
    name: string;
    location: string;
    facilities?: string[];
  };
}

interface SeatInfo {
  id: string;
  row: string;
  number: number;
  type: "standard" | "premium" | "vip";
  price: number;
  isBooked: boolean;
}

const SeatSelector: React.FC = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<{time: string, showId: string}[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SeatInfo[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [seats, setSeats] = useState<SeatInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("date");
  const [showInfoDialog, setShowInfoDialog] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  // Handle responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Generate theater list from shows
  const theaters = [...new Set(shows.map(show => show.theater.name))];
  
  // Create seat layout
  useEffect(() => {
    if (selectedShowId) {
      // In a real app, you'd fetch actual seat data from the API
      // Here we'll generate sample data
      const show = shows.find(s => s._id === selectedShowId);
      const bookedSeats = show?.bookedSeats || [];
      
      // Generate all seats
      const generatedSeats: SeatInfo[] = [];
      
      // Standard seats (rows A-E)
      for (const row of ['A', 'B', 'C', 'D', 'E']) {
        for (let num = 1; num <= 12; num++) {
          const id = `${row}${num}`;
          generatedSeats.push({
            id,
            row,
            number: num,
            type: "standard",
            price: 10,
            isBooked: bookedSeats.includes(id) || Math.random() > 0.85 // Random bookings for demo
          });
        }
      }
      
      // Premium seats (rows F-H)
      for (const row of ['F', 'G', 'H']) {
        for (let num = 1; num <= 12; num++) {
          const id = `${row}${num}`;
          generatedSeats.push({
            id,
            row,
            number: num,
            type: "premium",
            price: 15,
            isBooked: bookedSeats.includes(id) || Math.random() > 0.9 // Random bookings for demo
          });
        }
      }
      
      // VIP seats (row J)
      for (const row of ['J']) {
        for (let num = 1; num <= 8; num++) {
          const id = `${row}${num}`;
          generatedSeats.push({
            id,
            row,
            number: num,
            type: "vip",
            price: 25,
            isBooked: bookedSeats.includes(id) || Math.random() > 0.95 // Random bookings for demo
          });
        }
      }
      
      setSeats(generatedSeats);
    }
  }, [selectedShowId, shows]);

  // Fetch movie shows data
  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        // In a real app, replace with your actual API endpoint
        const res = await axios.get(`https://movizonebackend.onrender.com/api/shows/movie/${movieId}`);
        setShows(res.data);
        
        if (res.data.length > 0) {
          setMovieDetails({
            ...res.data[0].movie,
            genre: "Action, Sci-Fi", // Added for demo
            director: "Christopher Nolan", // Added for demo
            cast: ["Tom Hardy", "Margot Robbie", "Idris Elba"] // Added for demo
          });
        } else {
          setError("No shows available for this movie");
        }
      } catch (err) {
        console.error("Error fetching shows", err);
        setError("Failed to load show information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchShows();
  }, [movieId]);

  // Update available times when date or theater changes
  useEffect(() => {
    if (!selectedTheater && theaters.length > 0) {
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

  // Handlers
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
      setSelectedTab("theater");
    }
  };

  const handleTheaterSelect = (theater: string) => {
    setSelectedTheater(theater);
    setSelectedTab("time");
  };

  const handleTimeSelect = (time: string, showId: string) => {
    setSelectedTime(time);
    setSelectedShowId(showId);
    setSelectedTab("seats");
  };

  const handleSeatClick = (seat: SeatInfo) => {
    if (seat.isBooked) return;
    
    setSelectedSeats(prev => {
      const alreadySelected = prev.some(s => s.id === seat.id);
      if (alreadySelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleConfirmBooking = () => {
    // Navigate to the payment page with booking details
    navigate("/payment", {
      state: {
        movie: movieDetails,
        date: selectedDate,
        time: selectedTime,
        theater: selectedTheater,
        seats: selectedSeats,
        totalPrice: selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
      }
    });
  };

  // Progress indicators
  const getStepStatus = (step: string) => {
    const steps = ["date", "theater", "time", "seats"];
    const currentIndex = steps.indexOf(selectedTab);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return "complete";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  // Render seat component
  const renderSeat = (seat: SeatInfo) => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    // Determine seat styling based on type and status
    let seatStyle = "flex items-center justify-center rounded-t-md border-t border-l border-r transition-all duration-200";
    
    if (seat.isBooked) {
      seatStyle += " bg-gray-300 text-gray-500 cursor-not-allowed opacity-60";
    } else if (isSelected) {
      switch (seat.type) {
        case "vip":
          seatStyle += " bg-purple-600 text-white border-purple-700 scale-110";
          break;
        case "premium":
          seatStyle += " bg-amber-500 text-white border-amber-600 scale-110";
          break;
        default:
          seatStyle += " bg-primary text-primary-foreground border-primary scale-110";
      }
    } else {
      switch (seat.type) {
        case "vip":
          seatStyle += " bg-purple-100 text-purple-900 border-purple-200 hover:bg-purple-200";
          break;
        case "premium":
          seatStyle += " bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200";
          break;
        default:
          seatStyle += " bg-blue-100 text-blue-900 border-blue-200 hover:bg-blue-200";
      }
    }

    return (
      <TooltipProvider key={seat.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleSeatClick(seat)}
                disabled={seat.isBooked}
                className={`${seatStyle} w-8 h-7 text-xs font-medium`}
              >
                {seat.number}
              </button>
              <div className="w-10 h-2 rounded-b-sm bg-gray-200"></div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p className="font-bold">{seat.id}</p>
              <p className="capitalize">{seat.type}</p>
              <p>${seat.price}</p>
              {seat.isBooked && <p className="text-red-500">Booked</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Banner with Overlay & Better Gradient */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 filter blur-sm"
          style={{ backgroundImage: `url(${movieDetails?.posterUrl || "https://tse2.mm.bing.net/th?id=OIP.qz_SdYL1d69g1w1MYaC1xQHaK5&pid=Api&P=0&h=220"})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent/20" />
        
        <div className="relative container mx-auto h-full flex items-end pb-16 ml-30 px-4">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="hidden md:block w-56 h-80 rounded-lg overflow-hidden shadow-2xl border-2 border-primary/10 transform hover:scale-105 transition-transform duration-300">
              <img 
                src={movieDetails?.posterUrl || "https://tse2.mm.bing.net/th?id=OIP.qz_SdYL1d69g1w1MYaC1xQHaK5&pid=Api&P=0&h=220"} 
                alt={movieDetails?.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-6 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-300 drop-shadow-sm">
                {movieDetails?.title}
              </h1>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-primary/20 px-3 py-1">
                  <Star className="h-4 w-4 mr-1 fill-yellow-500 text-yellow-500" />
                  {movieDetails?.rating || "8.5"}
                </Badge>
                <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-primary/20 px-3 py-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {movieDetails?.duration || 120} min
                </Badge>
                <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-primary/20 px-3 py-1">
                  {movieDetails?.genre || "Action"}
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3 backdrop-blur-sm bg-background/10 p-3 rounded-md">
                {movieDetails?.description}
              </p>
              
              <Button 
                variant="outline" 
                onClick={() => setShowInfoDialog(true)}
                className="bg-background/80 backdrop-blur-md hover:bg-background/90 border-primary/20"
              >
                <Info className="h-4 w-4 mr-2" />
                Movie Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Process Section with Progress Indicators */}
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Book Your Tickets</h2>
          
          {/* Progress Indicators */}
          <div className="flex items-center justify-center mb-8">
            {["date", "theater", "time", "seats"].map((step, index) => {
              const status = getStepStatus(step);
              return (
                <React.Fragment key={step}>
                  {/* Step Indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center 
                      ${status === "complete" ? "bg-primary text-primary-foreground" : 
                        status === "current" ? "bg-primary/80 text-primary-foreground ring-4 ring-primary/20" : 
                        "bg-muted text-muted-foreground"}
                    `}>
                      {status === "complete" ? (
                        <span className="text-xs">✓</span>
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <span className="text-xs mt-1 font-medium capitalize">{step}</span>
                  </div>
                  
                  {/* Connector */}
                  {index < 3 && (
                    <div className={`h-1 w-16 mx-2 ${
                      status === "upcoming" ? "bg-muted" : 
                      getStepStatus(["date", "theater", "time", "seats"][index + 1]) === "upcoming" ? 
                      "bg-gradient-to-r from-primary to-muted" : "bg-primary"
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      
        {/* Tabs Content */}
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
          
          {/* Date Selection */}
          <TabsContent value="date" className="mt-6">
            <Card className="max-w-2xl mx-auto shadow-lg border-primary/5">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                  Select Date
                </CardTitle>
                <CardDescription>Choose a date for your movie</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        disabled={(date) => 
                          date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                          date > new Date(new Date().setDate(new Date().getDate() + 7))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Quick Date Selection */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Quick Select:</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      return (
                        <Button 
                          key={i}
                          variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
                          className="h-auto py-3 flex flex-col"
                          onClick={() => handleDateSelect(date)}
                        >
                          <span className="text-xs">{format(date, 'EEE')}</span>
                          <span className="text-lg font-bold">{format(date, 'd')}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t flex justify-end py-4">
                <Button onClick={() => setSelectedTab("theater")}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Theater Selection */}
          <TabsContent value="theater" className="mt-6">
            <Card className="max-w-2xl mx-auto shadow-lg border-primary/5">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Select Theater
                </CardTitle>
                <CardDescription>
                  Choose a theater for {format(selectedDate, "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {theaters.map((theater) => {
                    const theaterInfo = shows.find(s => s.theater.name === theater)?.theater;
                    
                    return (
                      <Card 
                        key={theater} 
                        className={`cursor-pointer transition-all duration-200 
                          ${selectedTheater === theater ? 
                            'ring-2 ring-primary shadow-lg border-primary/20' : 
                            'hover:bg-accent hover:shadow-md border-transparent'}`}
                        onClick={() => handleTheaterSelect(theater)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            {theater}
                          </CardTitle>
                          <CardDescription>{theaterInfo?.location || "City Center"}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <div className="flex flex-wrap gap-1 mt-2">
                            {["IMAX", "Dolby Atmos", "Recliner Seats"].map((facility, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {facility}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t flex justify-between py-4">
                <Button variant="outline" onClick={() => setSelectedTab("date")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setSelectedTab("time")} disabled={!selectedTheater}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Time Selection */}
          <TabsContent value="time" className="mt-6">
            <Card className="max-w-2xl mx-auto shadow-lg border-primary/5">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Select Time
                </CardTitle>
                <CardDescription>
                  Choose a time for {format(selectedDate, "MMMM d")} at {selectedTheater}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {availableTimes.length > 0 ? (
                  <>
                    <h4 className="text-sm font-medium mb-4">Available Showtimes:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {availableTimes.map(({ time, showId }, idx) => (
                        <Button
                          key={idx}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => handleTimeSelect(time, showId)}
                          className={`text-md py-6 ${selectedTime === time ? "ring-2 ring-primary/20" : ""}`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  <Alert className="bg-amber-50 text-amber-900 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertTitle>No Shows Available</AlertTitle>
                    <AlertDescription>
                      There are no shows available on this date at this theater. Please select another date or theater.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="bg-muted/10 border-t flex justify-between py-4">
                <Button variant="outline" onClick={() => setSelectedTab("theater")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setSelectedTab("seats")} disabled={!selectedTime}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Seat Selection - Enhanced UI */}
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
                {/* Screen */}
                <div className="mb-10 text-center relative">
                  <div className="h-3 bg-gradient-to-r from-primary/50 via-primary to-primary/50 w-3/4 mx-auto rounded mb-1"></div>
                  <div className="h-10 bg-gradient-to-b from-primary/30 to-transparent w-2/3 mx-auto rounded-t"></div>
                  <div className="text-muted-foreground text-sm font-medium">SCREEN</div>
                </div>
                
                {/* Booking Summary - Moved to sidebar for better UX */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Seat Layout */}
                  <div className="lg:col-span-3">
                    <ScrollArea className="h-[450px] rounded-md border p-4 bg-muted/10">
                      <div className="flex flex-col items-center space-y-6">
                        {/* Standard Seats (A-E) */}
                        {['A', 'B', 'C', 'D', 'E'].map(row => (
                          <div key={row} className="flex items-center gap-2">
                            <div className="w-6 text-center font-bold text-muted-foreground">{row}</div>
                            <div className="flex gap-2">
                              {seats
                                .filter(seat => seat.row === row)
                                .map(seat => renderSeat(seat))
                              }
                            </div>
                          </div>
                        ))}
                        
                        <Separator className="w-full my-2" />
                        
                        {/* Premium Seats (F-H) */}
                        {['F', 'G', 'H'].map(row => (
                          <div key={row} className="flex items-center gap-2">
                            <div className="w-6 text-center font-bold text-muted-foreground">{row}</div>
                            <div className="flex gap-2">
                              {seats
                                .filter(seat => seat.row === row)
                                .map(seat => renderSeat(seat))
                              }
                            </div>
                          </div>
                        ))}
                        
                        <Separator className="w-full my-2" />
                        
                        {/* VIP Seats (J) - Center aligned */}
                        <div className="flex items-center gap-2 pb-6">
                          <div className="w-6 text-center font-bold text-muted-foreground">J</div>
                          <div className="flex gap-4">
                            {seats
                              .filter(seat => seat.row === 'J')
                              .map(seat => renderSeat(seat))
                            }
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                  {/* Booking Summary Card */}
                  <div className="lg:col-span-1">
                    <Card className="h-full border-primary/10 bg-muted/5">
                      <CardHeader className="pb-3 bg-primary/5">
                        <CardTitle className="text-lg">Booking Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 py-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Movie:</span>
                            <span className="font-medium">{movieDetails?.title}</span>
                          </div>
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Date:</span>
                            <span className="font-medium">{format(selectedDate, "MMM d, yyyy")}</span>
                          </div>
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Time:</span>
                            <span className="font-medium">{selectedTime}</span>
                          </div>
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Theater:</span>
                            <span className="font-medium">{selectedTheater}</span>
                          </div>
                          <Separator />
                        </div>
                        
                        {/* Selected Seats */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Selected Seats:</h4>
                          {selectedSeats.length > 0 ? (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {selectedSeats.map(seat => (
                                <Badge 
                                  key={seat.id} 
                                  className={`
                                    ${seat.type === 'standard' ? 'bg-blue-100 text-blue-900' : 
                                      seat.type === 'premium' ? 'bg-amber-100 text-amber-900' : 
                                      'bg-purple-100 text-purple-900'}
                                  `}
                                >
                                  {seat.id}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No seats selected</p>
                          )}
                        </div>
                        
                        {/* Pricing Breakdown */}
                        {selectedSeats.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <Separator />
                            
                            {/* Count seats by type */}
                            {['standard', 'premium', 'vip'].map(type => {
                              const typeSeats = selectedSeats.filter(s => s.type === type);
                              if (typeSeats.length === 0) return null;
                              
                              const price = type === 'standard' ? 10 : type === 'premium' ? 15 : 25;
                              return (
                                <div key={type} className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground capitalize">
                                    {type} ({typeSeats.length} × ${price})
                                  </span>
                                  <span className="font-medium">${typeSeats.length * price}</span>
                                </div>
                              );
                            })}
                            
                            <Separator />
                            
                            {/* Total */}
                            <div className="flex justify-between items-center pt-1">
                              <span className="font-semibold">Total:</span>
                              <span className="font-bold text-lg text-primary">
                                ${selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="bg-muted/10 border-t">
                        <Button 
                          className="w-full"
                          onClick={handleConfirmBooking} 
                          disabled={selectedSeats.length === 0}
                        >
                          <TicketIcon className="h-4 w-4 mr-2" />
                          Confirm Booking
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
                
                {/* Seat Legend */}
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
                  disabled={selectedSeats.length === 0}
                >
                  <TicketIcon className="h-4 w-4 mr-2" />
                  Confirm Booking
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Movie Details Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary" />
              {movieDetails?.title}
            </DialogTitle>
            <DialogDescription>Complete movie information</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <img 
                src={movieDetails?.posterUrl || "https://tse2.mm.bing.net/th?id=OIP.qz_SdYL1d69g1w1MYaC1xQHaK5&pid=Api&P=0&h=220"} 
                alt={movieDetails?.title} 
                className="w-full h-auto rounded-md col-span-1 shadow-md border border-primary/10"
              />
              <div className="col-span-2 space-y-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Duration:</span> 
                  <span>{movieDetails?.duration} minutes</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Rating:</span> 
                  <span>{movieDetails?.rating}</span>
                </div>
                
                <div className="flex items-start gap-1">
                  <span className="font-medium mt-0.5">Genre:</span>
                  <div className="flex flex-wrap gap-1">
                    {(movieDetails?.genre || "").split(", ").map((g, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-start gap-1">
                  <span className="font-medium">Director:</span> 
                  <span>{movieDetails?.director}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="font-medium mb-1">Cast:</span>
                  <div className="flex flex-wrap gap-1">
                    {movieDetails?.cast?.map((actor, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {actor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2 text-lg flex items-center">
                <Info className="h-4 w-4 mr-2 text-primary" />
                Synopsis
              </h4>
              <p className="text-muted-foreground">{movieDetails?.description}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowInfoDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SeatSelector;