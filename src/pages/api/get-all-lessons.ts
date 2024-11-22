import { Lesson } from "@/components/Lesson";
import { db } from "@/utils/firebase";
import { getDocs, collection, query, where} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/utils/firebaseAdmin";

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
      const token = req.headers.authorization?.split("Bearer ")[1];

      if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing token" });
      }

      // Verify the ID token using the Firebase Admin SDK
      const decodedToken = await auth.verifyIdToken(token);
      const userId = decodedToken.uid; // This should match the userId in the request
      console.log("Authenticated user ID:", userId);

      const { userId: requestedUserId } = req.query;

      if (!requestedUserId || requestedUserId !== userId) {
        return res.status(403).json({ error: "Forbidden: User ID does not match" });
      }
    
    const lessonsRef = collection(db, "lessons")
    const q = query(lessonsRef, where("userId", "==", userId));
    const lessonsSnapshot = await getDocs(q);
    
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
