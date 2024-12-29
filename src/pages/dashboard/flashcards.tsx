import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Flashcard from '@/components/Flashcard';
import { Lesson } from '@/components/Lesson';
import Navbar from '@/components/Navbar';
import { Checkbox } from '@/components/ui/checkbox';
import { auth } from '@/utils/firebase';
import { IoArrowBackOutline } from "react-icons/io5";
import { FaShuffle } from "react-icons/fa6";

type Back = {
  meaning?: string;
  readings?: string[];
  strokeOrder?: string;
  english?: string;
};
export default function Flashcards() {
  const router = useRouter();
  const { lessonId } = router.query;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [front, setFront] = useState<string>('');
  const [back, setBack] = useState<Back>({});
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPracticeSentences, setIsPracticeSentences] =
    useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [isMeaningChecked, setIsMeaningChecked] = useState(true);
  const [isReadingsChecked, setIsReadingsChecked] = useState(true);

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
          setFront(data.kanjiList[0].character);
          setBack(data.kanjiList[0].meaning);
        } else {
          console.error('Lesson not found:', data.error);
        }
      };

      fetchLesson();
    }
  }, [lessonId]);

  useEffect(() => {
    if (lesson && lesson.kanjiList[currentCardIndex]) {
      const listLength = isPracticeSentences
        ? lesson.practiceSentences.length
        : lesson.kanjiList.length;
      if (currentCardIndex > listLength - 2) {
        setFinished(true);
      } else {
        setFinished(false);
      }
      const newBack: Back = {};
      if (isPracticeSentences) {
        if (finished && (isMeaningChecked || isReadingsChecked)) {
          setFinished(false);
          setCurrentCardIndex(0);
        }
        setIsMeaningChecked(false);
        setIsReadingsChecked(false);
        const practiceIndex = Math.min(currentCardIndex, lesson.practiceSentences.length - 1);
        newBack.english = lesson.practiceSentences[practiceIndex].english;
        setFront(lesson.practiceSentences[practiceIndex].japanese);
      } else {
        if (isMeaningChecked) {
          newBack.meaning = lesson.kanjiList[currentCardIndex].meaning;
        }
        if (isReadingsChecked) {
          newBack.readings = lesson.kanjiList[currentCardIndex].readings;
        }
      }

      setBack(newBack);
    }
  }, [
    isMeaningChecked,
    isReadingsChecked,
    isPracticeSentences,
    currentCardIndex,
    lesson,
  ]);

  if (!lesson) return <p>Loading...</p>;

  const handleMeaningCheck = () => {
    setIsMeaningChecked(!isMeaningChecked);
    if (!isReadingsChecked && !isPracticeSentences) {
      setIsReadingsChecked(true);
    }
    if (isPracticeSentences) {
      setIsPracticeSentences(false);
      if (lesson && currentCardIndex >= lesson.kanjiList.length) {
        setCurrentCardIndex(0);
        setFront(lesson.kanjiList[0]?.character || '');
      } else {
        setFront(lesson?.kanjiList[currentCardIndex]?.character || '');
      }
    }
  };

  const handleReadingCheck = () => {
    setIsReadingsChecked(!isReadingsChecked);
    if (!isMeaningChecked && !isPracticeSentences) {
      setIsMeaningChecked(true);
    }
    if (isPracticeSentences) {
      setIsPracticeSentences(false);
      if (lesson && currentCardIndex >= lesson.kanjiList.length) {
        setCurrentCardIndex(0);
        setFront(lesson.kanjiList[0]?.character || '');
      } else {
        setFront(lesson?.kanjiList[currentCardIndex]?.character || '');
      }
    }
  };

  const handleNext = () => {
    console.log('next card');
    if (!lesson) return;

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
  };

  const handleBack = () => {
    console.log('display prev card');
    if (!lesson) return;
    const prevIndex = currentCardIndex - 1;
    setCurrentCardIndex(prevIndex);

    if (isPracticeSentences) {
      setFront(lesson.practiceSentences[currentCardIndex].japanese);
      setBack({ english: lesson.practiceSentences[prevIndex].english });
    } else {
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
  };

  const handleReturn = (lesson: Lesson) => {
    if (lesson) {
      router.push({
        pathname: `/dashboard/my-lessons`,
        query: { lessonId: lesson.id },
      });
    }
  };

  const shuffle = () => {
    if (isPracticeSentences) {
      const shuffledPracticeSentences = [...lesson.practiceSentences];
      for (let i = shuffledPracticeSentences.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPracticeSentences[i], shuffledPracticeSentences[j]] = [
          shuffledPracticeSentences[j],
          shuffledPracticeSentences[i],
        ];
      }

      const shuffledLesson = { ...lesson, practiceSentences: shuffledPracticeSentences };
      setLesson(shuffledLesson);
      const newFront = shuffledLesson.practiceSentences[0].japanese;
      const newBack: Back = {};
      newBack.english = shuffledLesson.practiceSentences[0].english;
      setFront(newFront);
      setBack(newBack);
      setCurrentCardIndex(0);
    } else {
      const shuffledKanjiList = [...lesson.kanjiList];
      for (let i = shuffledKanjiList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledKanjiList[i], shuffledKanjiList[j]] = [
          shuffledKanjiList[j],
          shuffledKanjiList[i],
        ];
      }

      const shuffledLesson = { ...lesson, kanjiList: shuffledKanjiList };
      setLesson(shuffledLesson);

      const newFront = shuffledLesson.kanjiList[0].character;
      const newBack: Back = {};
      if (isMeaningChecked) {
        newBack.meaning = shuffledLesson.kanjiList[0].meaning;
      }
      if (isReadingsChecked) {
        newBack.readings = shuffledLesson.kanjiList[0].readings;
      }
      setFront(newFront);
      setBack(newBack);
      setCurrentCardIndex(0);
    }
  };


  return (
    <>
      <Navbar />
      <div className="mt-8 flex justify-center items-center">
        <div className="flex items-center space-x-2 m-2">
          <button className="bg-blue-400 text-white rounded-sm p-1 px-2 text-sm mr-2 hover:opacity-50" onClick={() => handleReturn(lesson)}><IoArrowBackOutline size={22} /></button>
          <Checkbox
            id="meaning"
            checked={isMeaningChecked}
            onCheckedChange={handleMeaningCheck}
          />
          <label
            htmlFor="meaning"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Meaning
          </label>
          <Checkbox
            id="readings"
            checked={isReadingsChecked}
            onCheckedChange={handleReadingCheck}
          />
          <label
            htmlFor="readings"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Readings
          </label>
          <button
            className="rounded-sm p-1 px-2 text-sm bg-customCream hover:opacity-70"
            type="button"
            disabled={lesson.practiceSentences.length < 1 || isPracticeSentences}
            onClick={() => setIsPracticeSentences(!isPracticeSentences)}
          >
            Practice Sentences
          </button>
        </div>
        <button
          className="rounded-sm p-1 px-2 text-sm bg-black text-white hover:opacity-70"
          type="button"
          onClick={shuffle}
        >
          <FaShuffle size={22} />
        </button>
      </div>
      <div className="flex flex-col items-center justfiy-center min-h-screen">
        {lesson.kanjiList && lesson.kanjiList.length > 0 && (
          <Flashcard
            front={front}
            back={back}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
          />
        )}
        <div className="flex justify-evenly w-full mt-4">
          <button
            onClick={handleBack}
            disabled={currentCardIndex === 0}
            className={`${currentCardIndex === 0 ? 'bg-gray-200' : 'bg-customCream'} w-44 h-20 rounded-md ml-4`}
            type="button"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={finished}
            className={`${finished ? 'bg-gray-200' : 'bg-customCream'} w-44 h-20 rounded-md mr-4`}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
