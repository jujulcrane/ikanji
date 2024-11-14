import { db } from "@/utils/firebase";
import { collection, deleteDoc, doc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "DELETE") {
  try{
    const { lessonId } = req.body;

    if (!lessonId){
      return res.status(400).json({ error: "Missing lesson ID" });
    }

    const lessonRef = doc(db, "lessons", lessonId);
    
    await deleteDoc(lessonRef);

    res.status(200).json({ message: "Lesson deleted successfully!" });
    } catch (error) {
      console.error("Error deleting lesson from Firestore:", error);
      res.status(500).json({ error: "Failed to delete lesson" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}