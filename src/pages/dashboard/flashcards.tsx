'use client';

import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import useFlashcardLesson from '@/hooks/useFlashcardLesson';
import Flashcard from '@/components/Flashcards/Flashcard';
import FlashcardControls from '@/components/Flashcards/FlashcardControls';
import FlashcardNavigation from '@/components/Flashcards/FlashcardNavigation';

export default function FlashcardsPage() {
  const router = useRouter();
  const { lessonId } = router.query;

  const {
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
    isFinished,
  } = useFlashcardLesson(lessonId);

  if (!lesson) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center px-4 py-6 space-y-12">
        <FlashcardControls
          lesson={lesson}
          isPracticeMode={isPracticeMode}
          isMeaningChecked={isMeaningChecked}
          isReadingsChecked={isReadingsChecked}
          setIsPracticeMode={setIsPracticeMode}
          setIsMeaningChecked={setIsMeaningChecked}
          setIsReadingsChecked={setIsReadingsChecked}
          shuffle={shuffle}
        />

        <button
          onClick={() => {
            setIsReversed(!isReversed);
            setIsFlipped(!isFlipped);
          }}
          className="bg-gray-400 text-white text-sm p-2 mt-2 rounded-sm hover:opacity-50 cursor-pointer"
        >
          Switch Term and Definition
        </button>

        <Flashcard
          front={front}
          back={back}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
        />

        <FlashcardNavigation
          currentIndex={currentIndex}
          isFinished={isFinished}
          goToCard={goToCard}
        />
      </main>
    </>
  );
}
