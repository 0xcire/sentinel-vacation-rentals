import { test, expect, describe } from "@jest/globals";
import { RentalsService } from "../../src/rentals/rentals.service";

const rentalID = "1400dd4f-4884-47d4-9d0c-8abc4e66b9af";

/**
 * Test data that produces 400 error code
 */
const noRequest = [];
const requestWithInvalidDates = [
  { start: "Dunkin Donuts", end: "2024-03-10T01:00:00" },
  { start: "2024-08-01T12:00:00", end: "2024-08-14T12:00:00" },
];
const requestWithDatesInPast = [
  { start: "2024-03-08T12:00:00", end: "2024-03-10T01:00:00" },
  { start: "2024-04-21T12:00:00", end: "2024-04-28T12:00:00" },
  { start: "2024-01-01T12:00:00", end: "2024-01-14T12:00:00" },
  { start: "2024-08-01T12:00:00", end: "2024-08-14T12:00:00" },
];
const requestWithEndBeforeStart = [
  { start: "2024-03-08T12:00:00", end: "2024-03-10T01:00:00" },
  { start: "2024-04-21T12:00:00", end: "2024-04-28T12:00:00" },
  { start: "2024-08-01T12:00:00", end: "2024-07-14T12:00:00" },
];

/**
 * Test data that produces 409 error code
 */
const requestWithOverlap = [
  { start: "2024-02-27T20:00:00", end: "2024-03-08T12:00:00" },
  { start: "2024-06-01T12:00:00", end: "2024-06-14T12:00:00" },
  { start: "2024-03-01T13:00:00", end: "2024-03-10T01:00:00" },
];
const requestWithOverlapWithExistingBookings = [
  { start: "2024-03-07T12:00:00", end: "2024-03-10T01:00:00" },
  { start: "2024-04-21T12:00:00", end: "2024-04-28T12:00:00" },
  { start: "2024-08-01T12:00:00", end: "2024-08-14T12:00:00" },
];

/**
 * Valid test request
 */
const validRequest = [
  { start: "2024-03-08T12:00:00", end: "2024-03-10T01:00:00" },
  { start: "2024-04-21T12:00:00", end: "2024-04-28T12:00:00" },
  { start: "2024-08-01T12:00:00", end: "2024-08-14T12:00:00" },
];

describe("RentalService.bookRental handles potential 400 errors properly", () => {
  test("throw if request is empty", () => {
    let code: number | undefined, message: string | undefined;
    try {
      new RentalsService().bookRental(rentalID, noRequest);
    } catch (error) {
      code = error.code;
      message = error.message;
    }
    expect(code).toBe(400);
    expect(message).toEqual("No Timeframe Specified");
  });

  test("throw in dates are invalid", () => {
    let code: number | undefined, message: string | undefined;
    try {
      new RentalsService().bookRental(rentalID, requestWithInvalidDates);
    } catch (error) {
      code = error.code;
      message = error.message;
    }
    expect(code).toBe(400);
    expect(message).toEqual("Invalid Booking Date");
  });

  test("throw if dates are in the past", () => {
    let code: number | undefined, message: string | undefined;
    try {
      new RentalsService().bookRental(rentalID, requestWithDatesInPast);
    } catch (error) {
      code = error.code;
      message = error.message;
    }
    expect(code).toBe(400);
    expect(message).toEqual("Date In Past");
  });

  test("throw if start date is before end date", () => {
    let code: number | undefined, message: string | undefined;
    try {
      new RentalsService().bookRental(rentalID, requestWithEndBeforeStart);
    } catch (error) {
      code = error.code;
      message = error.message;
    }
    expect(code).toBe(400);
    expect(message).toEqual("Invalid Date Range");
  });
});

describe("RentalService.bookRental handles potential 409 errors properly", () => {
  test("throw on request overlap", () => {
    let code: number | undefined, message: string | undefined;
    try {
      new RentalsService().bookRental(rentalID, requestWithOverlap);
    } catch (error) {
      code = error.code;
      message = error.message;
    }
    expect(code).toEqual(409);
    expect(message).toEqual("Booking Request Dates Have Overlap");
  });

  test("throw when request overlaps with existing bookings", () => {
    let code: number | undefined, message: string | undefined;
    try {
      const rental = new RentalsService().bookRental(rentalID, requestWithOverlapWithExistingBookings);
      console.log(rental);
    } catch (error) {
      code = error.code;
      message = error.message;
    }
    expect(code).toBe(409);
    expect(message).toEqual("Booking Requests Have Overlap With Existing Bookings");
  });
});

describe("RentalService.bookRental handles valid request properly", () => {
  test("return valid booking request data", () => {
    let code: number | undefined, message: string | undefined;
    let result: unknown;
    try {
      result = new RentalsService().bookRental(rentalID, validRequest);
    } catch (error) {
      code = error.code;
      message = error.message;
    }
    expect(code).toBe(undefined);
    expect(message).toBe(undefined);
    expect(result).toEqual({
      dates: [
        { start: new Date("2024-03-08T12:00:00"), end: new Date("2024-03-10T01:00:00") },
        { start: new Date("2024-04-21T12:00:00"), end: new Date("2024-04-28T12:00:00") },
        { start: new Date("2024-08-01T12:00:00"), end: new Date("2024-08-14T12:00:00") },
      ],
      price: 42000,
    });
  });
});
