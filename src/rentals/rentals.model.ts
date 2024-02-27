interface RequestRentalPeriod {
  start: string;
  end: string;
}

export type RequestRentalDates = Array<RequestRentalPeriod>;

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

// using Omit<Rental, 'id' | 'rendalDates'> util type creates very ugly openAPI schema name
export interface NewRental {
  rate: number;
  address: string;
  type: "beach" | "lake" | "apartment" | "barn";
}

export interface BookingRental {
  rentedDates: Array<Date>;
}

export interface BookingInfo {
  dates: RentalDates;
  price: number;
}
