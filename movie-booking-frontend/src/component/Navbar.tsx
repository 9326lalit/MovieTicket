import { Link, NavLink } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useState } from 'react';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <div className="flex items-center">
        <div className="text-xl font-bold text-white">CineSphere</div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Movies..."
          className="p-2 bg-white rounded-md text-black focus:outline-none"
        />

        {/* Links */}
        <div className="hidden md:flex gap-6">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-yellow-300' : ''}>
            <Button className="text-white hover:bg-blue-700">Home</Button>
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => isActive ? 'text-yellow-300' : ''}>
            <Button className="text-white hover:bg-blue-700">Bookings</Button>
          </NavLink>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 p-2 bg-blue-700 rounded-full hover:bg-blue-800"
          >
            {/* Simple User SVG Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {/* Down Arrow */}
            <span className="text-white text-sm">▼</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md z-10">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
                Profile
              </Link>
              <Link to="/logout" className="block px-4 py-2 hover:bg-gray-200">
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Toggle */}
      <div className="md:hidden">
        <button
          onClick={toggleDropdown}
          className="p-2 bg-blue-700 rounded-full text-white"
        >
          ▼
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
