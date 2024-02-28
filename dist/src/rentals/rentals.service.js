"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalsService = void 0;
const rentals_model_1 = require("./rentals.model");
const utils_1 = require("../lib/dayjs/utils");
const http_error_1 = require("../lib/http-error");
class RentalsService {
    async get(id) {
        const rental = new rentals_model_1.RentalModel().get(id);
        return rental;
    }
    async getAll() {
        const rentals = new rentals_model_1.RentalModel().getAll();
        return rentals;
    }
    create(newRental) {
        const rentalModel = new rentals_model_1.RentalModel();
        const existing = rentalModel.getByAddress(newRental.address);
        if (existing) {
            throw new http_error_1.HTTPError({
                code: "CONFLICT",
                message: "Rental already exists at this address.",
            });
        }
        const rental = rentalModel.create(newRental);
        return rental;
    }
    bookRental(rentalID, requestRentalDates) {
        const rentalModel = new rentals_model_1.RentalModel();
        const rental = rentalModel.get(rentalID);
        if (!rental) {
            throw new http_error_1.HTTPError({
                code: "NOT_FOUND",
                message: "Rental Not Found",
            });
        }
        if (requestRentalDates.length === 0) {
            throw new http_error_1.HTTPError({
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
        if (this.datesHaveOverlap(sortedDates)) {
            throw new http_error_1.HTTPError({
                code: "CONFLICT",
                message: "Booking Request Dates Have Overlap",
            });
        }
        if (this.datesHaveOverlapWithExistingBookings(rental.rentalDates, sortedDates)) {
            throw new http_error_1.HTTPError({
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
    checkin(rentalID) {
        // maybe this would trigger email verification and additional instructions to access property
        return rentalID;
    }
    checkout(rentalID) {
        // would delete associated date range from rental, etc
        return rentalID;
    }
    cancel(rentalID) {
        // if within certain timeframe, maybe bill a fine, email notifications to owner/user, etc
        return rentalID;
    }
    delete(rentalID) {
        console.log(rentalID);
        // rentals.splice()
    }
    // public update(rental: P)
    convertRequestToDatesOrThrow(requestRentalDates) {
        return requestRentalDates.map(({ start, end }) => {
            const startDate = new Date(start);
            const endDate = new Date(end);
            if ((0, utils_1.dateIsInvalid)(startDate) || (0, utils_1.dateIsInvalid)(endDate)) {
                throw new http_error_1.HTTPError({
                    code: "BAD_REQUEST",
                    message: "Invalid Booking Date",
                });
            }
            if ((0, utils_1.dateIsInThePast)(startDate) || (0, utils_1.dateIsInThePast)(endDate)) {
                throw new http_error_1.HTTPError({
                    code: "BAD_REQUEST",
                    message: "Date In Past",
                });
            }
            if ((0, utils_1.endIsBeforeStart)(startDate, endDate)) {
                throw new http_error_1.HTTPError({
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
    sortConvertedRentalDates(rentalDates) {
        return rentalDates.sort((a, b) => a.start.getTime() - b.start.getTime());
    }
    datesHaveOverlap(rentalDates) {
        for (let i = 1; i < rentalDates.length; i++) {
            const previous = rentalDates[i - 1];
            const current = rentalDates[i];
            if (previous && current) {
                const { start, end } = current;
                if ((0, utils_1.isBetween)(start, previous.start, previous.end) || (0, utils_1.isBetween)(end, previous.start, previous.end)) {
                    return true;
                }
            }
        }
        return false;
    }
    datesHaveOverlapWithExistingBookings(existingRentalDates, rentalDates) {
        for (let i = 0; i < rentalDates.length; i++) {
            const rentalDate = rentalDates[i];
            if (rentalDate) {
                const { start, end } = rentalDate;
                for (let j = 0; j < existingRentalDates.length; j++) {
                    const existingRentalDate = existingRentalDates[j];
                    if (existingRentalDate) {
                        const { start: exStart, end: exEnd } = existingRentalDate;
                        if ((0, utils_1.isBetween)(start, exStart, exEnd) || (0, utils_1.isBetween)(end, exStart, exEnd)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    calculateBookingTotal(rate, bookingDates) {
        let total = 0;
        for (let i = 0; i < bookingDates.length; i++) {
            const currentRange = bookingDates[i];
            if (currentRange) {
                const { start, end } = currentRange;
                const currentRangePrice = ((0, utils_1.differenceInDays)(start, end) + 1) * rate;
                total += currentRangePrice;
            }
        }
        return total;
    }
}
exports.RentalsService = RentalsService;
