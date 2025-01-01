import { auth } from '@/utils/firebaseAdmin';
import { db } from '@/utils/firebase';
import { collection, doc, deleteDoc, arrayRemove, updateDoc, getDoc } from 'firebase/firestore';
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

      const lessonRef = doc(collection(db, 'lessons'),(lessonId));

      const lessonSnapshot = await getDoc(lessonRef);
      if (!lessonSnapshot.exists()) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      const lessonData = lessonSnapshot.data();
      const userId = lessonData.userId;

      if (decodedToken.uid !== userId) {
        return res.status(403).json({ error: 'Forbidden: User does not own this lesson' });
      }
      
      await deleteDoc(lessonRef);

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        lessonIds: arrayRemove(lessonId),
      });

      res.status(200).json({ message: 'Lesson deleted successfully!' });
    } catch (error) {
      console.error('Error deleting lesson from Firestore:', error);
      res.status(500).json({ error: 'Failed to delete lesson' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
