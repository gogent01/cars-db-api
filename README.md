# cars-db-api

A simple database API for managing information about various cars. Supports user authentication and CRUD operations upon the car database for authorized users.

## How to install

```bash
# 1. Install the required packages
npm install

# 2. Run tests
npm test

# 3. Start the application
npm start
```

## Routes
All `cars` routes require auth token from `/user/auth` route. Default user credentials are `user@example.com` and `P4ssword!`.

Detailed information on API routes is located in [openapi specs](./openapi.yaml).
```
POST /api/v1/user/auth

POST /api/v1/cars
GET /api/v1/cars
PUT /api/v1/cars/:carId
DELETE /api/v1/cars/:carId
```
