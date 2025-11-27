import { useState, useCallback } from 'react';
import { Kanji } from '@/types';

export function useFlashcards(kanjiList: Kanji[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [cards, setCards] = useState<Kanji[]>(kanjiList);

  const goToNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % cards.length);
  }, [cards.length]);

  const goToPrevious = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const flipCard = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const shuffle = useCallback(() => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffled(true);
  }, [cards]);

  const reset = useCallback(() => {
    setCards(kanjiList);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffled(false);
  }, [kanjiList]);

  const currentCard = cards[currentIndex];
  const progress = {
    current: currentIndex + 1,
    total: cards.length,
    percentage: ((currentIndex + 1) / cards.length) * 100,
  };

  return {
    currentCard,
    currentIndex,
    isFlipped,
    shuffled,
    progress,
    goToNext,
    goToPrevious,
    flipCard,
    shuffle,
    reset,
  };
}
