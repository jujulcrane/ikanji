import { Lesson } from '@/components/Lesson';
import { db, auth } from '@/utils/firebaseAdmin';
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
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
      }

      const decodedToken = await auth.verifyIdToken(token);
      const uid = decodedToken.uid;

      console.log('Decoded user ID:', uid);

      const { lessonId, multipleChoice } = req.body;
      console.log('Received in API:', { lessonId, multipleChoice });
      console.log('Raw request body:', req.body);

      if (!lessonId) {
        return res.status(400).json({ error: 'Missing lesson ID' });
      }

      if (!Array.isArray(multipleChoice) || multipleChoice.length === 0) {
        return res
          .status(400)
          .json({ error: 'Invalid or empty multipleChoice array' });
      }

      console.log('Received in API:', { lessonId, multipleChoice });
      console.log('Document reference:', lessonId);

      const lessonRef = db.collection('lessons').doc(lessonId);
      console.log('got lessonref');
      const docSnap = await lessonRef.get();
      console.log('got doc snap');

      if (!docSnap.exists) {
        return res.status(404).json({
          error: 'Lesson not found',
        });
      }

      await lessonRef.set({ multipleChoice: multipleChoice }, { merge: true });

      res.status(200).json({
        id: lessonRef.id,
        message: 'Multiple Choice created successfully',
      });
    } catch (error) {
      console.error('Error adding multiple choice to Firestore:', error);
      res.status(500).json({ error: 'Failed to store multiple choice' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
