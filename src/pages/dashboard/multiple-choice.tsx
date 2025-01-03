import { Lesson, QuizSets } from '@/components/Lesson';
import MultipleChoiceCard from '@/components/MultipleChoiceCard';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getIdToken } from 'firebase/auth';
import Image from 'next/image';
import { TbTruckLoading } from 'react-icons/tb';
import { IoIosSettings } from 'react-icons/io';
import { Progress } from '@/components/ui/progress';
import { IoArrowBackOutline } from 'react-icons/io5';
import { FaRecycle } from 'react-icons/fa6';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import KanjiListCard from '@/components/KanjiListCard';
import { FaShuffle } from 'react-icons/fa6';

interface MultipleChoiceQuestion {
  term: string;
  correct: string[];
  false: string[];
  feedback?: string;
}

type AiQuestion = {
  question: string;
  correctAnswer: string;
  incorrectOptions: string[];
  feedback: string;
};

const hiragana = [
  'あ',
  'い',
  'う',
  'え',
  'お',
  'か',
  'き',
  'く',
  'け',
  'こ',
  'さ',
  'し',
  'す',
  'せ',
  'そ',
  'た',
  'ち',
  'つ',
  'て',
  'と',
  'な',
  'に',
  'ぬ',
  'ね',
  'の',
  'は',
  'ひ',
  'ふ',
  'へ',
  'ほ',
  'ま',
  'み',
  'む',
  'め',
  'も',
  'や',
  'ゆ',
  'よ',
  'ら',
  'り',
  'る',
  'れ',
  'ろ',
  'わ',
  'を',
  'ん',

  'が',
  'ぎ',
  'ぐ',
  'げ',
  'ご',
  'ざ',
  'じ',
  'ず',
  'ぜ',
  'ぞ',
  'だ',
  'ぢ',
  'づ',
  'で',
  'ど',
  'ば',
  'び',
  'ぶ',
  'べ',
  'ぼ',
  'ぱ',
  'ぴ',
  'ぷ',
  'ぺ',
  'ぽ',

  'きゃ',
  'きゅ',
  'きょ',
  'ぎゃ',
  'ぎゅ',
  'ぎょ',
  'しゃ',
  'しゅ',
  'しょ',
  'じゃ',
  'じゅ',
  'じょ',
  'ちゃ',
  'ちゅ',
  'ちょ',
  'にゃ',
  'にゅ',
  'にょ',
  'ひゃ',
  'ひゅ',
  'ひょ',
  'びゃ',
  'びゅ',
  'びょ',
  'ぴゃ',
  'ぴゅ',
  'ぴょ',
  'みゃ',
  'みゅ',
  'みょ',
  'りゃ',
  'りゅ',
  'りょ',
];
const len = hiragana.length;

const randomIndex = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateWrongAnswers = (correctReadings: string[]) => {
  const wrongAnswers: string[] = [];

  while (wrongAnswers.length < 3) {
    let reading = '';
    const randomLength = randomIndex(1, 4);

    for (let i = 0; i < randomLength; i++) {
      reading += hiragana[randomIndex(0, len)];
    }

    if (!correctReadings.includes(reading) && !wrongAnswers.includes(reading)) {
      wrongAnswers.push(reading);
    }
  }
  return wrongAnswers;
};

