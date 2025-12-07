# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {https://github.com/VladTarnovskiy/nodejs2023Q2-service.git}
```

## Install PostgresQL & Docker

PostgresQL: https://www.postgresql.org/

Docker: https://hub.docker.com/

## Installing NPM modules

```
npm install
```

First of all you need to create a `.env` file. Copy from .env.example

## Running application localy

Then you need to create a new PostgresQL database. Be shure that PostgresQL installed on your machine.

Execute this command to create a new database

```
npm run database:init

```

```

npm run start:dev

```

## Running application using Docker

Run this command and wait

```

docker-compose up

```

## Scan for vulnerabilities

Since docker scan is deprecated, docker scout is used for vulnerabilities scanning.

Run scan after complete command `docker-compose up`

```

npm run docker:scan

```

## API

There are `Users`, `Artists`, `Albums`, `Tracks` and `Favorites` REST endpoints with separate router paths
