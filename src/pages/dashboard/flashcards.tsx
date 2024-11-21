import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Flashcard from "@/components/Flashcard";
import { Lesson } from "@/components/Lesson";
import Navbar from "@/components/Navbar"
import { Checkbox } from "@/components/ui/checkbox"

type Back = {
  meaning?: string,
  readings?: string[],
  strokeOrder?: string,
  english?: string
};
export default function flashcards() 
{
  const router = useRouter();
  const { lessonId } = router.query;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [front, setFront] = useState<string>('');
  const [back, setBack] = useState<Back>({});
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPracticeSentences, setIsPracticeSentences] = useState<boolean>(false);

  const [isMeaningChecked, setIsMeaningChecked] = useState(true);
  const [isReadingsChecked, setIsReadingsChecked] = useState(true);
  
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

  useEffect(() => {
    if (lesson && lesson.kanjiList[currentCardIndex]) {
      const newBack: Back = {};
      if (isPracticeSentences)
      {
        setIsMeaningChecked(false);
        setIsReadingsChecked(false);
        newBack.english = lesson.practiceSentences[currentCardIndex].english;
        setFront(lesson.practiceSentences[currentCardIndex].japanese);
      }
      else
      {
        if (isMeaningChecked) {
          newBack.meaning = lesson.kanjiList[currentCardIndex].meaning;
        }
        if (isReadingsChecked) {
          newBack.readings = lesson.kanjiList[currentCardIndex].readings;
        }
      }

      setBack(newBack);
    }
  }, [isMeaningChecked, isReadingsChecked, isPracticeSentences, currentCardIndex, lesson]);

  if (!lesson) return <p>Loading...</p>

  const handleMeaningCheck = () => {
    setIsMeaningChecked(!isMeaningChecked);
      if (isPracticeSentences) {
        setIsPracticeSentences(false);
        if (lesson && currentCardIndex >= lesson.kanjiList.length) {
          setCurrentCardIndex(0);
          setFront(lesson.kanjiList[0]?.character || '');
        } else {
          setFront(lesson?.kanjiList[currentCardIndex]?.character || '');
        }
      }
    }

    const handleReadingCheck = () => {
      setIsReadingsChecked(!isReadingsChecked);
      if (isPracticeSentences) {
        setIsPracticeSentences(false);
        if (lesson && currentCardIndex >= lesson.kanjiList.length) {
          setCurrentCardIndex(0);
          setFront(lesson.kanjiList[0]?.character || '');
        } else {
          setFront(lesson?.kanjiList[currentCardIndex]?.character || '');
    }
  }
}

  const handleNext = () => {
    console.log('next card');
    if (!lesson) return;

    const listLength = isPracticeSentences
    ? lesson.practiceSentences.length
    : lesson.kanjiList.length;

    if (currentCardIndex < listLength -1) {
      const nextIndex = currentCardIndex + 1;
      setCurrentCardIndex(nextIndex);

      if (isPracticeSentences) {
        setFront(lesson.practiceSentences[nextIndex].japanese);
        setBack({ english: lesson.practiceSentences[nextIndex].english });
    } else {
        setFront(lesson.kanjiList[nextIndex].character);
        const newBack: Back = {};
        if (isMeaningChecked) {
          newBack.meaning = lesson.kanjiList[nextIndex].meaning;
        }
        if (isReadingsChecked) {
          newBack.readings = lesson.kanjiList[nextIndex].readings;
        }
        setBack(newBack);
    }
      setIsFlipped(false);
    }
  };

  const handleBack = () => {
    console.log('display prev card');
    if (!lesson) return;
    if (currentCardIndex > 0){
      const prevIndex = currentCardIndex - 1;
      setCurrentCardIndex(prevIndex);

      if (isPracticeSentences)
      {
        setFront(lesson.practiceSentences[currentCardIndex].japanese);
        setBack({english: lesson.practiceSentences[prevIndex].english });
      }
      else
      {
      setFront(lesson.kanjiList[prevIndex].character);
      
      const newBack: Back = {};
      if (isMeaningChecked) {
        newBack.meaning = lesson.kanjiList[prevIndex].meaning;
      }
      if (isReadingsChecked) {
        newBack.readings = lesson.kanjiList[prevIndex].readings;
      }

      setBack(newBack);
    }
      setIsFlipped(false);
  }
};

  return (
    <>
    <Navbar />
    <div className="flex items-center space-x-2">
      <Checkbox 
      id="meaning"
      checked={isMeaningChecked}
      onCheckedChange={handleMeaningCheck} />
      <label
        htmlFor="meaning"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Meaning
      </label>
      <Checkbox 
      id="readings"
      checked={isReadingsChecked}
      onCheckedChange={handleReadingCheck} />
      <label
        htmlFor="readings"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Readings
      </label>
      <button
      className = "rounded-sm border"
      type = "button"
      onClick = {() => setIsPracticeSentences(!isPracticeSentences)}>
        practice sentences
      </button>
    </div>
    {lesson.kanjiList && lesson.kanjiList.length > 0 && (
        <Flashcard
          front={front}
          back={back}
          isFlipped={isFlipped} 
          setIsFlipped={setIsFlipped}
        />
      )}
    <div className="flex justify-between">
    <button onClick = {handleBack} className="bg-customCream w-44 h-20 rounded-md ml-4" type= "button" >Back</button>
    <button onClick = {handleNext} className="bg-customCream w-44 h-20 rounded-md mr-4" type= "button" >Next</button>
    </div>
    </>
  )
}