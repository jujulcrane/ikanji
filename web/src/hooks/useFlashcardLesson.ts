import { useEffect, useMemo, useState } from 'react';
import { auth } from '@/utils/firebase';
import { Lesson, Kanji, PracticeSentence } from '@/components/Lesson';

// Handles lesson fetch, shuffle, navigation, current card logic

type Back = {
  meaning?: string;
  readings?: string[];
  english?: string;
};

export default function useFlashcardLesson(
  lessonId: string | string[] | undefined
) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isMeaningChecked, setIsMeaningChecked] = useState(true);
  const [isReadingsChecked, setIsReadingsChecked] = useState(true);
  const [isReversed, setIsReversed] = useState(false);

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const res = await fetch(`/api/get-lesson?lessonId=${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: Lesson = await res.json();
      if (res.ok && data) {
        setLesson(data);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        console.error('Failed to fetch lesson.');
      }
    };

    fetchLesson();
  }, [lessonId]);

  const maxIndex = useMemo(() => {
    if (!lesson) return 0;
    return isPracticeMode
      ? lesson.practiceSentences.length
      : lesson.kanjiList.length;
  }, [lesson, isPracticeMode]);

  const currentCard = useMemo<Kanji | PracticeSentence | null>(() => {
    if (!lesson) return null;
    return isPracticeMode
      ? lesson.practiceSentences[currentIndex]
      : lesson.kanjiList[currentIndex];
  }, [lesson, currentIndex, isPracticeMode]);

  const front = useMemo<string>(() => {
    if (!currentCard) return '';
    return isPracticeMode
      ? (currentCard as PracticeSentence).japanese
      : (currentCard as Kanji).character;
  }, [currentCard, isPracticeMode]);

  const back: Back = useMemo(() => {
    if (!currentCard) return {};

    if (isPracticeMode) {
      return {
        english: (currentCard as PracticeSentence).english,
      };
    } else {
      const kanji = currentCard as Kanji;
      const b: Back = {};
      if (isMeaningChecked) b.meaning = kanji.meaning;
      if (isReadingsChecked) {
        b.readings = kanji.readings.map((r) => r.value);
      }
      return b;
    }
  }, [currentCard, isPracticeMode, isMeaningChecked, isReadingsChecked]);

  const goToCard = (index: number) => {
    if (index >= 0 && index < maxIndex) {
      setCurrentIndex(index);
      setIsFlipped(isReversed);
    }
  };

  const shuffle = () => {
    if (!lesson) return;

    if (isPracticeMode) {
      const shuffled = [...lesson.practiceSentences];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setLesson({ ...lesson, practiceSentences: shuffled });
    } else {
      const shuffled = [...lesson.kanjiList];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setLesson({ ...lesson, kanjiList: shuffled });
    }

    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return {
    lesson,
    front,
    back,
    currentIndex,
    isFlipped,
    isReversed,
    isPracticeMode,
    isMeaningChecked,
    isReadingsChecked,
    setIsFlipped,
    setIsReversed,
    setIsPracticeMode,
    setIsMeaningChecked,
    setIsReadingsChecked,
    goToCard,
    shuffle,
    isFinished: currentIndex >= maxIndex - 1,
  };
}
