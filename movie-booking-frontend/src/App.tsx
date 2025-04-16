// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import SeatSelector from './component/SeatSelector.tsx';
import  Profile  from './pages/Profile.tsx';
import PaymentPage from './component/PaymentPage.tsx';
import Navbar from './component/Navbar.tsx';
import CreateMovie from './admin/CreateMovie.tsx';
import CreateShow from './admin/CreateShow.tsx';
import Auth from './auth/Auth.tsx';
// import CommingSoon from './pages/comingsoon.tsx';


const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createmovie" element={<CreateMovie />} />
        <Route path="/createShow" element={<CreateShow />} />

        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/movie/:movieId" element={<SeatSelector />} />
        {/* <Route path="/movie/coming-soon" element={<CommingSoon />} /> */}


        <Route path="/auth" element={<Auth />} />

        </Routes>

    </Router>
  );
};

export default App;
