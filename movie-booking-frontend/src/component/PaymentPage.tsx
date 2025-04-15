import React from "react";
import { useLocation } from "react-router-dom";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const { movie, date, time, seats, totalPrice } = location.state || {};

  if (!movie || !date || !time || !seats) {
    return <div>No booking details available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex justify-center items-center">
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-xl rounded-2xl overflow-hidden">
        
        {/* Left Column - Booking Summary */}
        <div className="p-6 bg-gradient-to-br from-white to-gray-100 rounded-xl border border-gray-200 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎟️ Booking Summary</h2>
          
          {/* Movie Info */}
          <div className="flex space-x-4 items-center mb-6">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-24 h-36 object-cover rounded-lg shadow-sm"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{movie.title}</h3>
              <p className="text-sm text-gray-600 mt-1">⭐ {movie.rating}</p>
              <p className="text-sm text-gray-500 mt-2">{movie.language} | {movie.genre}</p>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="space-y-4 text-sm text-gray-700 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <span className="font-medium">📅 Date:</span>
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">🕒 Time:</span>
              <span>{time}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">💺 Seats:</span>
              <span>{seats.join(", ")}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-900">
              <span>Total Price:</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Form */}
        <div className="p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">💳 Payment Options</h3>

          {/* Payment Type */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment-method"
                className="form-radio text-blue-600"
                defaultChecked
              />
              <span className="text-gray-700 font-medium">Credit / Debit Card</span>
            </label>
          </div>

          {/* Card Info */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-1/2 px-4 py-3 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-1/2 px-4 py-3 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Billing Info */}
          <div className="mt-6 space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
          </div>

          {/* Confirm Button */}
          <div className="mt-8">
            <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-md transition-all duration-300">
              Pay ₹{totalPrice} & Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
 