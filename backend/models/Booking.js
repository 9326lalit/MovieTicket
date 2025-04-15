import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show' },
  seats: [String],
  totalAmount: Number,
  status: { type: String, default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;