import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Patch,
  Route,
  SuccessResponse,
  Response,
  TsoaResponse,
  Res,
  Tags,
} from "tsoa";
import { RentalsService } from "./rentals.service";

import type { Rental, NewRental, RequestRentalDates, BookingInfo } from "./rentals.model";

// from tsoa
interface ValidateErrorJSON {
  message: "Validation failed";
  details: { [name: string]: unknown };
}

interface ErrorMessage {
  message: string;
}

@Route("rentals")
@Tags("Rentals")
export class RentalsController extends Controller {
  /**
   * @summary Get single rental by ID
   * @example rentalID "1400dd4f-4884-47d4-9d0c-8abc4e66b9af"
   * @param notFoundResponse Could not find rental
   */
  @Get("{rentalID}")
  public async getRental(
    @Path() rentalID: string,
    @Res() notFoundResponse: TsoaResponse<404, ErrorMessage>
  ): Promise<Rental> {
    const rental = await new RentalsService().get(rentalID);

    if (!rental) {
      return notFoundResponse?.(404, { message: "Rental Not Found" });
    }

    return rental;
  }

  /**
   * @summary Get all rentals
   */
  @Get()
  public async getAllRentals(): Promise<Array<Rental>> {
    const rentals = await new RentalsService().getAll();

    return rentals;
  }

  /**
   * @summary Create a rental
   * @example requestBody { "rate": 500, "address": "572 Main St, Wakefield, MA 01880", "type": "apartment" }
   * @param conflictResponse Rental Already Exists
   */
  @Response<ErrorMessage>(409, "Rental Exists.", {
    message: "Rental already exists at this address.",
  })
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "created")
  @Post()
  public async createRental(
    @Body() requestBody: NewRental,
    @Res() conflictResponse: TsoaResponse<409, ErrorMessage>
  ): Promise<Rental | void> {
    const rental = new RentalsService().create(requestBody);

    if (!rental) {
      return conflictResponse(409, { message: "Rental already exists" });
    }
    this.setStatus(201);
    return;
  }

  /**
   * @summary Book a rental for potentially multiple non overlapping timeframes
   * @example rentalID "1400dd4f-4884-47d4-9d0c-8abc4e66b9af"
   * @example requestBody [{ "start": "2024-08-01T12:00:00", "end": "2024-08-14T12:00:00" }]
   */
  @SuccessResponse("200", "Rental Booked")
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @Response<Array<string>>("400", "Potential 400 Errors", [
    "No Timeframe Specified",
    "Invalid Booking Date",
    "Date In Past",
    "Invalid Date Range",
  ])
  @Response<ErrorMessage>(404, "Rental Not Found", {
    message: "Rental Not Found",
  })
  @Response<Array<string>>("409", "Potential 409 Errors", [
    "Booking Request Dates Have Overlap",
    "Booking Requests Have Overlap With Existing Bookings",
  ])
  @Patch("{rentalID}")
  public async bookRental(@Path() rentalID: string, @Body() requestBody: RequestRentalDates): Promise<BookingInfo> {
    const bookingInfo = new RentalsService().bookRental(rentalID, requestBody);

    this.setStatus(200);
    return bookingInfo;
  }
}
