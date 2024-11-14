import { Lesson } from "@/components/Lesson";
import { db } from "@/utils/firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  error?: string;
  lessons?: Lesson[];
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    try{
    const lessonsSnapshot = await getDocs(collection(db, "lessons"));
    const lessons: Lesson[] = (lessonsSnapshot.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(),
    })) as Lesson[]);

  res.status(200).json({lessons})
    } catch (error){
    console.error("Error fetching lessons:", error);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
}
  else {
  res.status(405).json({ error: "Method Not Allowed" });
}
} //11-13 are query and then call on the front end
