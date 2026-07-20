# Hidden Ghana — Spring Boot Backend

Replaces the earlier Node/Express backend with the same API shape, so the frontend
integration plan doesn't change. Java 17, Spring Boot 3.3, Spring Data JPA, Spring
Security + JWT, PostgreSQL (images stored as `bytea`/`BLOB`, same as before).

## Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL running locally (or update `DB_HOST` etc. below)

## Setup

1. Create the database:
   ```bash
   createdb hidden_gh
   ```

2. Set environment variables (or edit `src/main/resources/application.yml` directly):
   ```bash
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_NAME=hidden_gh
   export DB_USER=postgres
   export DB_PASSWORD=postgres
   export JWT_SECRET=$(openssl rand -hex 32)
   ```

3. Run it:
   ```bash
   mvn spring-boot:run
   ```

   On first run, Hibernate creates all tables (`ddl-auto: update`) and `DataSeeder`
   populates categories + 3 sample sites if the database is empty.

4. Confirm it's up:
   ```bash
   curl http://localhost:4000/health
   ```

## API routes

Same shape as the Node version:

| Route | Auth? | Notes |
|---|---|---|
| `POST /api/auth/register` | No | Returns `{ token, user }` |
| `POST /api/auth/login` | No | Returns `{ token, user }` |
| `GET /api/sites` | No | `?category=`, `?region=`, `?premium=` |
| `GET /api/sites/:id` | No | |
| `GET /api/sites/:id/image` | No | Streams bytea image |
| `POST /api/sites` | Yes | `multipart/form-data` |
| `GET /api/guides`, `/api/hotels` | No | Same filter/image pattern |
| `GET /api/users/me` | Yes | |
| `PATCH /api/users/me` | Yes | |
| `GET/POST /api/bookings` | Yes | Auto-generates `bookingRef` like `HGH-A1B2C3` |
| `PATCH /api/bookings/:id/cancel` | Yes | |
| `GET /api/notifications` | Yes | |

Auth: send `Authorization: Bearer <token>` from the login/register response.

## Notes on this rebuild

- Postgres arrays (`highlights`, `languages`, `amenities`) are modeled as
  `@ElementCollection`s (separate join tables) rather than native Postgres
  `TEXT[]`, since that's the portable JPA-native approach without extra
  dependencies. Functionally equivalent from the API's point of view.
- `ddl-auto: update` is convenient for development. Before shipping, switch to
  `validate` and manage schema changes with a migration tool (e.g. Flyway) so
  schema changes are explicit and reviewable.
- I could not run `mvn install`/compile this in the sandbox I built it in — that
  environment can't reach Maven Central. Please run `mvn spring-boot:run` (or
  `mvn compile`) locally as your first step and send me any compiler errors —
  I reviewed every file carefully but a live build is the real test.
