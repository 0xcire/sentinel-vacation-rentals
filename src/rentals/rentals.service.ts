import { randomUUID } from "crypto";
// import dayjs from "../lib/day";
import type { NewRental, Rental, RequestRentalDates } from "./rentals.model";
import { isBetween } from "./utils";

const rentals: Array<Rental> = [
  {
    id: "1400dd4f-4884-47d4-9d0c-8abc4e66b9af",
    address: "9587 Lexington Ave. Streamwood, IL 60107",
    rate: 1750,
    rentalDates: [
      { start: new Date("2/25/2024"), end: new Date("2/27/2024") },
      { start: new Date("3/1/2024"), end: new Date("3/14/2024") },
      { start: new Date("3/15/2024"), end: new Date("3/25/2024") },
    ],
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

  // [ ]: need to address poor error handling
  // check not found ( mainly for type narrow )
  // [ ]: check dates are valid
  // [ ]: check dates are not in past
  // sort request dates
  // if no possible overlap, set rental
  // check reques overlap
  // check existing overlap
  // set
  public bookRental(
    rentalID: string,
    requestRentdalDates: RequestRentalDates
  ): [Rental | undefined, string | undefined] {
    const idx = rentals.map((rental) => rental.id).indexOf(rentalID);
    const rental = rentals[idx];

    // not found
    if (!rental) {
      return [undefined, "404"];
    }

    const rentalDates = requestRentdalDates
      .map((requestRentalDate) => {
        return {
          start: new Date(requestRentalDate.start),
          end: new Date(requestRentalDate.end),
        };
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    console.log(rentalDates);

    // no existing overlaps to check
    if (rental.rentalDates.length === 0 && rentalDates.length === 1) {
      rental.rentalDates = rentalDates;
      return [rental, undefined];
    }

    // checkRequestOverlap(rentalDates)
    for (let i = 1; i < rentalDates.length; i++) {
      const previous = rentalDates[i - 1];
      const current = rentalDates[i];

      if (previous && current) {
        // const { start, end } = previous;
        const { start, end } = current;

        if (isBetween(start, previous.start, previous.end)) {
          console.log("overlap in request");
          return [undefined, "409"];
        }

        if (isBetween(end, previous.start, previous.end)) {
          console.log("overlap in request");
          return [undefined, "409"];
        }
      }
    }

    //checkExistingOverlap(existing, request)
    for (let i = 0; i < rentalDates.length; i++) {
      const rentalDate = rentalDates[i];

      if (!rentalDate) {
        return [undefined, "400"];
      }

      const { start, end } = rentalDate;

      for (let j = 0; j < rental.rentalDates.length; j++) {
        const existingRentalDate = rental.rentalDates[j];
        if (!existingRentalDate) {
          return [undefined, "400"];
        }

        const { start: exStart, end: exEnd } = existingRentalDate;

        if (isBetween(start, exStart, exEnd)) {
          console.log("overlap with existing bookings");
          return [undefined, "409"];
        }

        if (isBetween(end, exStart, exEnd)) {
          console.log("overlap with existing bookings");
          return [undefined, "409"];
        }
      }
    }

    rentalDates.forEach((rentalDate) => rental.rentalDates.push(rentalDate));
    return [rental, undefined];

    // delete any dates in past, however this would probably be something that is triggered from a 'check out' type flow from UI
  }

  public delete(rentalID: string): void {
    console.log(rentalID);
    // rentals.splice()
  }

  // public update(rental: P)
}
