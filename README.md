<h1 align="center">NCS: waste collection and recycling platform (backend)</h1>

<p align="center">
  A REST API for a recycling platform: collection points on a map, types of waste,
  partner companies, and user accounts with a reward point balance.
</p>

<p align="center">
  <img alt="NestJS 10" src="https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">
  <img alt="Prisma 6" src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white">
  <img alt="Passport" src="https://img.shields.io/badge/auth-Passport_JWT_%2B_Google-34E27A?logo=passport&logoColor=black">
</p>

## Overview

The backend of a platform that helps people recycle: it lists the **collection points** (with their position, capacity and status), the **types of waste** they accept, and the **partners** (recycling and waste companies, with their services, location and contract dates). Each user has a **point balance**, the base for rewarding recycling.

It started from a NestJS authentication starter of mine, which provides the accounts, tokens and Google sign-in.

## Features

- **Accounts:** registration, login (Passport local strategy), JWT access and refresh tokens, logout, password reset with a code sent by email, password change, and sign-in or sign-up with Google.
- **Roles:** `user`, `admin` and `superAdmin`, with an `@Roles()` decorator and a roles guard. During development the guards are switched off on most routes (they are commented out in the controllers).
- **Collection points:** create, list, view, update and delete; latitude and longitude, capacity, and a status (`active`, `inactive`, `under_maintenance`).
- **Waste types:** create, list, view, update and delete.
- **Partners:** create, list, view, update and delete; services offered, status, address and coordinates, credits, contract start and end dates.
- **Users:** admin management of accounts, and `/userMe/me` for the signed-in user's own profile.
- **Security:** Helmet headers, a global validation pipe (`class-validator`), CORS with credentials, sessions for the Google flow, and a JSON 404 for unknown routes.

## API

| Area              | Routes                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Auth              | `POST /auth/register`, `/auth/login`, `/auth/logout`, `/auth/refreshToken/:refresh_token`, `/auth/reset-password`, `/auth/verify-code`, `/auth/change-password`, `/auth/change-password-for-logged-in-user` |
| Google            | `GET /oauth/google/sign`, `GET /oauth/google_/callback`, `POST /oauth/callback/sign`                                                  |
| Users             | `GET /user/all`, `GET /user/:id`, `POST /user/create`, `PATCH /user/:id`, `DELETE /user/:id`; `GET`, `PATCH` and `DELETE /userMe/me` |
| Collection points | `POST /collection-points/create`, `GET /collection-points`, `GET`, `PATCH` and `DELETE /collection-points/:id`                       |
| Waste types       | `POST /waste-types`, `GET /waste-types`, `GET`, `PATCH` and `DELETE /waste-types/:id`                                                |
| Partners          | `POST /partner`, `GET /partner`, `GET`, `PATCH` and `DELETE /partner/:id`                                                            |

## Tech stack

| Area           | Tools                                                             |
| -------------- | ----------------------------------------------------------------- |
| API            | NestJS 10, TypeScript, `class-validator`, `class-transformer`      |
| Database       | PostgreSQL, Prisma 6 (migrations in `prisma/migrations`)           |
| Authentication | Passport (local, JWT, Google OAuth 2.0), bcrypt, express-session   |
| Email          | `@nestjs-modules/mailer` with Nodemailer (Gmail)                   |
| Security       | Helmet, CORS, validation pipe                                      |

## Getting started

**Requirements:** Node.js 18 or later and a PostgreSQL database.

```bash
git clone https://github.com/ay-boutera/_ncs.git
cd _ncs
npm install                 # also generates the Prisma client
# create .env (see below), then:
npx prisma migrate deploy
npm run start:dev
```

The API listens on `PORT` (3000 by default).

### Configuration

Create a `.env` file at the project root and keep it out of Git.

| Variable                                                          | Purpose                                  |
| ----------------------------------------------------------------- | ---------------------------------------- |
| `DATABASE_URL`                                                    | PostgreSQL connection string             |
| `PORT`                                                            | HTTP port (3000 by default)              |
| `JWT_SECRET`, `JWT_REFRESH_SECRET`                                | Sign the access and refresh tokens       |
| `SESSION_SECRET`                                                  | Session cookie used by the Google flow   |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` | Google OAuth 2.0                         |
| `EMAIL_USERNAME`, `EMAIL_PASSWORD`                                | Gmail account (app password) for emails  |

## Project structure

```
src/
├── auth/            # register, login, tokens, password reset (local and JWT strategies)
├── oauth/           # Google sign-in
├── models/
│   ├── user/            # accounts and the signed-in user's profile
│   ├── collection-point/
│   ├── waste-type/
│   └── partner/
├── common/          # guards, decorators, roles, JWT helpers, middleware, validation pipe
└── prisma/          # Prisma client service
prisma/              # schema and migrations
```

## Author

[Boutera Ahmed Yassine](https://github.com/ay-boutera)
