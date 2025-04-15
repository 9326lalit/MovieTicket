import mongoose from 'mongoose';
const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater' },
  date: String,
  time: String,
  price: Number,
  bookedSeats: [String] // example: ["A1", "B2"]
});
const Show = mongoose.model('Show', showSchema);
export default Show;