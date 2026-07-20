OAuth Setup — Google & Apple

This file documents the steps required to enable Google and Apple social sign-in for the Hidden Ghana backend.

1) Google (client-side + backend)

- Create OAuth 2.0 Client ID in Google Cloud Console:
  - Go to https://console.cloud.google.com/apis/credentials
  - Create an OAuth 2.0 Client ID (choose "Web application" or "iOS/Android" depending on your client).
  - Add redirect URIs for Expo AuthSession (use the value printed by AuthSession: e.g. `com.your.app:/oauthredirect` or `exp://...`).
  - Note the `CLIENT_ID`.

- Client-side (Expo): use `expo-auth-session` to acquire an `id_token` (Google ID token). Send that `idToken` to the backend at:

  POST /api/auth/oauth/google
  Content-Type: application/json
  Body: { "idToken": "<google-id-token>" }

- Backend: `AuthService.googleLogin` uses Google's tokeninfo endpoint to validate the ID token and upsert a `User` by email. It then issues a local JWT.

2) Apple

- Register an App ID in Apple Developer and enable "Sign In with Apple".
- Create a Services ID and configure the primary App ID and return URLs.
- Download and note the Service ID (this will be your client identifier).

- Client-side (Expo): use `expo-apple-authentication` on iOS to retrieve an `identityToken` (JWT). Send that token to the backend at:

  POST /api/auth/oauth/apple
  Content-Type: application/json
  Body: { "idToken": "<apple-id-token>" }

- Backend: `AuthService.appleLogin` verifies the token signature against Apple's public JWK set (https://appleid.apple.com/auth/keys) and creates/returns a local JWT.

3) Configuration

- Add client IDs to `backend/src/main/resources/application.properties` (optional but recommended):

  apple.client.id=YOUR_APPLE_SERVICE_ID
  google.client.id=YOUR_GOOGLE_CLIENT_ID

4) Security notes

- The backend currently uses Google's tokeninfo endpoint and direct signature verification for Apple. For production, validate `aud` (audience) claim matches your client IDs and the `iss` claim (issuer). Also consider caching Apple's JWKs for performance.

5) Test flow

- Run the backend (mvn spring-boot:run) and the Expo app.
- Acquire an ID token via client libraries and POST to the backend endpoints.
- The response should be an `AuthResponse` containing a JWT — store it in the app's secure storage.

If you want, I can:
- Add `apple.client.id` and `google.client.id` env/property binding and enforce `aud` checks.
- Add unit tests for token verification.
- Implement caching for Apple JWKs.
