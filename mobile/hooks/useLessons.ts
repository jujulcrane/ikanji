import { useState, useEffect } from 'react';
import { Lesson } from '@/types';
import {
  getLessons as getFirestoreLessons,
  createLesson as createFirestoreLesson,
  updateLesson as updateFirestoreLesson,
  deleteLesson as deleteFirestoreLesson,
} from '@/services/firebase/firestore';
import {
  saveLessons,
  getLessons as getCachedLessons,
  saveLesson as cacheLesson,
  removeLesson as removeCachedLesson,
} from '@/services/storage/asyncStorage';
import { useAuth } from '@/contexts/AuthContext';

export function useLessons() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      loadLessons();
    } else {
      setLessons([]);
      setLoading(false);
    }
  }, [user]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from cache first
      const cachedLessons = await getCachedLessons();
      if (cachedLessons.length > 0) {
        setLessons(cachedLessons);
      }

      // Then load from Firestore
      if (user?.id) {
        const firestoreLessons = await getFirestoreLessons(user.id);
        setLessons(firestoreLessons);
        await saveLessons(firestoreLessons);
      }
    } catch (err) {
      console.error('Error loading lessons:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createLesson = async (lesson: Lesson): Promise<string | null> => {
    if (!user?.id) return null;

    try {
      const lessonId = await createFirestoreLesson(lesson, user.id);
      const newLesson = { ...lesson, id: lessonId, userId: user.id };

      setLessons(prev => [newLesson, ...prev]);
      await cacheLesson(newLesson);

      return lessonId;
    } catch (err) {
      console.error('Error creating lesson:', err);
      setError(err as Error);
      return null;
    }
  };

  const updateLesson = async (
    lessonId: string,
    updates: Partial<Lesson>
  ): Promise<boolean> => {
    try {
      await updateFirestoreLesson(lessonId, updates);

      setLessons(prev =>
        prev.map(lesson =>
          lesson.id === lessonId ? { ...lesson, ...updates } : lesson
        )
      );

      const updatedLesson = lessons.find(l => l.id === lessonId);
      if (updatedLesson) {
        await cacheLesson({ ...updatedLesson, ...updates });
      }

      return true;
    } catch (err) {
      console.error('Error updating lesson:', err);
      setError(err as Error);
      return false;
    }
  };

  const deleteLesson = async (lessonId: string): Promise<boolean> => {
    try {
      await deleteFirestoreLesson(lessonId);
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
      await removeCachedLesson(lessonId);
      return true;
    } catch (err) {
      console.error('Error deleting lesson:', err);
      setError(err as Error);
      return false;
    }
  };

  return {
    lessons,
    loading,
    error,
    loadLessons,
    createLesson,
    updateLesson,
    deleteLesson,
  };
}
