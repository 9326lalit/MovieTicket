// // ComingSoon.tsx
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../components/ui/card";
// import {
//   Video,
//   CalendarDays,
//   Clock,
//   Twitter,
//   Facebook,
//   Instagram,
//   X,
  
// } from "lucide-react";
// import { toast } from "sonner";

// // Countdown hook
// const useCountdown = (targetDate: Date) => {
//   const countDownDate = targetDate.getTime();
//   const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCountDown(countDownDate - new Date().getTime());
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [countDownDate]);

//   const getReturnValues = (countDown: number) => {
//     // calculate time
//     const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
//     return [days, hours, minutes, seconds];
//   };

//   return getReturnValues(countDown);
// };

// const ComingSoon = () => {
//   const releaseDate = new Date("2025-05-25T00:00:00");
//   const [days, hours, minutes, seconds] = useCountdown(releaseDate);
//   const [showTrailer, setShowTrailer] = useState(false);
//   const [email, setEmail] = useState("");

//   const handleShowTrailer = () => setShowTrailer(!showTrailer);
//   const handleSubscribe = () => {
//     if (!email || !email.includes("@")) {
//       toast.error("Please enter a valid email");
//       return;
//     }
//     toast.success("Subscribed successfully!");
//     setEmail("");
//   };

//   const share = (platform: string) => {
//     const url = encodeURIComponent(window.location.href);
//     let shareUrl = "";
//     switch(platform) {
//       case "twitter": shareUrl = `https://twitter.com/intent/tweet?url=${url}`; break;
//       case "facebook": shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
//       case "instagram": shareUrl = `https://www.instagram.com/?url=${url}`; break;
//     }
//     window.open(shareUrl, "_blank");
//   };

//   return (
//     <div className="relative overflow-hidden min-h-screen bg-black text-white">
//       {/* Animated Gradient Background */}
//       <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 opacity-30"></div>

//       <motion.header
//         className="relative z-10 flex justify-between items-center p-6"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <h1 className="text-3xl font-bold tracking-wider">🎥 Coming Soon</h1>
//         <Button variant="ghost" className="text-white border-white" onClick={handleShowTrailer}>
//           <Video className="mr-2" /> Trailer
//         </Button>
//       </motion.header>

//       <motion.main
//         className="relative z-10 flex flex-col items-center text-center p-6 pt-20"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3, duration: 0.8 }}
//       >
//         <img
//           src="https://i0.wp.com/www.newsbugz.com/wp-content/uploads/2021/08/ganapath-movie.jpg?w=1480&ssl=1"
//           alt="Poster"
//           className="w-64 h-auto rounded-lg shadow-lg mb-6"
//         />
//         <motion.h2
//           className="text-4xl font-extrabold mb-4"
//           initial={{ scale: 0.8 }}
//           animate={{ scale: 1 }}
//           transition={{ type: "spring", stiffness: 100, damping: 10 }}
//         >
//           <span className="text-yellow-400">Movie Title</span>
//         </motion.h2>
//         <div className="flex gap-6 mb-8">
//           {[
//             { Icon: CalendarDays, label: "May 25, 2025" },
//             { Icon: Clock, label: "2h 30m" },
//           ].map((item, idx) => (
//             <div key={idx} className="flex items-center gap-2">
//               <item.Icon className="text-yellow-300" />
//               <span>{item.label}</span>
//             </div>
//           ))}
//         </div>

//         {/* Countdown Timer */}
//         <div className="flex gap-4 text-lg font-mono mb-8">
//           <div>{days}d</div>
//           <div>{hours}h</div>
//           <div>{minutes}m</div>
//           <div>{seconds}s</div>
//         </div>

//         <Card className="w-full max-w-md bg-white text-black p-4 rounded-xl shadow-md">
//           <CardHeader>
//             <CardTitle>Get Notified</CardTitle>
//             <CardDescription>Subscribe for updates</CardDescription>
//           </CardHeader>
//           <CardContent className="flex gap-2">
//             <Input
//               placeholder="Your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <Button onClick={handleSubscribe}>Subscribe</Button>
//           </CardContent>
//         </Card>

//         {/* Social Share */}
//         <div className="flex gap-6 mt-8">
//           {[
//             { Icon: Twitter, key: "twitter" },
//             { Icon: Facebook, key: "facebook" },
//             { Icon: Instagram, key: "instagram" },
//           ].map((item) => (
//             <item.Icon
//               key={item.key}
//               className="w-8 h-8 cursor-pointer hover:text-yellow-300 transition"
//               onClick={() => share(item.key)}
//             />
//           ))}
//         </div>
//       </motion.main>

