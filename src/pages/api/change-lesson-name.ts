import { db } from "@/utils/firebase";
import { collection, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "PUT") 
  {
    try
    {
      const { lessonId, newLessonName} = req.body;
      console.log("Received in API:", { lessonId, newLessonName });

      if (!lessonId)
      {
        return res.status(400).json({ error: "Missing lesson ID" });
      }
      if (!newLessonName) 
      {
        return res.status(400).json({ error: "Missing new lesson name" });
      }
      console.log("Received in API:", { lessonId, newLessonName }); 
      console.log("Document reference:", lessonId); 

      const lessonRef = doc(db, "lessons", lessonId);
      console.log("got lessonref")
      const docSnap = await getDoc(lessonRef);
      console.log("got doc snap")

    if (!docSnap.exists()) 
    {
      return res.status(404).json(
      {
        error: "Lesson not found" 
      });
    }
      console.log("updating doc");
      await updateDoc(lessonRef, { name: newLessonName});

      res.status(200).json({ message: "Lesson name updated successfully!" });
      } 
      catch (error) 
      {
        console.error("Error updating lesson name from Firestore:", error);
        res.status(500).json({error: error as string});
      }
  } 
  else 
  {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}