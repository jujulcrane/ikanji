import { Lesson } from "@/components/Lesson";
import { db } from "@/utils/firebase";
import { getDoc, doc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET"){
    const { lessonId } = req.query; 

    if (!lessonId || typeof lessonId !== 'string'){
      return res.status(400).json({error: 'Invalid or missing lesson ID'});
    }
    try{
      const lessonRef = doc(db, "lessons", lessonId);
      const lessonSnapshot = await getDoc(lessonRef);

      if (!lessonSnapshot.exists()) {
        return res.status(404).json({ error: 'Lesson not found'});
      }

      const lesson = { 
        id: lessonSnapshot.id, 
        ...lessonSnapshot.data() } as Lesson;
      
        res.status(200).json(lesson);
    } catch (error) {
      console.error("Error fetching specific lesson:", error);
      res.status(500).json({ error: 'Failed to fetch lesson' });
    }
    }else{
      res.status(405).json({error: 'Method not allowed'});
    }
  }