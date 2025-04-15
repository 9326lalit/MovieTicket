import Booking from '../models/Booking.js';

// Get bookings by user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('show movie theater');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create a new booking
export const createBooking = async (req, res) => {
  const { showId, seats, totalAmount } = req.body;
  const booking = new Booking({
    user: req.user.id,
    show: showId,
    seats,
    totalAmount,
  });

  try {
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
