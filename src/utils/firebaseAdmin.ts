import * as admin from 'firebase-admin';
import serviceAccount from './ikanji-fde0d-firebase-adminsdk-5rg25-1fc8f5cc96.json';

// Check if the app is already initialized to prevent multiple initializations
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const auth = admin.auth();
const db = admin.firestore();

const verifyIdToken = async (idToken: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken; // Contains the user's UID and other data
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
};

export { auth, db, verifyIdToken };