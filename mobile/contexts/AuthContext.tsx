import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChange, signOut as firebaseSignOut } from '@/services/firebase/auth';
import { getUser as getUserFromFirestore } from '@/services/firebase/firestore';
import { saveUser, removeUser, clearAllData } from '@/services/storage/asyncStorage';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          // Get user data from Firestore
          const userData = await getUserFromFirestore(fbUser.uid);
          if (userData) {
            setUser(userData);
            await saveUser(userData);
          } else {
            // Create user object from Firebase auth if not in Firestore
            const newUser: User = {
              id: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || '',
              createdAt: new Date().toISOString(),
              lessonIds: [],
            };
            setUser(newUser);
            await saveUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        await removeUser();
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut();
      await clearAllData();
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
