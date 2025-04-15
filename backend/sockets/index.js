// const setupSocket = (io) => {
//     io.on('connection', (socket) => {
//       console.log('User connected:', socket.id);
  
//       socket.on('seatSelected', ({ showId, seat }) => {
//         socket.broadcast.emit('seatBooked', { showId, seat });
//       });
  
//       socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//       });
//     });
//   };
//   export default setupSocket;


export default function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('seatSelected', (seatInfo) => {
      console.log('Seat selected:', seatInfo);
      socket.broadcast.emit('seatUpdate', seatInfo); // Notify others
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
