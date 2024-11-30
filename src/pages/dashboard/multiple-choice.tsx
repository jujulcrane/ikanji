import { Lesson, QuizSets } from '@/components/Lesson';
import MultipleChoiceCard from '@/components/MultipleChoiceCard';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getIdToken } from 'firebase/auth';

interface MultipleChoiceQuestion {
  term: string;
  correct: string[];
  false: string[];
}

type AiQuestion = {
  question: string;
  correctAnswer: string;
  incorrectOptions: string[];
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

  // const generateFalseMultipleChoice = (async (readings: string[]) => {
  //   try {
  //   const res = await fetch("/api/generate-multiple-choice", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ readings}),
  //   });

  //   if (!res.ok) {
  //     throw new Error("Failed to generate multiple choice");
  //   }

  //   return await res.json();

  // } catch (error) {
  //   console.error("Error generating multiple choice:", error);
  //   return [];
  // }
  // });

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
          })
        );
        setReadingSet(newMultipleChoice);

        generateAiSet();

        setHasFetchedQuizSet(true);
      } else {
        console.error('Kanji list is empty or undefined');
      }
    }
  }, [lesson, hasFetchedQuizSet]);

  const generateAiSet = async () => {
    if (!lesson) return;

    try {
      console.log(
        'Generating AI Set for Kanji:',
        lesson.kanjiList.map((kanji) => kanji.character)
      ); // Log Kanji being sent to the API

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
      }[] = await res.json();

      console.log('Received AI Questions:', aiQuestions); // Log the AI questions returned from the API

      const newAiSet: MultipleChoiceQuestion[] = aiQuestions.map(
        (q: AiQuestion) => ({
          term: q.question,
          correct: [q.correctAnswer],
          false: q.incorrectOptions,
        })
      );

      setAiSet(newAiSet);
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

  const selectedSet = isReadings ? readingSet : aiSet;
  const currentQuestion = selectedSet
    ? selectedSet[currentQuestionIndex]
    : null;

  if (!lesson || !selectedSet) {
    return (
      <div>
        <Navbar />
        <p>Loading lesson or multiple-choice data...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div>
        <Navbar />
        <p>You&apos;ve completed the lesson!</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center">
        <div>
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
            Readings Quiz Set
          </button>
          <button
            className="border rounded-sm p-2 m-1"
            onClick={() => {
              console.log('Practice with AI clicked');
              setIsReadings(false);
            }}
            disabled={loadingAiSet}
          >
            Practice with AI Set
          </button>
        </div>
        <MultipleChoiceCard
          question={currentQuestion.term}
          correct={
            currentQuestion.correct[
              randomIndex(0, currentQuestion.correct.length)
            ]
          }
          incorrect={currentQuestion.false}
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
      </div>
    </>
  );
}
