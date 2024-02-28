"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalsController = void 0;
const tsoa_1 = require("tsoa");
const rentals_service_1 = require("./rentals.service");
let RentalsController = class RentalsController extends tsoa_1.Controller {
    /**
     * @summary Get single rental by ID
     * @example rentalID "1400dd4f-4884-47d4-9d0c-8abc4e66b9af"
     * @param notFoundResponse Could not find rental
     */
    async getRental(rentalID, notFoundResponse) {
        const rental = await new rentals_service_1.RentalsService().get(rentalID);
        if (!rental) {
            return notFoundResponse?.(404, { message: "Rental Not Found" });
        }
        return rental;
    }
    /**
     * @summary Get all rentals
     */
    async getAllRentals() {
        const rentals = await new rentals_service_1.RentalsService().getAll();
        return rentals;
    }
    /**
     * @summary Create a rental
     * @example requestBody { "rate": 500, "address": "572 Main St, Wakefield, MA 01880", "type": "apartment" }
     * @param conflictResponse Rental Already Exists
     */
    async createRental(requestBody, conflictResponse) {
        const rental = new rentals_service_1.RentalsService().create(requestBody);
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
    async bookRental(rentalID, requestBody) {
        const bookingInfo = new rentals_service_1.RentalsService().bookRental(rentalID, requestBody);
        this.setStatus(200);
        return bookingInfo;
    }
};
exports.RentalsController = RentalsController;
__decorate([
    (0, tsoa_1.Get)("{rentalID}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Res)())
], RentalsController.prototype, "getRental", null);
__decorate([
    (0, tsoa_1.Get)()
], RentalsController.prototype, "getAllRentals", null);
__decorate([
    (0, tsoa_1.Response)(409, "Rental Exists.", {
        message: "Rental already exists at this address.",
    }),
    (0, tsoa_1.Response)(422, "Validation Failed"),
    (0, tsoa_1.SuccessResponse)("201", "created"),
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)())
], RentalsController.prototype, "createRental", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("200", "Rental Booked"),
    (0, tsoa_1.Response)(422, "Validation Failed"),
    (0, tsoa_1.Response)("400", "Potential 400 Errors", [
        "No Timeframe Specified",
        "Invalid Booking Date",
        "Date In Past",
        "Invalid Date Range",
    ]),
    (0, tsoa_1.Response)(404, "Rental Not Found", {
        message: "Rental Not Found",
    }),
    (0, tsoa_1.Response)("409", "Potential 409 Errors", [
        "Booking Request Dates Have Overlap",
        "Booking Requests Have Overlap With Existing Bookings",
    ]),
    (0, tsoa_1.Patch)("{rentalID}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)())
], RentalsController.prototype, "bookRental", null);
exports.RentalsController = RentalsController = __decorate([
    (0, tsoa_1.Route)("rentals"),
    (0, tsoa_1.Tags)("Rentals")
], RentalsController);
