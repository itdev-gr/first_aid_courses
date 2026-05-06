import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App | null = null;

function getAdminApp(): App {
  if (app) return app;
  app = getApps()[0] ?? initializeApp({
    credential: cert({
      projectId: import.meta.env.FIREBASE_PROJECT_ID,
      clientEmail: import.meta.env.FIREBASE_CLIENT_EMAIL,
      privateKey: import.meta.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  return app;
}

export function adminAuth(): Auth { return getAuth(getAdminApp()); }
export function adminDb(): Firestore { return getFirestore(getAdminApp()); }
