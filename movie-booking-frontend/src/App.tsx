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
import Dashboard from './admin/Dashborad.tsx';
import DashboardLayout from './admin/DashboardLayout.tsx';
import ManageShows from './admin/ManageShows.tsx';
import CreateTheater from './admin/CreateTheater.tsx';
import CommingSoon from './pages/comingsoon.tsx';
import AllBookings from './admin/AllBookings.tsx';
// import CommingSoon from './pages/comingsoon.tsx';


const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/movies/comingsoon" element={<CommingSoon />} />

       

        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/movie/:movieId" element={<SeatSelector />} />
        {/* <Route path="movies/coming-soon" element={<CommingSoon />} /> */}


        <Route path="/auth" element={<Auth />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="createmovie" element={<CreateMovie />} />
          <Route path="createtheater" element={<CreateTheater />} />
          <Route path="createshow" element={<CreateShow />} />
          <Route path="manageshows" element={<ManageShows />} />
          <Route path="bookings" element={<AllBookings />} />
        </Route>
      </Routes>

        
    </Router>
  );
};

export default App;
