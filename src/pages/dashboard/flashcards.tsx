import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Flashcard from "@/components/Flashcard";
import { Lesson } from "@/components/Lesson";
import Navbar from "@/components/Navbar"

export default function flashcards() 
{
  const router = useRouter();
  const { lessonId } = router.query;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [front, setFront] = useState<string>('');
  const [back, setBack] = useState<string>('');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  
  useEffect(() => {
    if (lessonId) {
      const fetchLesson = async() => {
        const response = await fetch(`/api/get-lesson?lessonId=${lessonId}`);
        const data = await response.json();
        console.log("Fetched lesson data:", data);
        if (data)
        {
          setLesson(data);
          setFront(data.kanjiList[0].character);
          setBack(data.kanjiList[0].meaning);
        }else{
          console.error('Lesson not found:', data.error);
        }
      };

      fetchLesson();
    }
  }, [lessonId]);

  if (!lesson) return <p>Loading...</p>

  const handleNext = () => {
    console.log('next card');
    if (lesson && currentCardIndex < lesson.kanjiList.length -1) {
      const nextIndex = currentCardIndex + 1;
      setCurrentCardIndex(nextIndex);
      setFront(lesson.kanjiList[nextIndex].character);
      setBack(lesson.kanjiList[nextIndex].meaning);
      setIsFlipped(false);
    }
  }

  const handleBack = () => {
    console.log('display prev card');
    if (lesson && currentCardIndex > 0){
      const prevIndex = currentCardIndex - 1;
      setCurrentCardIndex(prevIndex);
      setFront(lesson.kanjiList[prevIndex].character);
      setBack(lesson.kanjiList[prevIndex].meaning);
      setIsFlipped(false);
  }
}
  return (
    <>
    <Navbar></Navbar>
    {lesson.kanjiList && lesson.kanjiList.length > 0 && (
        <Flashcard
          front={front}
          back={back}
          isFlipped={isFlipped} 
          setIsFlipped={setIsFlipped}
        />
      )}
    <div className = "flex justify-between">
    <button onClick = {handleBack} className = "bg-customCream w-44 h-20 rounded-md ml-4" type= "button" >Back</button>
    <button onClick = {handleNext} className = "bg-customCream w-44 h-20 rounded-md mr-4" type= "button" >Next</button>
    </div>
    </>
  )
}