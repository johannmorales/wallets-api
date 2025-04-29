# Wallets API - Project Summary

## Features
- **Wallets Service**
  - Create, retrieve, update, and delete wallets.
  - Wallets are tied to authenticated users only.
  - Authorization checks prevent unauthorized access to wallets.
  - Validation ensures IDs are numeric (prevents app crash on `/wallets/asdasd`).

- **Validation**
  - `CreateWalletDto` and `UpdateWalletDto` validate:
    - `chain` must be a valid enum value (`ETHEREUM` or `BITCOIN`).
    - `address` must pass custom Ethereum/Bitcoin format validation. (Can be extended to other chains in the future)
  - All route parameters like `id` are validated to be numbers.

- **Authentication**
  - `signup` endpoint (`POST /signup`) that accepts email and password.
  - `login` endpoint (`POST /login`) returning JWT access token.
  - `logout` endpoint (`POST /logout`) blacklists a JWT token so it is not used after user logouts (Stored in Redis)
  - All secured routes (`/wallets`) require a valid token.
  - Global handling for 401 Unauthorized if token is missing/invalid.


- **Testing**
  - Unit tests for Wallets Service and Address Validation.
  - Artillery load testing simulating:
    - Signing up users
    - Logging in
    - Creating wallets
    - Reading, updating, deleting wallets
  - Rapid ramp-up test created to quickly simulate thousands of requests.
## Techonologies used and reasons
  - TypeORM: Easy setup entities setup via annotations, works well with typescript
  - NestJS: Aligns well with the proejct and provides a baseline that would need additional development if doing raw typescript+expressjs (Dependency Injection, Modules, TS configuration)
  - Docker: Easy to run/deploy apps
  - Artillery: Easy way to load test an application. This application becomes unresponsive under heavy load. One way to fix it would be to use a rate limiter
  - Swagger: Compatible with OpenAPI, allows our API to be ready to be integrated with thirdparty clients just by publishing the swagger.json file

## Running the app

```bash
docker compose up -d
npm install
npm run start:dev
```

## Running Artillery
```bash
npm run artillery
```

## Running tests

```bash
npm run test
```

## Postman 

Import `Wallets API.postman_collection.json` into Postman to easily interact with the api


## Swagger

If needed Swagger is available at `http://localhost:4001/api`



## AI Use

Use ChatGPT to do straight forward tasks
- creating postman.js
- create artillery script based on my test descriptions
- Validation methods
- Controller methods 
Helped reduced the overall development time and allowed me to have more time to think about best technologies to use and how to structure the architecture instead of writing repetitive code