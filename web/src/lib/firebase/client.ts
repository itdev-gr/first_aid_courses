import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getClientApp(): FirebaseApp {
  if (app) return app;
  app = getApps()[0] ?? initializeApp({
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  });
  return app;
}

export function getClientAuth(): Auth {
  if (auth) return auth;
  auth = getAuth(getClientApp());
  return auth;
}
