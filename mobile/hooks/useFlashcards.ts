import { useState, useCallback, useMemo } from 'react';
import { Kanji, PracticeSentence, Lesson } from '@/types';

type Back = {
  meaning?: string;
  readings?: string[];
  english?: string;
};

export function useFlashcards(lesson: Lesson) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isMeaningChecked, setIsMeaningChecked] = useState(true);
  const [isReadingsChecked, setIsReadingsChecked] = useState(true);
  const [kanjiCards, setKanjiCards] = useState<Kanji[]>(lesson.kanjiList);
  const [practiceCards, setPracticeCards] = useState<PracticeSentence[]>(lesson.practiceSentences);

  const maxIndex = useMemo(() => {
    return isPracticeMode ? practiceCards.length : kanjiCards.length;
  }, [isPracticeMode, kanjiCards.length, practiceCards.length]);

  const currentCard = useMemo<Kanji | PracticeSentence | null>(() => {
    return isPracticeMode
      ? practiceCards[currentIndex]
      : kanjiCards[currentIndex];
  }, [isPracticeMode, currentIndex, kanjiCards, practiceCards]);

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

  const goToNext = useCallback(() => {
    setIsFlipped(isReversed);
    setCurrentIndex(prev => (prev + 1) % maxIndex);
  }, [maxIndex, isReversed]);

  const goToPrevious = useCallback(() => {
    setIsFlipped(isReversed);
    setCurrentIndex(prev => (prev - 1 + maxIndex) % maxIndex);
  }, [maxIndex, isReversed]);

  const flipCard = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const shuffle = useCallback(() => {
    if (isPracticeMode) {
      const shuffled = [...practiceCards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setPracticeCards(shuffled);
    } else {
      const shuffled = [...kanjiCards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setKanjiCards(shuffled);
    }
    setCurrentIndex(0);
    setIsFlipped(isReversed);
  }, [isPracticeMode, kanjiCards, practiceCards, isReversed]);

  const togglePracticeMode = useCallback(() => {
    const newMode = !isPracticeMode;
    setIsPracticeMode(newMode);
    if (newMode) {
      setIsMeaningChecked(false);
      setIsReadingsChecked(false);
    } else {
      setIsMeaningChecked(true);
      setIsReadingsChecked(true);
    }
    setCurrentIndex(0);
    setIsFlipped(isReversed);
  }, [isPracticeMode, isReversed]);

  const toggleMeaningChecked = useCallback(() => {
    setIsMeaningChecked(prev => !prev);
    if (isPracticeMode) setIsPracticeMode(false);
  }, [isPracticeMode]);

  const toggleReadingsChecked = useCallback(() => {
    setIsReadingsChecked(prev => !prev);
    if (isPracticeMode) setIsPracticeMode(false);
  }, [isPracticeMode]);

  const toggleReversed = useCallback(() => {
    setIsReversed(prev => !prev);
    setIsFlipped(prev => !prev);
  }, []);

  const currentCardKanji = currentCard as Kanji | null;
  const progress = {
    current: currentIndex + 1,
    total: maxIndex,
    percentage: ((currentIndex + 1) / maxIndex) * 100,
  };

  return {
    currentCard: currentCardKanji,
    currentIndex,
    front,
    back,
    isFlipped,
    isReversed,
    isPracticeMode,
    isMeaningChecked,
    isReadingsChecked,
    progress,
    hasPracticeSentences: lesson.practiceSentences.length > 0,
    goToNext,
    goToPrevious,
    flipCard,
    shuffle,
    togglePracticeMode,
    toggleMeaningChecked,
    toggleReadingsChecked,
    toggleReversed,
  };
}
