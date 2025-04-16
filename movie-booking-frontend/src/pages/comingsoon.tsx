
import { motion } from 'framer-motion';
import { format, parseISO, isAfter } from 'date-fns';
import {
    CalendarDays,
    Clock,
    Heart,
    Play,
    Bell,
    Share,
    Star,
    Calendar as CalendarIcon,

    Clock3,

} from 'lucide-react';

import { cn } from '../lib/utils';
import { Button } from '../../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';


import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../components/ui/tooltip';


// Sample data for coming soon movies
const CommingSoon = [
    {
        id: 1,
        title: "Dune: Messiah",
        releaseDate: "2025-05-15",
        posterUrl: "/api/placeholder/600/900",
        backdropUrl: "/api/placeholder/1200/500",
        runtime: 155,
        genres: ["Sci-Fi", "Adventure", "Drama"],
        synopsis: "Following the events of Dune, Paul Atreides becomes the emperor of the known universe and must navigate political intrigue while foreseeing a dark future that only he can prevent.",
        director: "Denis Villeneuve",
        starring: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Austin Butler"],
        trailerUrl: "#",
        rating: "PG-13",
        anticipationScore: 98,
        isWatchlisted: true,
        isNotified: false,
        productionStage: "Post-Production",
        promotionalLabel: "Most Anticipated",
        previewImages: [
            "/api/placeholder/600/400",
            "/api/placeholder/600/400",
            "/api/placeholder/600/400"
        ],
        specialFeatures: ["IMAX", "Dolby Atmos", "70mm"],
        productionCompany: "Legendary Pictures"
    },
    {
        id: 2,
        title: "Mission: Impossible – The Final Reckoning",
        releaseDate: "2025-07-03",
        posterUrl: "/api/placeholder/600/900",
        backdropUrl: "/api/placeholder/1200/500",
        runtime: 148,
        genres: ["Action", "Adventure", "Thriller"],
        synopsis: "Ethan Hunt faces his ultimate mission as global security is threatened by a new artificial intelligence weapon that has fallen into the wrong hands.",
        director: "Christopher McQuarrie",
        starring: ["Tom Cruise", "Hayley Atwell", "Simon Pegg", "Ving Rhames"],
        trailerUrl: "#",
        rating: "PG-13",
        anticipationScore: 92,
        isWatchlisted: false,
        isNotified: true,
        productionStage: "Filming",
        promotionalLabel: "Action Blockbuster",
        previewImages: [
            "/api/placeholder/600/400",
            "/api/placeholder/600/400",
            "/api/placeholder/600/400"
        ],
        specialFeatures: ["IMAX", "4DX", "ScreenX"],
        productionCompany: "Paramount Pictures"
    },
    {
        id: 3,
        title: "Blade Runner 2099",
        releaseDate: "2025-10-17",
        posterUrl: "/api/placeholder/600/900",
        backdropUrl: "/api/placeholder/1200/500",
        runtime: 162,
        genres: ["Sci-Fi", "Drama", "Mystery"],
        synopsis: "Fifty years after the events of Blade Runner 2049, a new detective uncovers a conspiracy that leads her to unearth secrets about replicant evolution and the missing Blade Runner, K.",
        director: "Ridley Scott",
        starring: ["Ana de Armas", "Ryan Gosling", "Jared Leto", "Dave Bautista"],
        trailerUrl: "#",
        rating: "R",
        anticipationScore: 94,
        isWatchlisted: true,
        isNotified: true,
        productionStage: "Pre-Production",
        promotionalLabel: null,
        previewImages: [
            "/api/placeholder/600/400",
            "/api/placeholder/600/400",
            "/api/placeholder/600/400"
        ],
        specialFeatures: ["IMAX", "Dolby Atmos"],
        productionCompany: "Warner Bros."
    },
    {
        id: 4,
        title: "Avatar 3: The Seed Bearer",
        releaseDate: "2025-12-19",
        posterUrl: "/api/placeholder/600/900",
        backdropUrl: "/api/placeholder/1200/500",
        runtime: 190,
        genres: ["Sci-Fi", "Action", "Adventure"],
        synopsis: "Jake Sully and Neytiri's family faces new threats on Pandora as they explore new regions of the planet and encounter different Na'vi cultures.",
        director: "James Cameron",
        starring: ["Sam Worthington", "Zoe Saldaña", "Kate Winslet", "Sigourney Weaver"],
        trailerUrl: "#",
        rating: "PG-13",
        anticipationScore: 95,
        isWatchlisted: false,
        isNotified: false,
        productionStage: "Post-Production",
        promotionalLabel: "Epic Saga Continues",
        previewImages: [
            "/api/placeholder/600/400",
            "/api/placeholder/600/400",
            "/api/placeholder/600/400"
        ],
        specialFeatures: ["IMAX 3D", "Dolby Atmos", "High Frame Rate"],
        productionCompany: "20th Century Studios"
    },
    {
        id: 5,
        title: "Black Panther: Unconquered",
        releaseDate: "2025-08-22",
        posterUrl: "/api/placeholder/600/900",
        backdropUrl: "/api/placeholder/1200/500",
        runtime: 140,
        genres: ["Action", "Adventure", "Drama"],
        synopsis: "Queen Shuri must unite Wakanda against a new global threat while dealing with the emergence of a mysterious new Black Panther.",
        director: "Ryan Coogler",
        starring: ["Letitia Wright", "Lupita Nyong'o", "Danai Gurira", "Winston Duke"],
        trailerUrl: "#",
        rating: "PG-13",
        anticipationScore: 90,
        isWatchlisted: true,
        isNotified: false,
        productionStage: "Filming",
        promotionalLabel: null,
        previewImages: [
            "/api/placeholder/600/400",
            "/api/placeholder/600/400",
            "/api/placeholder/600/400"
        ],
        specialFeatures: ["IMAX", "Dolby Cinema"],
        productionCompany: "Marvel Studios"
    },
    {
        id: 6,
        title: "Oppenheimer II: The Hydrogen Age",
        releaseDate: "2025-09-05",
        posterUrl: "/api/placeholder/600/900",
        backdropUrl: "/api/placeholder/1200/500",
        runtime: 165,
        genres: ["Drama", "History", "Biography"],
        synopsis: "Following the success of the Manhattan Project, J. Robert Oppenheimer faces new ethical dilemmas as the Cold War escalates and his loyalty is questioned.",
        director: "Christopher Nolan",
        starring: ["Cillian Murphy", "Matt Damon", "Florence Pugh", "Robert Downey Jr."],
        trailerUrl: "#",
        rating: "R",
        anticipationScore: 89,
        isWatchlisted: false,
        isNotified: false,
        productionStage: "Pre-Production",
        promotionalLabel: "Award-Winning Sequel",
        previewImages: [
            "/api/placeholder/600/400",
            "/api/placeholder/600/400",
            "/api/placeholder/600/400"
        ],
        specialFeatures: ["IMAX 70mm", "Film Projection"],
        productionCompany: "Universal Pictures"
    }
];

