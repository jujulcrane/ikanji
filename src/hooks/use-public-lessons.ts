import { Lesson } from '@/components/Lesson';
import { useState, useEffect } from 'react';

export function usePublicLessons(): Lesson[] | null {
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[] | null>(null);

  const queryData = async () => {
    try {
      const res = await fetch(`/api/get-all-public-lessons`, {
        method: 'GET',
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
  }, []);

  return loading ? null : lessons;
}