//       {/* Trailer Modal */}
//       {showTrailer && (
//         <motion.div
//           className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="relative w-full max-w-2xl">
//             <Button
//               variant="ghost"
//               className="absolute top-2 right-2 text-white text-2xl"
//               onClick={handleShowTrailer}
//             >
//               ×
//             </Button>
//             <iframe
//               width="100%"
//               height="360"
//               src="https://www.youtube.com/embed/dQw4w9WgXcQ"
//               title="Trailer"
//               frameBorder="0"
//               allow="autoplay; encrypted-media"
//               allowFullScreen
//             />
//           </div>
//         </motion.div>
//       )}

//       <footer className="relative z-10 text-center p-4 text-sm text-gray-200">
//         © 2025 CineWorld Studios. All rights reserved.
//       </footer>

//       <style jsx global>{`
//         @keyframes gradient {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//         .animate-gradient {
//           background-size: 400% 400%;
//           animation: gradient 15s ease infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ComingSoon;



// ComingSoon.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Video,
  CalendarDays,
  Clock,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import { toast } from "sonner";

// Countdown hook
const useCountdown = (targetDate: Date) => {
  const countDownDate = targetDate.getTime();
  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [countDownDate]);

  const getReturnValues = (countDown: number) => {
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
    return [days, hours, minutes, seconds];
  };

  return getReturnValues(countDown);
};

const ComingSoon = () => {
  const releaseDate = new Date("2025-05-25T00:00:00");
  const [days, hours, minutes, seconds] = useCountdown(releaseDate);
  const [showTrailer, setShowTrailer] = useState(false);
  const [email, setEmail] = useState("");

  const handleShowTrailer = () => setShowTrailer(!showTrailer);
  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("Subscribed successfully!");
    setEmail("");
  };

  const share = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "instagram":
        shareUrl = `https://www.instagram.com/?url=${url}`;
        break;
    }
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-bl from-black via-gray-900 to-black text-white">
      

      <motion.main
        className="relative z-10 flex flex-col items-center text-center p-6 pt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <motion.img
          src="https://i0.wp.com/www.newsbugz.com/wp-content/uploads/2021/08/ganapath-movie.jpg?w=1480&ssl=1"
          alt="Movie Poster"
          className="w-72 h-auto rounded-xl shadow-2xl border-4 border-white/20 mb-8"
          whileHover={{ scale: 1.05 }}
        />
        <motion.h2
          className="text-5xl font-extrabold mb-4 text-yellow-400 drop-shadow-lg"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          Epic Saga: The Rise
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-lg text-gray-200">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-yellow-300" /> May 25, 2025
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-yellow-300" /> 2h 30m
          </div>
        </div>

        <div className="flex gap-6 text-xl font-mono bg-white/5 px-6 py-4 rounded-xl shadow-inner mb-10">
          <div>{days}d</div>
          <div>{hours}h</div>
          <div>{minutes}m</div>
          <div>{seconds}s</div>
        </div>

        <Card className="w-full max-w-md bg-white/10 text-white p-4 rounded-xl shadow-xl backdrop-blur">
          <CardHeader>
            <CardTitle>Stay in the Loop</CardTitle>
            <CardDescription>Get notified before the world does.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="Enter your email"
              className="bg-white/10 text-white border-white/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleSubscribe} className="bg-yellow-400 hover:bg-yellow-500 text-black">
              Notify Me
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-6 mt-8">
          {[
            { Icon: Twitter, key: "twitter" },
            { Icon: Facebook, key: "facebook" },
            { Icon: Instagram, key: "instagram" },
          ].map((item) => (
            <item.Icon
              key={item.key}
              className="w-8 h-8 cursor-pointer hover:text-yellow-400 transition duration-300"
              onClick={() => share(item.key)}
            />
          ))}
        </div>
      </motion.main>

      {showTrailer && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative w-full max-w-3xl">
            <Button
              variant="ghost"
              className="absolute top-2 right-2 text-white text-3xl hover:bg-white/10"
              onClick={handleShowTrailer}
            >
              ×
            </Button>
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/v5PHVVxoY6I"
              title="Movie Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-xl shadow-xl border border-white/10"
            />
          </div>
        </motion.div>
      )}

      <footer className="relative z-10 text-center p-6 text-sm text-gray-400 border-t border-white/10 mt-12">
        © 2025 CineBlast. All rights reserved.
      </footer>
    </div>
  );
};

export default ComingSoon;
