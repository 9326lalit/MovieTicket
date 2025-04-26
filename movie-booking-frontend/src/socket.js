// socket.js
import { io } from "socket.io-client";

const socket = io('https://movizonebackend.onrender.com', {
    transports: ['websocket', 'polling'],
    withCredentials: true
  });
  
export default socket;
