import { auth } from '@/utils/firebaseAdmin';
import { db } from '@/utils/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'PUT') {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
      }

      const decodedToken = await auth.verifyIdToken(token);
      const uid = decodedToken.uid;

      console.log('Decoded user ID:', uid);

      const { lessonId, updatedLesson } = req.body;
      console.log('Received in API:', { lessonId, updatedLesson });

      if (!lessonId) {
        return res.status(400).json({ error: 'Missing lesson ID' });
      }
      if (!updatedLesson) {
        return res.status(400).json({ error: 'Missing new lesson' });
      }
      console.log('Received in API:', { lessonId, updatedLesson });
      console.log('Document reference:', lessonId);

      const lessonRef = doc(db, 'lessons', lessonId);
      const lessonSnapshot = await getDoc(lessonRef);
      console.log('got doc snap');

      if (!lessonSnapshot.exists) {
        return res.status(404).json({
          error: 'Lesson not found',
        });
      }
      await updateDoc(lessonRef, updatedLesson);

      res.status(200).json({ message: 'Lesson updated successfully!' });
    } catch (error) {
      console.error('Error updating lesson from Firestore:', error);
      res.status(500).json({ error: error as string });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
