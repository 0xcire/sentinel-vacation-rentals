import type { NewRental, Rental } from "./rentals.model";

export class RentalsService {
  public get(id: string): Rental {
    const rental: Rental = {
      id: id,
      rate: 2500,
      address: "",
      rented: [new Date(), new Date()],
      type: "apartment",
      isAvailable: true,
    };
    return rental;
  }

  public create(rental: NewRental): NewRental {
    // creation logic
    return rental;
  }
}
