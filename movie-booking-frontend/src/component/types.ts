// types.ts
export interface Show {
    _id: string;
    date: string;
    time: string;
    price: number;
    bookedSeats: string[];
    movie: {
      title: string;
      description: string;
      posterUrl: string;
      rating: string;
      duration: number;
      genre?: string;
      director?: string;
      cast?: string[];
    };
    theater: {
      _id?: string;
      name: string;
      location: string;
      facilities?: string[];
    };
  }
  
  export interface SeatInfo {
    id: string;
    row: string;
    number: number;
    type: "standard" | "premium" | "vip";
    price: number;
    isBooked: boolean;
  }
  
  export interface ShowTime {
    time: string;
    showId: string;
  }