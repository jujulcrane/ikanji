import { useAuth } from "@/components/AuthUserProvider";
import { Lesson } from "@/components/Lesson";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

export function useLessons(): Lesson[] | null {

  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const { user } = useAuth();

  const auth = getAuth();
  

  const queryData = async () => {
    if (!user) {
      console.error("User not authenticated");
      setLessons([]);
      return;
    }
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("No current user found");
        setLessons([]);
        return;
      }

      const token = await currentUser.getIdToken(); // Get the Firebase ID token
      const res = await fetch(`/api/get-all-lessons?userId=${user.uid}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Include the token here
        },
      });
    
    if (!res.ok) {
      throw new Error('Failed to feetch lessons');
    }
    const json = await res.json();
    setLessons(json.lessons || []);
} catch (error) {
    console.error("Error fetching lessons:", error);
    setLessons([]);
  }
};

  useEffect(() => {
    void queryData();
  }, []);

  return lessons;
}