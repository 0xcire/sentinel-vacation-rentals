import { RentalModel } from "./rentals.model";
import { dateIsInThePast, dateIsInvalid, differenceInDays, endIsBeforeStart, isBetween } from "../lib/dayjs/utils";
import { HTTPError } from "../lib/http-error";

import type { NewRental, Rental, RentalDates, RequestRentalDates, BookingInfo } from "./rentals.model";

export class RentalsService {
  public async get(id: string): Promise<Rental | undefined> {
    const rental = new RentalModel().get(id);

    return rental;
  }

  public async getAll(): Promise<Array<Rental>> {
    const rentals = new RentalModel().getAll();

    return rentals;
  }

  public create(newRental: NewRental): Rental | undefined {
    const rentalModel = new RentalModel();
    const existing = rentalModel.getByAddress(newRental.address);

    if (existing) {
      throw new HTTPError({
        code: "CONFLICT",
        message: "Rental already exists at this address.",
      });
    }

    const rental = rentalModel.create(newRental);

    return rental;
  }

  public bookRental(rentalID: string, requestRentalDates: RequestRentalDates): BookingInfo {
    const rentalModel = new RentalModel();
    const rental = rentalModel.get(rentalID);

    if (!rental) {
      throw new HTTPError({
        code: "NOT_FOUND",
        message: "Rental Not Found",
      });
    }

    if (requestRentalDates.length === 0) {
      throw new HTTPError({
        code: "BAD_REQUEST",
        message: "No Timeframe Specified",
      });
    }

    const convertedRentalDates = this.convertRequestToDatesOrThrow(requestRentalDates);

    const noOverlapPossible = rental.rentalDates.length === 0 && convertedRentalDates.length === 1;
    if (noOverlapPossible) {
      rentalModel.update(rentalID, { rentalDates: convertedRentalDates });
      const bookingTotal = this.calculateBookingTotal(rental.rate, convertedRentalDates);

      return {
        dates: convertedRentalDates,
        price: bookingTotal,
      };
    }

    const sortedDates = this.sortConvertedRentalDates(convertedRentalDates);

    if (this.requestRentalDatesHaveOverlap(sortedDates)) {
      throw new HTTPError({
        code: "CONFLICT",
        message: "Booking Request Dates Have Overlap",
      });
    }

    if (this.requestHasOverlapWithExistingBookings(rental.rentalDates, sortedDates)) {
      throw new HTTPError({
        code: "CONFLICT",
        message: "Booking Requests Have Overlap With Existing Bookings",
      });
    }

    rentalModel.update(rentalID, { rentalDates: sortedDates });

    const bookingTotal = this.calculateBookingTotal(rental.rate, sortedDates);
    return {
      dates: sortedDates,
      price: bookingTotal,
    };
  }

  public checkin(rentalID: string): string {
    // maybe this would trigger email verification and additional instructions to access property
    return rentalID;
  }

  public checkout(rentalID: string): string {
    // would delete associated date range from rental, etc
    return rentalID;
  }

  public cancel(rentalID: string): string {
    // if within certain timeframe, maybe bill a fine, email notifications to owner/user, etc
    return rentalID;
  }

  public delete(rentalID: string): void {
    console.log(rentalID);
    // rentals.splice()
  }

  // public update(rental: P)

  private convertRequestToDatesOrThrow(requestRentalDates: RequestRentalDates): RentalDates {
    return requestRentalDates.map(({ start, end }) => {
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (dateIsInvalid(startDate) || dateIsInvalid(endDate)) {
        throw new HTTPError({
          code: "BAD_REQUEST",
          message: "Invalid Booking Date",
        });
      }

      if (dateIsInThePast(startDate) || dateIsInThePast(endDate)) {
        throw new HTTPError({
          code: "BAD_REQUEST",
          message: "Date In Past",
        });
      }

      if (endIsBeforeStart(startDate, endDate)) {
        throw new HTTPError({
          code: "BAD_REQUEST",
          message: "Invalid Date Range",
        });
      }

      return {
        start: startDate,
        end: endDate,
      };
    });
  }

  private sortConvertedRentalDates(rentalDates: RentalDates): RentalDates {
    return rentalDates.sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  private requestRentalDatesHaveOverlap(rentalDates: RentalDates): boolean {
    for (let i = 1; i < rentalDates.length; i++) {
      const previous = rentalDates[i - 1];
      const current = rentalDates[i];

      if (previous && current) {
        const { start, end } = current;

        if (isBetween(start, previous.start, previous.end) || isBetween(end, previous.start, previous.end)) {
          return true;
        }
      }
    }
    return false;
  }

  private requestHasOverlapWithExistingBookings(existingRentalDates: RentalDates, rentalDates: RentalDates): boolean {
    for (let i = 0; i < rentalDates.length; i++) {
      const rentalDate = rentalDates[i];

      if (rentalDate) {
        const { start, end } = rentalDate;

        for (let j = 0; j < existingRentalDates.length; j++) {
          const existingRentalDate = existingRentalDates[j];

          if (existingRentalDate) {
            const { start: exStart, end: exEnd } = existingRentalDate;

            if (isBetween(start, exStart, exEnd) || isBetween(end, exStart, exEnd)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  private calculateBookingTotal(rate: number, bookingDates: RentalDates): number {
    let total = 0;
    for (let i = 0; i < bookingDates.length; i++) {
      const currentRange = bookingDates[i];
      if (currentRange) {
        const { start, end } = currentRange;
        const currentRangePrice = (differenceInDays(start, end) + 1) * rate;
        total += currentRangePrice;
      }
    }
    return total;
  }
}
