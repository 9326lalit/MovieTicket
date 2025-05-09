import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../../components/ui/navigation-menu';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '../../components/ui/sheet';
import { Dialog, DialogTrigger } from '../../components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import {
  Film,
  Search,
  Menu,
  Home,
  Ticket,
  Clock,
  CalendarDays,
  Heart,
  Star,
  History,
  ChevronRight,
  Mail,
  Share2,
  LogOut,
} from 'lucide-react';

const Navbar = ({ theme, setTheme }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Dune', 'The Batman', 'Oppenheimer']);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Listen for Firebase Auth state
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (!recentSearches.includes(searchQuery.trim())) {
      setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
    }
    // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleOpenProfile = () => navigate('/profile');

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled
        ? 'border-b shadow-sm bg-background/95 backdrop-blur-md'
        : 'bg-gradient-to-b from-background/80 to-background/0'
    }`}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 ml-15">
          <div className="relative">
            <Film className="h-8 w-8 text-primary" />
            <span className="absolute -top-1 -right-1">
              <Badge variant="destructive" className="text-[10px] h-4 w-4 flex items-center justify-center p-0 rounded-full">
                4K
              </Badge>
            </span>
          </div>
          <Link to="/" className="flex flex-col">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
              CineSphere
            </span>
            <span className="text-[10px] text-muted-foreground -mt-1">Premium Experience</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavLink to="/">
                  <NavigationMenuLink
                    className={`group inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      location.pathname === '/' ? 'bg-accent/30 font-semibold' : 'bg-background'
                    }`}>
                    <Home className="mr-2 h-4 w-4" /> Home
                  </NavigationMenuLink>
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center mt-4">
                  <Ticket className="mr-2 h-4 w-4" /> Movies
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px] grid-cols-2">
                    <div className="col-span-2">
                      <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                        Browse Movies
                      </div>
                      <Separator className="mb-2" />
                    </div>
                    {/* Now Playing */}
                    <NavigationMenuLink asChild>
                      <Link to="/movies/now-playing" className="flex items-start space-x-2 rounded-md p-3 hover:bg-accent">
                        <div className="bg-primary/10 p-1 rounded-md">
                          <Ticket className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Now Playing</div>
                          <p className="text-xs text-muted-foreground">Currently in theaters</p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    {/* Coming Soon */}
                    <NavigationMenuLink asChild>
                      <Link to="/movies/comingsoon" className="flex items-start space-x-2 rounded-md p-3 hover:bg-accent">
                        <div className="bg-primary/10 p-1 rounded-md">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Coming Soon</div>
                          <p className="text-xs text-muted-foreground">Upcoming releases</p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    {/* Popular */}
                    <NavigationMenuLink asChild>
                      <Link to="/movies/popular" className="flex items-start space-x-2 rounded-md p-3 hover:bg-accent">
                        <div className="bg-primary/10 p-1 rounded-md">
                          <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Popular</div>
                          <p className="text-xs text-muted-foreground">Fan favorites</p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    {/* Top Rated */}
                    <NavigationMenuLink asChild>
                      <Link to="/movies/top-rated" className="flex items-start space-x-2 rounded-md p-3 hover:bg-accent">
                        <div className="bg-primary/10 p-1 rounded-md">
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Top Rated</div>
                          <p className="text-xs text-muted-foreground">Critically acclaimed</p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink to="/bookings">
                  <NavigationMenuLink
                    className={`group inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      location.pathname === '/bookings' ? 'bg-accent/30 font-semibold' : 'bg-background'
                    }`}>
                    <CalendarDays className="mr-2 h-4 w-4" /> Bookings
                  </NavigationMenuLink>
                </NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search + User Menu */}
        <div className="flex items-center gap-3">
          {/* Search */}
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
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                    onBlur={() => { if (!searchQuery) setIsSearchVisible(false); }}
                  />
                  {searchQuery && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-background rounded-md border shadow-lg z-50">
                      <div className="p-2 text-xs text-muted-foreground font-medium">Recent Searches</div>
                      {recentSearches.map((s, i) => (
                        <div
                          key={i}
                          className="px-3 py-2 hover:bg-accent flex items-center justify-between cursor-pointer"
                          onMouseDown={() => {
                            setSearchQuery(s);
                            searchInputRef.current?.focus();
                          }}>
                          <div className="flex items-center">
                            <History className="h-3 w-3 mr-2 text-muted-foreground" />
                            {s}
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
                      className="rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary">
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

          {/* Desktop Profile Dialog */}
          <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="rounded-full p-0 h-10 w-10 overflow-hidden" onClick={handleOpenProfile}>
                <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors">
                  {currentUser?.photoURL ? (
                    <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
                  ) : (
                    <AvatarFallback>{currentUser?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DialogTrigger>
          </Dialog>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Film className="h-5 w-5 text-primary" /> CineSphere
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 py-6">
                  <div className="flex items-center space-x-3" onClick={handleOpenProfile}>
                    <Avatar className="h-12 w-12 border-2 border-primary/20 cursor-pointer">
                      {currentUser?.photoURL ? (
                        <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
                      ) : (
                        <AvatarFallback>{currentUser?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{currentUser?.displayName || 'Guest'}</p>
                    </div>
                  </div>
                  {/* ...rest of your mobile nav links */}
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Link to="/logout">
                      <Button variant="destructive" className="w-full flex items-center">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </Link>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
