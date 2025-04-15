// import React from 'react';
// import { Link } from 'react-router-dom';

// interface Movie {
//   _id: string;
//   title: string;
//   image: string;
//   genre: string;
// }

// interface MovieCardProps {
//   movie: Movie;
// }

// const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
//   return (
//     <div
//       style={{
//         width: '250px',
//         margin: '20px',
//         borderRadius: '8px',
//         boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//         overflow: 'hidden',
//         backgroundColor: '#fff',
//         transition: 'transform 0.3s ease',
//       }}
//     >
//       {/* Movie Image */}
//       <img
//         src={movie.image}
//         alt={movie.title}
//         style={{
//           width: '100%',
//           height: '200px',
//           objectFit: 'cover',
//           borderTopLeftRadius: '8px',
//           borderTopRightRadius: '8px',
//         }}
//       />

//       {/* Movie Info */}
//       <div style={{ padding: '15px' }}>
//         <h3
//           style={{
//             fontSize: '18px',
//             fontWeight: 'bold',
//             color: '#333',
//             marginBottom: '10px',
//           }}
//         >
//           {movie.title}
//         </h3>
//         <p
//           style={{
//             fontSize: '14px',
//             color: '#777',
//             marginBottom: '15px',
//           }}
//         >
//           Genre: <span style={{ fontWeight: '600' }}>{movie.genre}</span>
//         </p>

//         {/* View Shows Button */}
//         <Link
//           to={`/movie/${movie._id}`}
//           style={{
//             display: 'inline-block',
//             padding: '10px 20px',
//             backgroundColor: '#007BFF',
//             color: '#fff',
//             textDecoration: 'none',
//             borderRadius: '5px',
//             fontSize: '14px',
//             fontWeight: 'bold',
//             textAlign: 'center',
//             transition: 'background-color 0.3s ease',
//           }}
//         >
//           View Shows
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default MovieCard;


interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
      <img
        src={movie.posterUrl || "/placeholder.png"}
        alt={movie.title}
        className="w-full h-48 object-cover rounded mb-3"
      />
      <h3 className="text-xl font-semibold">{movie.title}</h3>
      <p className="text-sm text-gray-500 mb-2">{movie.genre}</p>
      <p className="text-sm">{movie.description}</p>
      <button
        onClick={onClick}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Book Now
      </button>
    </div>
  );
};

export default MovieCard;
