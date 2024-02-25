import { randomUUID } from "crypto";
import type { NewRental, Rental, RentalDates } from "./rentals.model";

const rentals: Array<Rental> = [
  {
    id: "1400dd4f-4884-47d4-9d0c-8abc4e66b9af",
    address: "9587 Lexington Ave. Streamwood, IL 60107",
    rate: 1750,
    rentalDates: [],
    type: "beach",
  },
  {
    id: "c9196ec8-fd59-42c4-a1e1-8c680d00c79e",
    address: "785 Stillwater St. Kingsport, TN 37660",
    rate: 2000,
    rentalDates: [],
    type: "beach",
  },
  {
    id: "41cbec94-8669-49d2-9f88-c8a5098ce030",
    address: "9564 South Green Hill Ave. Easton, PA 18042",
    rate: 650,
    rentalDates: [],
    type: "apartment",
  },
  {
    id: "2d6c67fa-38cb-455b-8a98-fd746371e678",
    address: "8131 Griffin Ave. Hollywood, FL 33020",
    rate: 500,
    rentalDates: [],
    type: "apartment",
  },
  {
    id: "dc8423ee-57cd-4074-9665-c7e563221c54",
    address: "895 North Race Ct. Latrobe, PA 15650",
    rate: 400,
    rentalDates: [],
    type: "barn",
  },
  {
    id: "66df28e7-1ad9-4a27-a36b-f8640667d486",
    address: "267 Big Rock Cove Ave. Newington, CT 06111",
    rate: 350,
    rentalDates: [],
    type: "barn",
  },
  //
  {
    id: "c53266ef-111b-4565-92f7-dc407ffd3557",
    address: "64 Garfield St. Knoxville, TN 37918",
    rate: 1250,
    rentalDates: [],
    type: "lake",
  },
  {
    id: "2d6c67fa-38cb-455b-8a98-fd746371e678",
    address: "994 San Pablo Rd. Hyattsville, MD 20782",
    rate: 750,
    rentalDates: [],
    type: "lake",
  },
  {
    id: "be82ae67-ec23-4be5-824e-af11c98103cb",
    address: "283 Beech St. New Albany, IN 471500",
    rate: 1500,
    rentalDates: [],
    type: "lake",
  },
  {
    id: "af6240c0-ab68-49e2-a85a-6c6c7b1e8210",
    address: "552 Plymouth St. Greenwood, SC 29646",
    rate: 1000,
    rentalDates: [],
    type: "beach",
  },
];

export class RentalsService {
  public async get(id: string): Promise<Rental | undefined> {
    // add getById(id) logic here from mongo??

    const rental = rentals.find((rental) => rental.id === id);

    return rental;
  }

  public async getAll(): Promise<Array<Rental>> {
    return rentals;
  }

  public create(newRental: NewRental): Rental | undefined {
    const existingRental = rentals.find((rental) => rental.address === newRental.address);

    if (existingRental) return undefined;

    const rental = { id: randomUUID(), ...newRental };
    rentals.push(rental);

    return rental;
  }

  public bookRental(rentalID: string, rentalDates: RentalDates): void {
    console.log(rentalID, rentalDates);
    // check overlap in dates
    // check if any of these dates have overlap with existing rentalDates
    // update rentalDates
    // delete any dates in past, however this would probably be something that is triggered from a 'check out' type flow from UI
  }

  public delete(rentalID: string): void {
    console.log(rentalID);
    // rentals.splice()
  }

  // public update(rental: P)
}
