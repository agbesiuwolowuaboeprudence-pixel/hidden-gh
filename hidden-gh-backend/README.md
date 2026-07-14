# Hidden GH Backend

Express + PostgreSQL API for the Hidden Ghana tourism app.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a PostgreSQL database:
   ```
   createdb hidden_gh
   ```

3. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```
   At minimum, set `DATABASE_URL` and a strong random `JWT_SECRET`.

4. Run migrations (creates all tables + seeds categories):
   ```
   npm run migrate
   ```

5. Start the dev server:
   ```
   npm run dev
   ```
   API will be live at `http://localhost:4000`. Check `http://localhost:4000/health`.

## What's implemented so far

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login` (JWT, bcrypt password hashing)
- **Sites**: `GET /api/sites` (filter by `?category=`, `?region=`, `?search=`), `GET /api/sites/:id`,
  `GET /api/sites/:id/image` (streams bytea image), `POST /api/sites` (create, with image upload via `multipart/form-data`, field name `image`)
- **Users**: `GET /api/users/me`, `PATCH /api/users/me`, save/unsave a site

## Images

Images are stored as `bytea` directly in Postgres (per your choice). They are **not** returned as
base64 in JSON — instead, each site's `image` field is a URL like `/api/sites/:id/image` that
streams the bytes with the correct `Content-Type`. This means your React Native `<Image source={{ uri: item.image }} />`
code doesn't need to change at all.

To upload an image when creating a site, send a `multipart/form-data` request with an `image` file field.

## Still to build (same pattern as `sites.*`)

- `guides.routes.js` / `guides.controller.js`
- `hotels.routes.js` / `hotels.controller.js`
- `bookings.routes.js` / `bookings.controller.js`
- `notifications.routes.js` / `notifications.controller.js`

Each follows the same shape: a controller with list/get/create functions using `pool.query`,
and a routes file wiring them to Express with `authenticate` where the frontend requires a logged-in user
(bookings, notifications) vs public reads (guides, hotels).

## Testing quickly with curl

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ama","email":"ama@example.com","password":"secret123"}'

# List sites
curl http://localhost:4000/api/sites
```
