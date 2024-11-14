import { Lesson } from "@/components/Lesson";
import { db } from "@/utils/firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

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
  if (req.method === "POST") {
  try{
    console.log("Request received:", req.body);

    const lesson: Lesson = req.body;

    if (!lesson.name || !lesson.kanjiList || !lesson.practiceSentences){
      console.error("Invalid lesson data:", lesson);
      return res.status(400).json({error: "Missing lesson data"});
    }

    const lessonRef = collection(db, "lessons");
    console.log("Adding lesson to Firestore:", lesson);
    const docRef = await addDoc(lessonRef, lesson);

    res.status(200).json({ id: docRef.id, message: "Lesson created successfully" });
  } catch (error){
    console.error("Error adding lesson to Firestore:", error);
    res.status(500).json({ error: "Failed to create lesson"});
  }
}
  else {
  res.status(405).json({ error: "Method Not Allowed" });
}
}