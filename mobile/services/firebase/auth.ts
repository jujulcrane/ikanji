import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import { auth } from './config';
import { createUser, getUser } from './firestore';

// Configure Google Sign In
const webClientId =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

const iosClientId =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

if (webClientId) {
  GoogleSignin.configure({
    webClientId,
    iosClientId, // Explicitly provide iOS client ID
    offlineAccess: false,
  });
}

export const signInWithGoogle = async () => {
  try {
    // Check if Google Play services are available (Android)
    await GoogleSignin.hasPlayServices();

    // Get user info from Google
    const userInfo = await GoogleSignin.signIn();

    // Get the ID token
    const { idToken } = userInfo.data ?? {};

    if (!idToken) {
      throw new Error('No ID token returned from Google Sign In');
    }

    // Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);

    // Sign in to Firebase with the Google credential
    const result = await signInWithCredential(auth, googleCredential);
    const user = result.user;

    if (user) {
      // Check if user exists in Firestore
      const existingUser = await getUser(user.uid);

      // If user doesn't exist in Firestore, create a new user document
      if (!existingUser) {
        await createUser({
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          createdAt: new Date().toISOString(),
          lessonIds: [],
        });
      }
    }

    return user;
  } catch (error: any) {
    console.error('Error during Google sign-in:', error);

    // Handle specific error codes
    if (error.code === 'sign_in_cancelled') {
      throw new Error('Sign in cancelled');
    } else if (error.code === 'in_progress') {
      throw new Error('Sign in already in progress');
    } else if (error.code === 'play_services_not_available') {
      throw new Error('Google Play Services not available');
    }

    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Error during email sign-in:', error);
    throw error;
  }
};

export const createAccountWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    if (user) {
      await updateProfile(user, {
        displayName: displayName,
      });

      // Create user document in Firestore
      await createUser({
        id: user.uid,
        email: user.email || '',
        displayName: displayName,
        createdAt: new Date().toISOString(),
        lessonIds: [],
      });
    }

    return user;
  } catch (error) {
    console.error('Error during account creation:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
