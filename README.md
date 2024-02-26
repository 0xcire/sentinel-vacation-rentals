# Sentinel Assignment - Vacation Rentals API

## Getting Started

run the following commands

<!-- might need to add script to run npx tsoa routes before,
OR just upload dist folder to github
 -->

- `git clone https://github.com/0xcire/sentinel-vacation-rentals.git && cd sentinel-vacation-rentals`
- `npm install`
- `npm run dev`

You can view documentation for the api @ `localhost:3000/docs`

## Assumptions Made

## Built With

- Node / Express
- TypeScript
- [tsoa](https://tsoa-community.github.io/docs/)
  - A framework with integrated OpenAPI compiler, enabling type safety, run time validation, and documentation
  <!-- add simple persistence with mongo / docker? -->

## Challenge

- The system should let a customer reserve a vacation home of a given type at a desired date and time for agiven number of days.
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
