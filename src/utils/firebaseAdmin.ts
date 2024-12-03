import * as admin from 'firebase-admin';

// Check if the app is already initialized to prevent multiple initializations
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
    }),
    databaseURL: ''
  });
}

const auth = admin.auth();
const db = admin.firestore();

const verifyIdToken = async (idToken: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken; // Contains the user's UID and other data
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};

export { auth, db, verifyIdToken };
