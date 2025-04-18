import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, MapPin, User as UserIcon,  Settings, LogOut } from "lucide-react";

interface Booking {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/auth");
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, [navigate]);
  
  // Fetch bookings only when user is set and bookings not yet fetched
  useEffect(() => {
    if (user) {
      fetchUserBookings(user.uid);
    }
  }, [user]);
  
  const fetchUserBookings = async (userId: string) => {
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const bookingsData: Booking[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Booking, "id">),
      }));
  
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const upcomingBookings = bookings.filter(booking => booking.status === "upcoming");
  const pastBookings = bookings.filter(booking => booking.status === "completed" || booking.status === "cancelled");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
              <AvatarFallback className="text-2xl">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-center text-2xl">{user?.displayName || "User"}</CardTitle>
            <CardDescription className="text-center">{user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="bg-muted rounded-md p-3">
                <p className="text-2xl font-bold">{bookings.length}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
              <div className="bg-muted rounded-md p-3">
                <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full flex items-center justify-start gap-2">
                <UserIcon size={16} />
                <span>Edit Profile</span>
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-start gap-2">
                <Settings size={16} />
                <span>Settings</span>
              </Button>
              <Button 
                variant="destructive" 
                className="w-full flex items-center justify-start gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Booking History */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
            <CardDescription>Manage your upcoming and past bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No upcoming bookings found</p>
                    <Button className="mt-4" onClick={() => navigate('/')}>
                      Book Now
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{booking.title}</CardTitle>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2">
                              <MapPin size={16} />
                              <span>{booking.location}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">Reschedule</Button>
                          <Button variant="destructive" size="sm">Cancel</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {pastBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No past bookings found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{booking.title}</CardTitle>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2">
                              <MapPin size={16} />
                              <span>{booking.location}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          {booking.status === "completed" && (
                            <Button variant="outline" size="sm">Leave Review</Button>
                          )}
                          <Button variant="secondary" size="sm">Book Again</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button 
              className="w-full" 
              onClick={() => navigate('/booking')}
            >
              Create New Booking
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;