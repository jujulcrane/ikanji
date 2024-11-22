// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from "./firebase.json";
import withFirebaseAuth from 'react-with-firebase-auth';
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

const db = getFirestore(app);
const auth = getAuth(app);
const providers = {
  googleProvider: new GoogleAuthProvider(),
};

const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth: auth,
});

const signInWithGoogle = async() => {
  try {
    const result = await signInWithPopup(auth, providers.googleProvider);
    return result.user; // Return the user object
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error; 
  }
};

const signOutFirebase = () => {
  signOut(auth);
};

export {
  db,
  auth,
  createComponentWithAuth,
  signInWithGoogle,
  signOutFirebase as signOut,
};