import { db, auth } from '@/utils/firebaseAdmin';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'DELETE') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split(' ')[1];
      const decodedToken = await auth.verifyIdToken(idToken);
      console.log('Authenticated user ID:', decodedToken.uid);

      const { lessonId } = req.body;

      if (!lessonId) {
        return res.status(400).json({ error: 'Missing lesson ID' });
      }

      const lessonRef = db.collection('lessons').doc(lessonId);

      await lessonRef.delete();

      res.status(200).json({ message: 'Lesson deleted successfully!' });
    } catch (error) {
      console.error('Error deleting lesson from Firestore:', error);
      res.status(500).json({ error: 'Failed to delete lesson' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
