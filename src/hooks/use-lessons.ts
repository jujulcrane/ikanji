import { Lesson } from "@/components/Lesson";
import { useState, useEffect } from "react";

export function useLessons(): Lesson[] | null {

  const [lessons, setLessons] = useState<Lesson[] | null>(null);

  const queryData = async () => {
    try {
    const res = await fetch("/api/get-all-lessons", {
      method: "GET"
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