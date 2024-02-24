import {
  Body,
  Controller,
  Example,
  Get,
  Path,
  Post,
  //   Query,
  Route,
  SuccessResponse,

  //
} from "tsoa";
import { RentalsService } from "./rentals.service";
import type { Rental, NewRental } from "./rentals.model";

@Route("rentals")
export class RentalsController extends Controller {
  @Example<Rental>({
    id: "52907745-7672-470e-a803-a2f8feb52944",
    address: "",
    rate: 2500,
    rented: [],
    type: "apartment",
    isAvailable: true,
  })
  @Get("{rentalID}")
  public async getRental(
    @Path() rentalID: string
    // @Query() address?: string
  ): Promise<Rental> {
    return new RentalsService().get(rentalID);
  }

  @SuccessResponse("201", "created")
  @Post()
  public async createRental(
    @Body() requestBody: NewRental
    //
  ): Promise<void> {
    this.setStatus(201);
    new RentalsService().create(requestBody);
    return;
  }

  @Post("{rentalID}/book")
  public async bookRental() {
    return "";
  }
}
