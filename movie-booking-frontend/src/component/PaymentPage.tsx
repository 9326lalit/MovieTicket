

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "../socket";

// Import shadcn components
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const { movie, date, time, seats, totalPrice } = location.state || {};
  // console.log("payment seats", seats);
  // console.log("total price", totalPrice);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>No booking details available</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please return to the booking page and select a movie, date, time, and seats.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    socket.on("booking-confirmed", (data) => {
      // console.log("Received real-time booking data:", data);
      toast.success("New booking confirmed!");
    });

    return () => socket.off("booking-confirmed");
  }, []);

  const handlePaymentSubmit = async () => {
    const newErrors: any = {};
    if (!cardNumber || cardNumber.length < 5) newErrors.cardNumber = "Card number is invalid";
    if (!expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (!cvv || cvv.length !== 3) newErrors.cvv = "CVV is invalid";
    if (!fullName) newErrors.fullName = "Full name is required";
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";
    if (!phone || phone.length < 10) newErrors.phone = "Phone number is invalid";
    setErrors(newErrors);


    if (Object.keys(newErrors).length === 0) {
      try {
        setIsProcessing(true);

        // Send booking details to backend
        const response = await axios.post("https://movizonebackend.onrender.com/api/bookings/booking", {
          movieTitle: movie.title,
          movieId: movie._id,
          date,
          time,
          //     seats:[{ "id": "A1",
          //       "row": "A",
          //       "number": 1,
          //       "type": "Regular",
          //       "price": 200,
          //       "isBooked": true},{"id": "A2",
          // "row": "A",
          // "number": 2,
          // "type": "Regular",
          // "price": 200,
          // "isBooked": true}],
          seats: seats,
          totalPrice: totalPrice,
          fullName,
          email,
          phone,
          paymentMethod,
          cardNumber,
        });

        if (response.status === 200 || response.status === 201) {
          toast.success("🎉 Payment & Booking Successful!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error("Something went wrong. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        // console.error("Payment error:", error);
        toast.error("Payment failed. Please check your details and try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Format date to be more readable
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Booking Summary */}
          <div className="lg:col-span-5">
            <Card className="overflow-hidden">
              <CardHeader className="bg-slate-900 text-white">
                <CardTitle className="flex items-center">
                  <span className="mr-2">🎟️</span> Booking Summary
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Review your movie tickets
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="flex space-x-4 items-start mb-6">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-lg shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{movie.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-amber-500 mr-1">⭐</span>
                      <span className="text-sm font-medium">{movie.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {movie.language}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {movie.genre}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-slate-500 mr-2">📅</span>
                      <span className="text-sm font-medium">Date</span>
                    </div>
                    <span className="text-sm">{formattedDate}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-slate-500 mr-2">🕒</span>
                      <span className="text-sm font-medium">Time</span>
                    </div>
                    <span className="text-sm">{time}</span>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-slate-500 mr-2">💺</span>
                      <span className="text-sm font-medium">Seats</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {/* {seats.map((i, seat) => (
                        <p key={i}>
                          Row: {seat.row}, Number: {seat.number}, Type: {seat.type}, Price: ₹{seat.price}
                          {seats}
                        </p>
                      ))} */}

                      {seats.map((seats: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {seats}
                        </Badge>
                      ))}


                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-slate-900">Total Price:</span>
                  <span className="text-lg font-bold text-green-600">${totalPrice}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Form */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">💳</span> Payment Details
                </CardTitle>
                <CardDescription>
                  Complete your booking by providing payment information
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit" id="credit-card" />
                        <Label htmlFor="credit-card" className="font-normal">Credit / Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="wallet" id="digital-wallet" disabled />
                        <Label htmlFor="digital-wallet" className="font-normal text-slate-400">Digital Wallet (Coming soon)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className={errors.cardNumber ? "border-red-500" : ""}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <Input
                        id="expiry-date"
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        className={errors.expiryDate ? "border-red-500" : ""}
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-sm">{errors.expiryDate}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        className={errors.cvv ? "border-red-500" : ""}
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-sm">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Cardholder Name</Label>
                    <Input
                      id="full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(123) 456-7890"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                  className="w-full py-6"
                  size="lg"
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>Pay ${totalPrice} & Confirm Booking</span>
                  )}
                </Button>
                <p className="text-xs text-center text-slate-500">
                  By proceeding, you agree to our terms of service and privacy policy
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PaymentPage;