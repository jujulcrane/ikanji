import { Lesson } from '@/components/Lesson';
import { auth } from '@/utils/firebaseAdmin';
import { db } from '@/utils/firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  error?: string;
  lessons?: Lesson[];
  id?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized, token missing' });
      }

      console.log('Request received:', req.body);

      const decodedToken = await auth.verifyIdToken(token);
      const userId = decodedToken.uid;

      const lesson: Lesson & { userId: string } = req.body;

      if (!lesson.name || !lesson.kanjiList || !lesson.practiceSentences) {
        console.error('Invalid lesson data:', lesson);
        return res.status(400).json({ error: 'Missing lesson data' });
      }

      if (lesson.userId !== userId) {
        return res
          .status(403)
          .json({ error: 'Forbidden, user ID does not match' });
      }

      console.log('userId from request:', lesson.userId);
      console.log(lesson)

      const lessonRef = await addDoc(collection(db, 'lessons'), {...lesson, userId})
      console.log('Adding lesson to Firestore:', lesson);

      res
        .status(200)
        .json({ id: lessonRef.id, message: 'Lesson created successfully' });
    } catch (error) {
      console.error('Error adding lesson to Firestore:', error);
      res.status(500).json({ error: 'Failed to create lesson' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
