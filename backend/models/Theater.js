import mongoose from 'mongoose';
const theaterSchema = new mongoose.Schema({
  name: String,
  location: String,
  seats: Number
});
const Theater = mongoose.model('Theater', theaterSchema);
export default Theater;