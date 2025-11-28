import { User } from '@/components/Lesson';
import { useState, useEffect } from 'react';

export function useUsers(userIds: string[]): {
  users: User[];
  loading: boolean;
} {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[] | null>(null);

  const queryData = async () => {
    try {
      const res = await fetch(`/api/get-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds }),
      });

      if (!res.ok) {
        throw new Error('Failed to feetch users');
      }
      const json = await res.json();
      setUsers(json || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userIds.length > 0) {
      void queryData();
    }
  }, [userIds]);

  return { users: users || [], loading };
}
