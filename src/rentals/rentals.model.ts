export interface Rental {
  id: string;
  rate: number;
  address: string;
  type: "beach" | "lake" | "apartment" | "barn";
  rented: Array<Date>; // should be a tuple [Date, Date], not yet supported
  isAvailable: boolean;
}

// using Omit<Rental, 'id'> util type creates very ugly openAPI schema name
export interface NewRental {
  rate: number;
  address: string;
  rented: Array<Date>;
  type: "beach" | "lake" | "apartment" | "barn";
  isAvailable: boolean;
}
