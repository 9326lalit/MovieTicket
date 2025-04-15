// src/pages/Home.tsx

import MovieList from "../component/MovieList";


const Home = () => {
  return (
    <div>
      <div className="p-6">
        {/* <h1 className="text-3xl mb-4">Welcome to Movie Ticket Booking</h1> */}
        <MovieList />
      </div>
    </div>
  );
};

export default Home;
