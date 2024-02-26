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

import type { Rental, NewRental, RequestRentalDates } from "./rentals.model";

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
   * @param conflictResponse Rental Already Exists
   */
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
   */
  @SuccessResponse("200", "Rental Booked")
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @Patch("{rentalID}")
  public async bookRental(
    @Path() rentalID: string,
    @Body() requestBody: RequestRentalDates,
    // @Res() notFound: TsoaResponse<404, ErrorMessage>
    @Res() conflictResponse: TsoaResponse<409, ErrorMessage>
    //
  ) {
    const [rental, error] = new RentalsService().bookRental(rentalID, requestBody);

    if (error) {
      return conflictResponse(409, { message: "Error booking your rental" });
    }

    this.setStatus(200);
    return rental;
  }
}
