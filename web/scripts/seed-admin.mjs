import 'dotenv/config';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const [, , email, password] = process.argv;
if (!email || !password) {
  console.error('Usage: node scripts/seed-admin.mjs <email> <password>');
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

try {
  const user = await getAuth().createUser({ email, password, emailVerified: true });
  console.log(`Created admin user ${user.email} (uid: ${user.uid})`);
} catch (err) {
  if (err && typeof err === 'object' && 'code' in err && err.code === 'auth/email-already-exists') {
    console.log(`User ${email} already exists. Updating password.`);
    const existing = await getAuth().getUserByEmail(email);
    await getAuth().updateUser(existing.uid, { password });
    console.log(`Updated password for ${email} (uid: ${existing.uid}).`);
  } else {
    throw err;
  }
}