export default function MultipleChoice() {
  const router = useRouter();
  const { lessonId } = router.query;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [readingSet, setReadingSet] = useState<MultipleChoiceQuestion[] | null>(
    null
  );
  const [aiSet, setAiSet] = useState<MultipleChoiceQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isReadings, setIsReadings] = useState(true);
  const [hasFetchedQuizSet, setHasFetchedQuizSet] = useState(false);
  const [loadingAiSet, setLoadingAiSet] = useState(true);
  const [selectedCorrect, setSelectedCorrect] = useState<string | null>(null);
  const [confirmRefresh, setConfirmRefresh] = useState<boolean>(false);
  const auth = getAuth();
  const selectedSet = isReadings ? readingSet : aiSet;
  const currentQuestion = selectedSet
    ? selectedSet[currentQuestionIndex]
    : null;

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

  useEffect(() => {
    if (lesson && !hasFetchedQuizSet) {
      console.log('Lesson data:', lesson); // Debug log
      const kanjiList = lesson.kanjiList || []; // Use a fallback
      if (lesson.quizSets) {
        setLoadingAiSet(false);
        setReadingSet(lesson.quizSets.readingSet);
        setAiSet(lesson.quizSets.aiSet);
      } else if (kanjiList.length > 0) {
        const newMultipleChoice: MultipleChoiceQuestion[] = kanjiList.map(
          (kanji) => ({
            term: kanji.character,
            correct: kanji.readings,
            false: generateWrongAnswers(kanji.readings),
            feedback: kanji.meaning,
          })
        );
        setReadingSet(newMultipleChoice);

        generateAiSet(false);

        setHasFetchedQuizSet(true);
      } else {
        console.error('Kanji list is empty or undefined');
      }
    }
  }, [lesson, hasFetchedQuizSet]);

  useEffect(() => {
    if (currentQuestion) {
      const randomCorrect =
        currentQuestion.correct[randomIndex(0, currentQuestion.correct.length)];
      setSelectedCorrect(randomCorrect);
    }
  }, [currentQuestion]);

  const generateAiSet = async (regenerating: boolean) => {
    if (!lesson) return;

    try {
      console.log(
        'Generating AI Set for Kanji:',
        lesson.kanjiList.map((kanji) => kanji.character)
      );

      const res = await fetch('/api/ai-multiple-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kanji: lesson.kanjiList.map((kanji) => kanji.character),
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status} $res.statusText`);
      }

      const aiQuestions: {
        question: string;
        correctAnswer: string;
        incorrectOptions: string[];
        feedback: string;
      }[] = await res.json();

      console.log('Received AI Questions:', aiQuestions); // Log the AI questions returned from the API

      const newAiSet: MultipleChoiceQuestion[] = aiQuestions.map(
        (q: AiQuestion) => ({
          term: q.question,
          correct: [q.correctAnswer],
          false: q.incorrectOptions,
          feedback: q.feedback,
        })
      );

      setAiSet(newAiSet);
      if (regenerating) {
        storeMultipleChoice({
          readingSet: readingSet,
          aiSet: newAiSet,
        });
      }
      setLoadingAiSet(false);
    } catch (error) {
      console.error('Failed to generate AI set:', error);
    }
  };

  useEffect(() => {
    if (lesson && !lesson.quizSets && readingSet && aiSet) {
      const newQuizSet = {
        readingSet: readingSet,
        aiSet: aiSet,
      };
      storeMultipleChoice(newQuizSet);
    }
  }, [readingSet, aiSet]);

  const storeMultipleChoice = async (newQuizSet: QuizSets) => {
    if (!lessonId) {
      console.error('Cannot store multiple choice: lessonId is undefined');
      return;
    }

    if (
      !newQuizSet ||
      !readingSet ||
      !aiSet ||
      readingSet.length === 0 ||
      aiSet.length === 0
    ) {
      console.error('Cannot store multiple choice: no data provided');
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      console.error('User not authenticated');
      return;
    } else {
      console.log('Authenticated user UID:', user.uid);
    }

    const token = await getIdToken(user);

    console.log('Storing multiple choice for lessonId:', lessonId);
    console.log('Multiple Choice Data:', newQuizSet);

    try {
      const response = await fetch('/api/update-multiple-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId,
          newQuizSet: newQuizSet,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        console.log('New multiple choice created with ID:', result.id);
      } else {
        throw new Error('Failed to store multiple choice');
      }
    } catch (error) {
      console.error('Error sending multiple choice to backend:', error);
    }
  };

  const handleReturn = (lesson: Lesson) => {
    if (lesson) {
      router.push({
        pathname: `/dashboard/my-lessons`,
        query: { lessonId: lesson.id },
      });
    }
  };

  const handleCorrectAnswer = () => {
    setShowNextButton(true);
  };

  const handleNextQuestion = () => {
    setShowNextButton(false);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    setCurrentQuestionIndex(0);
    console.log(
      `Quiz type switched. Now showing: ${isReadings ? 'Readings' : 'AI'}`
    );
  }, [isReadings]);

  const handleSettings = (lesson: Lesson) => {
    if (lesson) {
      router.push({
        pathname: `/dashboard/quiz-settings`,
        query: { lessonId: lesson.id },
      });
    }
  };

  if (!lesson || !selectedSet) {
    return (
      <div>
        <Navbar />
        <p>Loading lesson or multiple-choice data...</p>
      </div>
    );
  }

  const regenerateReadingsQuizSet = (): void => {
    const kanjiList = lesson.kanjiList || [];
    if (kanjiList.length > 0) {
      const newMultipleChoice: MultipleChoiceQuestion[] = kanjiList.map(
        (kanji) => ({
          term: kanji.character,
          correct: kanji.readings,
          false: generateWrongAnswers(kanji.readings),
          feedback: kanji.meaning,
        })
      );
      setReadingSet(newMultipleChoice);
      storeMultipleChoice({
        readingSet: newMultipleChoice,
        aiSet: aiSet,
      });
    } else {
      console.error('Kanji list is empty or undefined');
    }
  };

  const shuffle = (quizSet: MultipleChoiceQuestion[]): void => {
    const shuffledSet = [...quizSet];
    for (let i = shuffledSet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledSet[i], shuffledSet[j]] = [
        shuffledSet[j],
        shuffledSet[i],
      ];
    }
    if (isReadings) {
      setReadingSet(shuffledSet);
    } else {
      setAiSet(shuffledSet);
    }
    setCurrentQuestionIndex(0);
  }

  if (!currentQuestion) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-center text-xl font-semibold mb-4">
            You&apos;ve completed the lesson!
          </p>
          <Image
            src="/luffy-thumbs-up-one-piece.avif"
            alt="Luffy giving a thumbs-up"
            width={300}
            height={150}
            className="my-4"
          />
          <button
            className="mt-4 bg-customBrownLight text-white py-2 px-4 rounded"
            onClick={() => {
              setCurrentQuestionIndex(0);
              setShowNextButton(false);
              console.log('Quiz restarted');
            }}
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center pb-4">
        <div className="flex justify-content items-center mt-4">
          <button
            className="bg-blue-400 text-white rounded-sm p-1 px-2 text-sm mr-2 hover:opacity-50"
            onClick={() => handleReturn(lesson)}
          >
            <IoArrowBackOutline size={22} />
          </button>
          <button
            className="border rounded-sm p-2 m-1"
            onClick={() => {
              console.log('Learn Readings clicked');
              setIsReadings(true);
              if (!readingSet) {
                console.log('Reading Set is empty, something is wrong...');
              }
            }}
          >
            Readings Quiz
          </button>
          <button
            className="border rounded-sm p-2 m-1"
            onClick={() => {
              console.log('Practice with AI clicked');
              setIsReadings(false);
            }}
            disabled={loadingAiSet}
          >
            AI Quiz
          </button>
          <button
            className="rounded-sm p-1 px-2 ml-1 text-sm bg-black text-white hover:opacity-70"
            onClick={() => {
              if (isReadings && readingSet) {
                shuffle(readingSet);
              } else {
                if (aiSet) shuffle(aiSet);
                console.log('no aiset');
              }
            }}>
            <FaShuffle size={22} />
          </button>
          <button
            className="hover:opacity-50"
            disabled={loadingAiSet}
            onClick={() => handleSettings(lesson)}
          >
            <IoIosSettings size={24} className="ml-2" />
          </button>
          <button
            className="hover:opacity-50"
            disabled={loadingAiSet}
            onClick={() => setConfirmRefresh(true)}
          >
            <FaRecycle size={24} className="ml-2" />
          </button>
        </div>
        <Progress
          value={(currentQuestionIndex / selectedSet.length) * 100}
          className="mt-8 w-80"
        />
        {loadingAiSet && (
          <div className="inline-flex items-center">
            <h1>Generating AI set please wait...</h1>
            <TbTruckLoading className="animate-spin" />
          </div>
        )}
        <MultipleChoiceCard
          question={currentQuestion.term}
          correct={selectedCorrect!}
          incorrect={currentQuestion.false}
          questionFeedback={currentQuestion.feedback}
          onCorrect={handleCorrectAnswer}
        />
        {showNextButton && (
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleNextQuestion}
          >
            Next Question
          </button>
        )}
        <div className="md:absolute md:top-57 left-5 pt-4">
          <KanjiListCard kanjiList={lesson.kanjiList} />
        </div>
      </div>
      <AlertDialog open={confirmRefresh}>
        <AlertDialogContent className="bg-customBrownLight">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Are you sure you want to regenerate the quiz sets?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white">
              You should regenerate the readings set if you have made any
              changes to kanji or readings of this lesson.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-white"
              onClick={() => {
                setConfirmRefresh(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="hover:opacity-50"
              onClick={() => {
                setConfirmRefresh(false);
                regenerateReadingsQuizSet();
              }}
            >
              Regenerate Readings Set
            </AlertDialogAction>
            <AlertDialogAction
              className="hover:opacity-50"
              onClick={() => {
                setConfirmRefresh(false);
                setLoadingAiSet(true);
                generateAiSet(true);
              }}
            >
              Regenerate AI Set
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
