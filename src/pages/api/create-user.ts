import { db } from '@/utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { uid, email, displayName } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ message: "Missing required fields: uid or email" });
  }

  try {
    const userDoc = {
      email,
      displayName: displayName || null,
      createdAt: new Date().toISOString(),
      lessonIds: [],
    };

    await setDoc(doc(db, "users", uid), userDoc);

    res.status(201).json({ message: "User document created successfully" });
  } catch (error) {
    console.error("Error creating user document:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}