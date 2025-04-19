

import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation , useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "../../components/ui/navigation-menu";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import {
  DropdownMenu,
} from "../../components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "../../components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Switch } from "../../components/ui/switch";

import { cn } from "../lib/utils";

import {
  Film,
  User,
  Search,
  Menu,
  Home,
  Ticket,
  Clock,
  CalendarDays,
  LogOut,

  Settings,
  Heart,
  PlayCircle,
  Star,
  Gift,
  Moon,
  Wallet,
  BookMarked,
  History,
  Mail,
  Share2,

  ChevronRight,

} from "lucide-react";

const Navbar = ({ theme, setTheme }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Dune', 'The Batman', 'Oppenheimer']);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Arrival: Dune: Part Two",
      message: "Tickets now available for booking!",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      title: "Booking confirmed: The Batman",
      message: "Your booking #12345 has been confirmed.",
      time: "1 day ago",
      read: false
    },
    {
      id: 3,
      title: "Limited Offer",
      message: "Get 20% off on your next booking with code CINE20",
      time: "3 days ago",
      read: true
    }
  ]);

  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Save to recent searches if not already there
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
      }
      console.log("Searching for:", searchQuery);
      // Would typically navigate to search results page here
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  const handleOpenProfile = () => {
    navigate(`/profile`);
    // setShowProfileDialog(false);
  }

  // Handle notification marking as read
  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? "border-b shadow-sm bg-background/95 backdrop-blur-md"
        : "bg-gradient-to-b from-background/80 to-background/0"
        }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 ml-15">
          <div className="relative">
            <Film className="h-8 w-8 text-primary" />
            <span className="absolute -top-1 -right-1">
              <Badge variant="destructive" className="text-[10px] h-4 w-4 flex items-center justify-center p-0 rounded-full">4K</Badge>
            </span>
          </div>
          <Link to="/" className="flex flex-col">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">CineSphere</span>
            <span className="text-[10px] text-muted-foreground -mt-1">Premium Experience</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavLink to="/">
                  <NavigationMenuLink className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${location.pathname === '/' ? 'bg-accent/30 font-semibold' : 'bg-background'}`}>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </NavigationMenuLink>
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center mt-4">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Movies
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px] grid-cols-2">
                    <div className="col-span-2">
                      <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Browse Movies</div>
                      <Separator className="mb-2" />
                    </div>
                    <NavigationMenuLink asChild>
                      <Link to="/movies/now-playing" className="flex items-start space-x-2 rounded-md p-3 hover:bg-accent">
                        <div className="bg-primary/10 p-1 rounded-md">
                          <Ticket className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Now Playing</div>
                          <p className="text-xs text-muted-foreground">
                            Currently in theaters
                          </p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/movies/comingsoon" className="flex items-start space-x-2 rounded-md p-3 hover:bg-accent">
                        <div className="bg-primary/10 p-1 rounded-md">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Coming Soon</div>
                          <p className="text-xs text-muted-foreground">
                            Upcoming releases
                          </p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/movies/popular" className="flex items-start space-x-2 rounded-md p-3 hover:bg-accent">
                        <div className="bg-primary/10 p-1 rounded-md">
                          <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Popular</div>
                          <p className="text-xs text-muted-foreground">
                            Fan favorites
                          </p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/movies/top-rated" className="flex items-start space-x-2 rounded-md p-3 hover:bg-accent">
                        <div className="bg-primary/10 p-1 rounded-md">
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Top Rated</div>
                          <p className="text-xs text-muted-foreground">
                            Critically acclaimed
                          </p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink to="/bookings">
                  <NavigationMenuLink className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${location.pathname === '/bookings' ? 'bg-accent/30 font-semibold' : 'bg-background'}`}>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Bookings
                  </NavigationMenuLink>
                </NavLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search, Notifications, Theme Toggle and User Menu */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex items-center">
            {isSearchVisible ? (
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search movies, actors, genres..."
                    className="w-64 pl-10 bg-background border-primary/20 focus-visible:ring-primary/30 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) {
                        setIsSearchVisible(false);
                      }
                    }}
                  />
                  {searchQuery && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-background rounded-md border shadow-lg z-50">
                      <div className="p-2 text-xs text-muted-foreground font-medium">Recent Searches</div>
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-accent flex items-center justify-between cursor-pointer"
                          onClick={() => {
                            setSearchQuery(search);
                            searchInputRef.current?.focus();
                          }}
                        >
                          <div className="flex items-center">
                            <History className="h-3 w-3 mr-2 text-muted-foreground" />
                            {search}
                          </div>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsSearchVisible(true)}
                      className="rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          

          {/* User Menu */}
          <div className="flex items-center gap-2 mr-15">
            {/* Profile Dialog */}
            <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="rounded-full p-0 h-10 w-10 overflow-hidden">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors">
                    <AvatarImage onClick={handleOpenProfile} src="https://i.pravatar.cc/100" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DialogTrigger>
             
            </Dialog>



            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Film className="h-5 w-5 text-primary" />
                      <span className="font-bold">CineSphere</span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-6 py-6">
                    <div className="flex items-center space-x-3" onClick={() => setShowProfileDialog(true)}>
                      <Avatar className="h-12 w-12 border-2 border-primary/20 cursor-pointer">
                        <AvatarImage src="https://i.pravatar.cc/100" alt="User" />
                        <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">John Doe</p>
                        <div className="flex items-center">
                          <Badge variant="outline" className="text-xs px-1 border-primary/20 text-primary mr-2">Premium</Badge>
                          <p className="text-xs text-muted-foreground">1,250 points</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search movies..."
                        className="w-full pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider px-1">Main Menu</div>
                      <nav className="flex flex-col">
                        <Link to="/" className="flex items-center px-3 py-2 hover:bg-accent rounded-md">
                          <Home className="mr-2 h-4 w-4" />
                          Home
                        </Link>
                        <Link to="/movies/now-playing" className="flex items-center px-3 py-2 hover:bg-accent rounded-md">
                          <Ticket className="mr-2 h-4 w-4" />
                          Now Playing
                        </Link>
                        <Link to="/movies/comingsoon" className="flex items-center px-3 py-2 hover:bg-accent rounded-md">
                          <Clock className="mr-2 h-4 w-4" />
                          Coming Soon
                        </Link>
                        <Link to="/movies/popular" className="flex items-center px-3 py-2 hover:bg-accent rounded-md">
                          <Heart className="mr-2 h-4 w-4" />
                          Popular
                        </Link>
                        <Link to="/movies/top-rated" className="flex items-center px-3 py-2 hover:bg-accent rounded-md">
                          <Star className="mr-2 h-4 w-4" />
                          Top Rated
                        </Link>
                        <Link to="/bookings" className="flex items-center px-3 py-2 hover:bg-accent rounded-md">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          Bookings
                        </Link>
                        <Link to="/rewards" className="flex items-center px-3 py-2 hover:bg-accent rounded-md">
                          <Gift className="mr-2 h-4 w-4" />
                          Rewards
                        </Link>
                      </nav>
                    </div>

                    <Separator />

                    


                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider px-1">Your Account</div>
                      <nav className="flex flex-col">
                        <Link to="/profile" className="flex items-center px-3 py-2 hover:bg-accent rounded-md">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                        
                        
                        <Link to="/help" className="flex items-center px-3 py-2 hover:bg-accent rounded-md">
                          <Mail className="mr-2 h-4 w-4" />
                          Help & Support
                        </Link>
                        <Link to="/share" className="flex items-center px-3 py-2 hover:bg-accent rounded-md">
                          <Share2 className="mr-2 h-4 w-4" />
                          Invite Friends
                        </Link>
                      </nav>
                    </div>
                  </div>

                  <SheetFooter>
                    <SheetClose asChild>
                      <Link to="/logout">
                        <Button variant="destructive" className="w-full flex items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </Link>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;