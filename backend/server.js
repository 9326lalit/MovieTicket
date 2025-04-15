// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import connectDB from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import bookingRoutes from './routes/bookingRoutes.js';
// import movieRoutes from './routes/movieRoutes.js';
// import showRoutes from './routes/showRoutes.js';
// import { Server } from 'socket.io';
// import http from 'http';
// import setupSocket from './sockets/index.js';

// dotenv.config();
// connectDB();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*'
//   }
// });

// setupSocket(io);

// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/movies', movieRoutes);
// app.use('/api/shows', showRoutes);

// app.get('/', (req, res) => res.send('API is running'));

// server.listen(process.env.PORT || 5000, () => {
//   console.log(`Server running on port ${process.env.PORT || 8800}`);
// });


// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import showRoutes from './routes/showRoutes.js';
import { Server } from 'socket.io';
import http from 'http';
import setupSocket from './sockets/index.js';
import theaterRoutes from './routes/theaterRoutes.js';


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

setupSocket(io);

app.set('io', io); // Make IO available in routes

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/theaters', theaterRoutes);


app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});








// Now in your client (SeatSelector.tsx), use useEffect to connect with WebSocket:

/*
useEffect(() => {
  const socket = io('http://localhost:5000');

  selectedSeats.forEach((seat) => {
    socket.emit('seatSelected', {
      movieId: id,
      row: seat.row,
      number: seat.number,
    });
  });

  socket.on('seatUpdate', (updatedSeat) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.row === updatedSeat.row && seat.number === updatedSeat.number
          ? { ...seat, isBooked: true }
          : seat
      )
    );
  });

  return () => socket.disconnect();
}, [selectedSeats]);
*/

// Ensure you add `setSeats` using useState in SeatSelector
// const [seats, setSeats] = useState<Seat[]>(generateSeats());
