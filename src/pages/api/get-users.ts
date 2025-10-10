import { User } from '@/components/Lesson';
import { db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { userIds } = req.body;

      if (!userIds || !Array.isArray(userIds)) {
        return res
          .status(403)
          .json({ error: 'Invalid input: userIds must be an array.' });
      }

      const userPromises = userIds.map(async (userId: string) => {
        try {
          const userRef = doc(db, 'users', userId);
          const userSnapshot = await getDoc(userRef);
          if (!userSnapshot.exists()) {
            console.warn(`User not found for userId: ${userId}`);
            return {
              id: userId,
              displayName: 'No associated user',
              email: 'N/A',
              createdAt: 'N/A',
            } as User;
          }
          return {
            id: userSnapshot.id,
            ...userSnapshot.data(),
          } as User;
        } catch (error) {
          console.error(`Error fetching user with userId ${userId}:`, error);
          return {
            id: userId,
            displayName: 'No associated user',
            email: 'N/A',
            createdAt: 'N/A',
          } as User;
        }
      });

      const users = (await Promise.all(userPromises)).filter(
        (user): user is User => user !== null
      );

      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
