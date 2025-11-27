import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lesson, User } from '@/types';

// Storage keys
const KEYS = {
  USER: '@ikanji:user',
  LESSONS: '@ikanji:lessons',
  LAST_LESSON: '@ikanji:lastLesson',
  THEME: '@ikanji:theme',
};

// User storage
export const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

// Lessons storage
export const saveLessons = async (lessons: Lesson[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.LESSONS, JSON.stringify(lessons));
  } catch (error) {
    console.error('Error saving lessons:', error);
  }
};

export const getLessons = async (): Promise<Lesson[]> => {
  try {
    const lessonsData = await AsyncStorage.getItem(KEYS.LESSONS);
    return lessonsData ? JSON.parse(lessonsData) : [];
  } catch (error) {
    console.error('Error getting lessons:', error);
    return [];
  }
};

export const saveLesson = async (lesson: Lesson): Promise<void> => {
  try {
    const lessons = await getLessons();
    const existingIndex = lessons.findIndex(l => l.id === lesson.id);

    if (existingIndex >= 0) {
      lessons[existingIndex] = lesson;
    } else {
      lessons.push(lesson);
    }

    await saveLessons(lessons);
  } catch (error) {
    console.error('Error saving lesson:', error);
  }
};

export const removeLesson = async (lessonId: string): Promise<void> => {
  try {
    const lessons = await getLessons();
    const filteredLessons = lessons.filter(l => l.id !== lessonId);
    await saveLessons(filteredLessons);
  } catch (error) {
    console.error('Error removing lesson:', error);
  }
};

// Last viewed lesson
export const saveLastLesson = async (lessonId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.LAST_LESSON, lessonId);
  } catch (error) {
    console.error('Error saving last lesson:', error);
  }
};

export const getLastLesson = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(KEYS.LAST_LESSON);
  } catch (error) {
    console.error('Error getting last lesson:', error);
    return null;
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.USER,
      KEYS.LESSONS,
      KEYS.LAST_LESSON,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
