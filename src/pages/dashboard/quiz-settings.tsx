import { Lesson } from "@/components/Lesson";
import Navbar from "@/components/Navbar";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function QuizSettings() {
  const router = useRouter();
  const { lessonId } = router.query;
  const [lesson, setLesson] = useState<Lesson | null>(null);

  const auth = getAuth();

  useEffect(() => {
    if (lessonId) {
      const fetchLesson = async () => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const response = await fetch(`/api/get-lesson?lessonId=${lessonId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log('Fetched lesson data:', data);
        if (data) {
          setLesson(data);
        } else {
          console.error('Lesson not found:', data.error);
        }
      };

      fetchLesson();
    }
  }, [lessonId]);
  return (
    <>
      <Navbar />
      <h1 className="text-center text-xl pt-4">Settings for {lesson?.name}</h1>
      <div className="">
        <ul className="md:grid lg:grid-cols-3">
          {lesson?.quizSets?.aiSet?.map((question, index) => (
            <li key={index} className="list-none text-xl m-4 border rounded-sm p-2">
              {question.term}
              <ul className="mt-2">
                <h1 className="text-sm">Correct Answer:</h1>
                {question.correct.map((answer, index) => (
                  <li className="text-sm font-normal" key={index}>
                    {answer}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}