// Genre filter options
const genreOptions = [
    "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "History", "Horror", "Musical", "Mystery",
    "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"
];

const MovieCard = ({ movie, view, setSelectedMovie }) => {
    const formattedDate = format(parseISO(movie.releaseDate), 'MMMM d, yyyy');
    const isComingSoon = isAfter(parseISO(movie.releaseDate), new Date());
    const daysUntilRelease = Math.ceil((parseISO(movie.releaseDate) - new Date()) / (1000 * 60 * 60 * 24));

    const toggleWatchlist = (e) => {
        e.stopPropagation();
        // Implementation would go here
        console.log(`Toggle watchlist for ${movie.title}`);
    };

    const toggleNotification = (e) => {
        e.stopPropagation();
        // Implementation would go here
        console.log(`Toggle notification for ${movie.title}`);
    };

    if (view === 'grid') {
        return (
            <motion.div
                className="group cursor-pointer relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedMovie(movie)}
            >
                <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div className="flex gap-2 mb-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                                            onClick={toggleWatchlist}
                                        >
                                            {movie.isWatchlisted ? (
                                                <Heart className="h-4 w-4 fill-primary text-primary" />
                                            ) : (
                                                <Heart className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <p>{movie.isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                                            onClick={toggleNotification}
                                        >
                                            {movie.isNotified ? (
                                                <Bell className="h-4 w-4 fill-primary text-primary" />
                                            ) : (
                                                <Bell className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <p>{movie.isNotified ? 'Disable notifications' : 'Notify me on release'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <DialogTrigger asChild>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                                            >
                                                <Play className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Watch trailer</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </DialogTrigger>
                        </div>
                    </div>

                    {movie.promotionalLabel && (
                        <Badge variant="default" className="absolute top-2 left-2 bg-primary text-primary-foreground">
                            {movie.promotionalLabel}
                        </Badge>
                    )}

                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                        <span>{movie.anticipationScore}%</span>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-bold text-base line-clamp-1">{movie.title}</h3>

                    <div className="mt-1 flex items-center text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        <span>{formattedDate}</span>
                        {isComingSoon && (
                            <Badge variant="outline" size="sm" className="ml-2 text-[10px] h-4">
                                In {daysUntilRelease} days
                            </Badge>
                        )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                        {movie.genres.slice(0, 3).map((genre, index) => (
                            <Badge key={index} variant="outline" className="text-xs font-normal">
                                {genre}
                            </Badge>
                        ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-xs">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                        </div>

                        <Badge variant="secondary" className="text-xs">
                            {movie.productionStage}
                        </Badge>
                    </div>
                </div>
            </motion.div>
        );
    } else {
        // List view
        return (
            <motion.div
                className="group cursor-pointer relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md flex mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedMovie(movie)}
            >
                <div className="relative h-40 w-28 shrink-0 overflow-hidden">
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                    />
                    {movie.promotionalLabel && (
                        <Badge variant="default" className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px]">
                            {movie.promotionalLabel}
                        </Badge>
                    )}
                </div>

                <div className="flex flex-col justify-between p-4 w-full">
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-base">{movie.title}</h3>
                            <div className="flex items-center gap-1 bg-background/80 rounded-full px-2 py-1 text-xs font-medium">
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                <span>{movie.anticipationScore}%</span>
                            </div>
                        </div>

                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            <span>{formattedDate}</span>
                            {isComingSoon && (
                                <Badge variant="outline" className="ml-2 text-[10px] h-4">
                                    In {daysUntilRelease} days
                                </Badge>
                            )}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                            {movie.genres.map((genre, index) => (
                                <Badge key={index} variant="outline" className="text-xs font-normal">
                                    {genre}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Open trailer");
                                }}
                            >
                                <Play className="h-3 w-3 mr-1" />
                                Trailer
                            </Button>

                            <Button
                                size="sm"
                                variant={movie.isWatchlisted ? "default" : "outline"}
                                className="h-8 px-2 text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleWatchlist(e);
                                }}
                            >
                                <Heart className={cn("h-3 w-3 mr-1", movie.isWatchlisted && "fill-primary-foreground")} />
                                {movie.isWatchlisted ? "Watchlisted" : "Watchlist"}
                            </Button>

                            <Button
                                size="sm"
                                variant={movie.isNotified ? "default" : "outline"}
                                className="h-8 px-2 text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleNotification(e);
                                }}
                            >
                                <Bell className={cn("h-3 w-3 mr-1", movie.isNotified && "fill-primary-foreground")} />
                                {movie.isNotified ? "Notified" : "Notify Me"}
                            </Button>
                        </div>

                        <Badge variant="secondary" className="text-xs">
                            {movie.productionStage}
                        </Badge>
                    </div>
                </div>
            </motion.div>
        );
    }
};

const MovieDetailView = ({ movie, onClose }) => {
    const formattedDate = format(parseISO(movie.releaseDate), 'MMMM d, yyyy');
    const daysUntilRelease = Math.ceil((parseISO(movie.releaseDate) - new Date()) / (1000 * 60 * 60 * 24));

    const genreColors = {
        "Action": "bg-red-500/10 text-red-500",
        "Adventure": "bg-amber-500/10 text-amber-500",
        "Animation": "bg-blue-500/10 text-blue-500",
        "Biography": "bg-purple-500/10 text-purple-500",
        "Comedy": "bg-yellow-500/10 text-yellow-500",
        "Crime": "bg-slate-500/10 text-slate-500",
        "Drama": "bg-indigo-500/10 text-indigo-500",
        "Sci-Fi": "bg-cyan-500/10 text-cyan-500",
        "Thriller": "bg-orange-500/10 text-orange-500",
        "Mystery": "bg-violet-500/10 text-violet-500",
        "History": "bg-emerald-500/10 text-emerald-500"
    };

    return (
        <div className="flex flex-col h-full">
            <div className="relative w-full h-[300px] overflow-hidden rounded-t-lg">
                <img
                    src={movie.backdropUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-6 flex gap-4">
                    <div className="relative h-40 w-28 overflow-hidden rounded-lg border-4 border-background shadow-xl">
                        <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col justify-end">
                        <h2 className="text-2xl font-bold">{movie.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                                {movie.rating}
                            </Badge>
                            <div className="flex items-center text-sm">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                <span className="font-medium">{movie.anticipationScore}%</span>
                                <span className="text-muted-foreground ml-1">Anticipation</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center text-sm">
                                <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>{formattedDate}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                    In {daysUntilRelease} days
                                </Badge>
                            </div>
                            <div className="flex items-center text-sm">
                                <Clock3 className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogClose className="absolute top-4 right-4 rounded-full p-1 bg-background/80 backdrop-blur-sm hover:bg-background">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" />
                        </svg>
                    </Button>
                </DialogClose>
            </div>

            <div className="px-6 pt-4 pb-6 overflow-y-auto">
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <Button
                        className="flex flex-col items-center justify-center h-auto py-3"
                        variant={movie.isWatchlisted ? "default" : "outline"}
                        onClick={() => console.log("Toggle watchlist")}
                    >
                        <Heart className={cn("h-5 w-5 mb-1", movie.isWatchlisted && "fill-primary-foreground")} />
                        <span className="text-xs">{movie.isWatchlisted ? "Watchlisted" : "Add to Watchlist"}</span>
                    </Button>

                    <Button
                        className="flex flex-col items-center justify-center h-auto py-3"
                        variant={movie.isNotified ? "default" : "outline"}
                        onClick={() => console.log("Toggle notification")}
                    >
                        <Bell className={cn("h-5 w-5 mb-1", movie.isNotified && "fill-primary-foreground")} />
                        <span className="text-xs">{movie.isNotified ? "Notifications On" : "Get Notified"}</span>
                    </Button>

                    <Button
                        className="flex flex-col items-center justify-center h-auto py-3"
                        variant="outline"
                        onClick={() => console.log("Watch trailer")}
                    >
                        <Play className="h-5 w-5 mb-1" />
                        <span className="text-xs">Watch Trailer</span>
                    </Button>

                    <Button
                        className="flex flex-col items-center justify-center h-auto py-3"
                        variant="outline"
                        onClick={() => console.log("Share movie")}
                    >
                        <Share className="h-5 w-5 mb-1" />
                        <span className="text-xs">Share</span>
                    </Button>
                </div>

                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 mb-4">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="images">Images</TabsTrigger>
                        <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="px-1">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Synopsis</h3>
                                <p className="text-sm text-muted-foreground">{movie.synopsis}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Genres</h3>
                                <div className="flex flex-wrap gap-2">
                                    {movie.genres.map((genre, index) => (
                                        <Badge
                                            key={index}
                                            className={cn("text-xs font-normal", genreColors[genre] || "bg-primary/10 text-primary")}
                                        >
                                            {genre}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Director</h3>
                                    <p className="text-sm">{movie.director}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Production</h3>
                                    <p className="text-sm">{movie.productionCompany}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Release Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Release Date:</span>
                                        <span>{formattedDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Production Status:</span>
                                        <Badge variant="outline">{movie.productionStage}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Runtime:</span>
                                        <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default CommingSoon;