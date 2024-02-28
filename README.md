# Sentinel Assignment - Vacation Rentals API

## Getting Started

run the following commands

- `git clone https://github.com/0xcire/sentinel-vacation-rentals.git && cd sentinel-vacation-rentals`
- `npm install`
- `npm run start`

You can view documentation for this API and interact with its endpoints @ `localhost:3000/docs`

## Testing

To run tests:

- `npm run test`

## Interacting with the API

- Examples and default values for docs @ `localhost:3000/docs` should be enough for overview of success / error responses
- Could also pull test data from `test/rentals/bookRental.test.ts`

## Assumptions Made

- Adressing requirement #1 and part of requirement #2:

  - Making an assumption that client would supply a date picker to set date/time range, believe this would improve UX as specific check in / checkout date times could be set without room for confusion

    - if # of days were to be supplied as a 2nd parameter still, could simply format requestBody before continuing

    ```
      interface DateRange {
        start: string;
        days: number;
      }
      requestBody.map((dateRange: DateRange) => {
        const startDate = new Date(dateRange.start);
        const endDate = dayjs(startDate).add(dateRange.days, 'days');

        if(startDate.toString() === 'Invalid Date') throwSomeError

        return {
          start: startDate
          endDate: endDate
        }
      })
    ```

  - Assuming that on a client you would be able to filter by type, date, etc and as a result, booking requests would be based on rental ID not its type, and if all homes of a specific type are booked for given search params, proper UI would be displayed to notify use and direct them elsewhere

    - This would likely increase UX because ( although not mentioned as a requirement ) a user would likely want to also filter by price, photos, etc and not just submit a booking for the first rental found for a specific type without additional info
    - An alternative solution when considering the above can be found in `RentalService.requestHasOverlapWithExistingBookings` where an error is thrown if requested bookings have overlap with any existing ones
      - This would also likely be shown in client, where if the UI to book rental dates was a date picker, the unavailable dates would be disabled ( thinking about something like AirBnb )

## Built With

- Node / Express
- TypeScript
- [tsoa](https://tsoa-community.github.io/docs/)
  - A framework with integrated OpenAPI compiler, enabling type safety, run time validation, and documentation

## Challenge

- The system should let a customer reserve a vacation home of a given type at a desired date and time for a given number of days.
- The number of vacation homes of each type is limited, but customers should be able to reserve a single vacation homes for mutiple, non-overlapping time frames.
- Provide exectuable tests that illustrate the core reservation functionality and demonstrates its correctness.
- Provide information on how to run and use the API.

## Hints

- No UI required
- Persistence not required. If its easier you can use in-memory storage of data.
- Authentication and Authorization not required
- Please use TypeScript or C# to implement this API.
- Please make it easy for the reviewer to run and understand your solution.
- Some examples of vacation home types are:
  - Beach house
  - Lake house
  - City apt
  - Farm barn

## Issues

- Couldn't figure out best way of documenting multiple errors for a given code so hopefully my solution is sufficient
