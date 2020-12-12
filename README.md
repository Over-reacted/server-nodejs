## Start Guide

### Outside Docker containers

- Create .env file `cp .env.example .env` and replace existing env variables
  (mysql/mariadb connection params)
- Install dependencies `yarn`
- Start the app `yarn start` (app will be exposed through the port 3000)

### Inside Docker containers

Just run already prepared bash script:

```bash
$ ./init
```

It will setup the project for you (building the Docker images, starting docker-compose stack).
The NestJS app running in dev mode will be exposed on `http://localhost` (port 80)

For IDE autocompletion to work, run `yarn` on the host machine.

## Test

```bash
# unit tests
$ docker exec -it nest yarn test

# e2e tests
$ docker exec -it nest yarn test:e2e

# test coverage
$ docker exec -it nest yarn test:cov
```

## Swagger

RESTful APIs you can describe with already integrated Swagger.
To see all available endpoints visit http://localhost/api/docs

## Authentication - JWT

Already preconfigured JWT authentication.
It's suggested to change current password hashing to something more secure.
You can start use already working implementation of `Login` and `Registration`
endpoints, just take a look at [http://localhost/api/docs](http://localhost/api/docs).
