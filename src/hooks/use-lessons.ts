import { useAuth } from '@/components/AuthUserProvider';
import { Lesson } from '@/components/Lesson';
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

export function useLessons(): Lesson[] | null {
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const { user } = useAuth();

  const auth = getAuth();

  const queryData = async () => {
    if (!user) {
      console.error('User not authenticated');
      setLessons([]);
      setLoading(false);
      return;
    }
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No current user found');
        setLessons([]);
        setLoading(false);
        return;
      }

      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/get-all-lessons?userId=${user.uid}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to feetch lessons');
      }
      const json = await res.json();
      setLessons(json.lessons || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void queryData();
  }, [user]);

  return loading ? null : lessons;
}
