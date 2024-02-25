interface RentalPeriod {
  start: Date;
  end: Date;
}

export type RentalDates = Array<RentalPeriod>;

export interface Rental {
  id: string;
  rate: number;
  address: string;
  type: "beach" | "lake" | "apartment" | "barn";
  rentalDates: RentalDates;
}

// using Omit<Rental, 'id'> util type creates very ugly openAPI schema name
export interface NewRental {
  rate: number;
  address: string;
  rentalDates: RentalDates;
  type: "beach" | "lake" | "apartment" | "barn";
}

export interface BookingRental {
  rentedDates: Array<Date>;
}
