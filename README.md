# Hidden Ghana 🇬🇭

A mobile tourism app for discovering Ghanaian landmarks, connecting with local guides, and booking hotels — featuring VR tours of tourist sites.

## Features

- **Site Discovery** — browse tourist sites across Ghana with details, ratings, entry fees, and location info
- **Local Guide Connections** — find and connect with local guides
- **Hotel Booking** — search and book accommodation
- **VR Tours** — immersive views of Ghanaian landmarks
- **Authentication** — email/password, Google Sign-In, Apple Sign-In, and guest mode

## Tech Stack

**Frontend**
- React Native (Expo SDK 54)
- TypeScript
- Expo Router (file-based routing)
- `expo-auth-session` — Google Sign-In (OAuth, Expo Go compatible)
- `expo-apple-authentication` — Apple Sign-In (iOS only)

**Backend**
- Spring Boot 3.2.5 (Java 25)
- Spring Security + JWT authentication
- Supabase
- Hibernate / JPA
- `spring-dotenv` for environment variable loading

## Project Structure

## Prerequisites

- Node.js 22+
- Java 21+ (JDK)
- Maven (bundled via `mvnw`, no separate install needed)
- Expo Go app (iOS/Android) for testing on a physical device, or an emulator
- A PostgreSQL database (this project uses [Neon](https://neon.tech))

## Backend Setup

1. Navigate to the backend folder:
```bash
   cd Hiddengh-Backend
```

2. Confirm `spring-dotenv` is present in `pom.xml` (required for `.env` support):
```xml
   <dependency>
       <groupId>me.paulschwarz</groupId>
       <artifactId>spring-dotenv</artifactId>
       <version>4.0.0</version>
   </dependency>
```


   # Schema management (use 'update' for local dev, 'validate' for prod)
   DDL_AUTO=update
```

4. Run the backend:
```bash
   ./mvnw spring-boot:run
```
   Skip tests if needed:
```bash
   ./mvnw spring-boot:run -DskipTests
```
   API will be available at `http://localhost:8080`. Confirm it's up:
```bash
   curl -i http://localhost:8080/api/sites
```

## Frontend Setup

1. Navigate to the frontend folder:
```bash
   cd Hiddengh-Frontend
```

2. Install dependencies:
```bash
   npm install
```

3. Create a `.env` file in this folder:
```dotenv
   EXPO_PUBLIC_API_BASE_URL=http://<your-local-ip>:8080
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```
   > Find your local IP with `ipconfig` (Windows). Your phone/emulator and dev machine must be on the same wifi network — `localhost` won't work from a physical device.

4. Start the development server:
```bash
   npx expo start
```
   Scan the QR code with Expo Go (Android/iOS), or press `a` for Android / `w` for web.

## Authentication Notes

- **Google Sign-In** uses `expo-auth-session`'s browser-based OAuth flow, which works inside Expo Go — no custom native build or Android SDK required.
- **Apple Sign-In** only functions on iOS devices/simulators (an Apple platform limitation, not a bug).
- Public endpoints (no JWT required): `/api/auth/**`, `/api/sites/**`, `/api/guides/**`, `/api/hotels/**`, `/actuator/health`, `/actuator/info`
- Protected endpoints (JWT required): `/api/bookings/**`, `/api/users/**`, `/api/notifications/**`, and any other route not explicitly listed above

## Common Issues

| Symptom | Cause | Fix |
|---|---|---|
| Frontend shows `WARN Backend unavailable, using mock data` | Backend not running, or wrong IP in `.env` | Start backend; confirm `EXPO_PUBLIC_API_BASE_URL` matches your machine's current local IP |
| `Could not resolve placeholder 'JWT_SECRET'` | `.env` missing, or `spring-dotenv` not in `pom.xml` | Confirm both are present in the backend folder |
| `403 Forbidden` on an API call | Endpoint requires auth, or path doesn't match a `permitAll()` rule | Check `SecurityConfig.java` for the exact matched paths |
| `adb: not recognized` | Android SDK not installed / not on PATH | Only needed for native builds (`expo run:android`) — use `npx expo start` + Expo Go instead if you don't need native modules |

## License

See [`LICENSE`](./LICENSE).
