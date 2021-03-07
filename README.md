# Veggie Time API

This is the repository for the Server, API, and Database used with the Veggie Time app. It was developed as a full stack capstone for the Bloc Web Developer Course.

The live app can be viewed at [Veggie Time](https://veggie-time.vercel.app/). The repo for the front end client is at [Veggie Time Client Repo](https://github.com/Leojanas/veggie-time).

This was built with Node.js, Express.js, and PostgreSQL.

## Summary

This app assists user with scheduling and tracking activity in a vegetable garden.  The user can create an account to create their own personal garden.  They can then select the
veggies that they want to grow, and the app gives information on plant spacing and time to germination and harvest.  The user can then select their planting date, and the app uses that to generate estimated dates for germination, thinning, and harvesting.  The user can also manually add events to their timeline to track tasks such as watering and weeding the garden.

## API Documentation

The deployed API is at [Live Server]('https://young-reef-18206.herokuapp.com').

### /api/auth/signup

This endpoint supports POST requests.

POST requests need a body object.

### /api/auth/login

This endpoint supports POST requests.

Post requests need a body object and return a JWT.

### /api/allVeggies

This endpoint supports GET and POST requests.

GET requests need no body and will return an array of all veggies in the database.

POST requests need a body object to add a new veggie to the database.

### /api/events

This endpoint supports GET and POST requests.

GET requests need no body and will return an array of event objects.

POST requests neesd a body object.

### /api/events/:id

This endpoint supports GET,PATCH, and DELETE requests.

GET requests need no body and will return an object containing info on a single event.

PATCH requests need a body object.

DELETE requests need no body.

### /api/garden

This endpoint supports GET and POST requests.

GET requests need no body and will return an array of event objects.

POST requests neesd a body object.

### /api/garden/:id

This endpoint supports PATCH and DELETE requests.

PATCH requests need a body object.

DELETE requests need no body.
