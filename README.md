## Description

A Nest.js application(uses express.js underneath) that tracks time of different task done by different users.

## Installation

```bash
$ npm install
```

## Running the app

- Create `.env` file in the root directory of the project
- Initialize env variables in `.env` file as depicted in `example.env` file

```bash
# If running first time or after dependencies Installation

$ docker compose up --build

# or

$ docker compose up

```

## Test

```bash
# unit tests

$ npm run test

```

## Completed Functionalities

- Used nest js class validator to validate request body
- Authentication and authorization of users where applicable
- Time entries crud implemented
- Used typeorm to manage database schema design, queries etc
- Wrote unit tests for different modules of the system
- Dockerized the application having api container and database(mysql) container
- Error handling is implemented in api endpoints
- Followed RESTful architecture
- Made use of environment variables

## Points for improvements

- Make a UI interface through which users can interact with the backend service
- Improve test coverage
- Configure CI/CD
- Tasks can be evolved into its own separate entity

## API's

- POST - auth/login (To login a user)
- POST - auth/register (To register a user)
- POST - users/profile (To get user profile)
- POST - users/:id (To get single user)
- POST - time-entries/ (Create a time entry)
- GET - time-entries/ (Get all entries of loggedin user)
- GET - time-entries/:id. (Get a single time entry)
- PUT - time-entries/:id. (Update time entry)
- DELETE - time-entries/:id (Delete a time entry)

## License

Nest is [MIT licensed](LICENSE).
