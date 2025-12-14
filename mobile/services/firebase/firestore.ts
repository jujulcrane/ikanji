import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Lesson, User } from '@/types';

// Collections
const USERS_COLLECTION = 'users';
const LESSONS_COLLECTION = 'lessons';

// User operations
export const createUser = async (user: User) => {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your configuration.');
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, user.id || '');
    await updateDoc(userRef, {
      ...user,
      createdAt: user.createdAt || new Date().toISOString(),
    }).catch(async () => {
      // If document doesn't exist, create it
      await addDoc(collection(db, USERS_COLLECTION), user);
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  if (!db) {
    console.warn('Firestore is not initialized. Returning null.');
    return null;
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Lesson operations
export const createLesson = async (lesson: Lesson, userId: string): Promise<string> => {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your configuration.');
  }

  try {
    const lessonData = {
      ...lesson,
      userId,
      createdAt: new Date().toISOString(),
      publishStatus: lesson.publishStatus || 'private',
    };

    const docRef = await addDoc(collection(db, LESSONS_COLLECTION), lessonData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
};

export const getLessons = async (userId: string): Promise<Lesson[]> => {
  if (!db) {
    console.warn('Firestore is not initialized. Returning empty array.');
    return [];
  }

  try {
    const q = query(
      collection(db, LESSONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const lessons: Lesson[] = [];

    querySnapshot.forEach(doc => {
      lessons.push({ id: doc.id, ...doc.data() } as Lesson);
    });

    return lessons;
  } catch (error) {
    console.error('Error getting lessons:', error);
    throw error;
  }
};

export const getLesson = async (lessonId: string): Promise<Lesson | null> => {
  if (!db) {
    console.warn('Firestore is not initialized. Returning null.');
    return null;
  }

  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
    const lessonSnap = await getDoc(lessonRef);

    if (lessonSnap.exists()) {
      return { id: lessonSnap.id, ...lessonSnap.data() } as Lesson;
    }
    return null;
  } catch (error) {
    console.error('Error getting lesson:', error);
    throw error;
  }
};

export const updateLesson = async (
  lessonId: string,
  updates: Partial<Lesson>
): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your configuration.');
  }

  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
    await updateDoc(lessonRef, updates);
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your configuration.');
  }

  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
    await deleteDoc(lessonRef);
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};

export const getPublicLessons = async (): Promise<Lesson[]> => {
  if (!db) {
    console.warn('Firestore is not initialized. Returning empty array.');
    return [];
  }

  try {
    const q = query(
      collection(db, LESSONS_COLLECTION),
      where('publishStatus', '==', 'published'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const lessons: Lesson[] = [];

    querySnapshot.forEach(doc => {
      lessons.push({ id: doc.id, ...doc.data() } as Lesson);
    });

    return lessons;
  } catch (error) {
    console.error('Error getting public lessons:', error);
    throw error;
  }
};
