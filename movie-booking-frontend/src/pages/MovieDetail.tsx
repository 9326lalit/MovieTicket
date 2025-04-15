// src/pages/MovieDetail.tsx
import { useParams } from 'react-router-dom';
import Navbar from '../component/Navbar';
import SeatSelector from '../component/SeatSelector';
import BookingSummary from '../component/BookingSummary';


const MovieDetail = () => {
  const { movieTitle } = useParams<{ movieTitle: string }>();

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl mb-4">{movieTitle}</h1>
        <SeatSelector />
        <BookingSummary />
      </div>
    </div>
  );
};

export default MovieDetail;
