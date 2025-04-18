import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Input,  Radio, Label } from "shadcn-react";
import { RadioGroup } from "shadcn-react/ui";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const { movie, date, time, seats, totalPrice } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<any>({});

  if (!movie || !date || !time || !seats) {
    return <div>No booking details available.</div>;
  }

  const handlePaymentSubmit = () => {
    // Basic validation
    const newErrors: any = {};
    if (!cardNumber || cardNumber.length < 16) newErrors.cardNumber = "Card number is invalid";
    if (!expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (!cvv || cvv.length !== 3) newErrors.cvv = "CVV is invalid";
    if (!fullName) newErrors.fullName = "Full name is required";
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";
    if (!phone || phone.length < 10) newErrors.phone = "Phone number is invalid";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsProcessing(true);
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        alert("Payment Successful!");
      }, 2000);
    }
  };

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
            <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
              <div className="flex items-center space-x-3">
                <Radio id="credit-debit-card" name="payment-method" value="credit" />
                <Label htmlFor="credit-debit-card" className="text-gray-700 font-medium">
                  Credit / Debit Card
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Card Info */}
          <div className="space-y-4">
            <Input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Card Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
            <div className="flex space-x-4">
              <Input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                className="w-1/2 px-4 py-3 border border-gray-300 rounded-md"
              />
              {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
              <Input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="CVV"
                className="w-1/2 px-4 py-3 border border-gray-300 rounded-md"
              />
              {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
            </div>
          </div>

          {/* Billing Info */}
          <div className="mt-6 space-y-3">
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          {/* Confirm Button */}
          <div className="mt-8">
            <Button
              onClick={handlePaymentSubmit}
              disabled={isProcessing}
              className={`w-full py-3 ${isProcessing ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} text-white text-lg font-semibold rounded-md transition-all duration-300`}
            >
              {isProcessing ? "Processing..." : `Pay ₹${totalPrice} & Confirm Booking`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
