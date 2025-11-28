'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/components/AuthUserProvider';
import Flashcard from '@/components/Flashcards/Flashcard';
import FlashcardNavigation from '@/components/Flashcards/FlashcardNavigation';
import { Checkbox } from '@/components/ui/checkbox';
import { FaShuffle } from 'react-icons/fa6';
import vocabData from '../../../../data/quartet1-vocab.json';

const AUTHORIZED_USER_ID = 'V7ZOSGug90XpRG09dFPJX9nNZex2';

type VocabItem = {
  id: number;
  page: number;
  word: string;
  reading: string;
  meaning: string;
  readableKanji?: string;
  writableKanji?: string;
  type?: string;
  notes?: string;
};

export default function VocabPage() {
  const { user } = useAuth();
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [isMeaningChecked, setIsMeaningChecked] = useState(true);
  const [isReadingsChecked, setIsReadingsChecked] = useState(true);
  const [vocabItems, setVocabItems] = useState<VocabItem[]>(vocabData.items);

  const isAuthorized = user?.uid === AUTHORIZED_USER_ID;

  // If user is not authorized, show access denied message
  if (!isAuthorized) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="text-4xl font-bold mb-4">Vocab (coming-soon)</h1>
          <p className="text-xl text-gray-500">
            This page is currently not available.
          </p>
        </div>
      </>
    );
  }

  const currentCard = vocabItems[currentIndex];
  const isFinished = currentIndex >= vocabItems.length - 1;

  const goToCard = (index: number) => {
    if (index >= 0 && index < vocabItems.length) {
      setCurrentIndex(index);
      // When reversed, start with flipped side (back/definition)
      setIsFlipped(isReversed);
    }
  };

  const shuffle = () => {
    const shuffled = [...vocabItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setVocabItems(shuffled);
    setCurrentIndex(0);
    // When reversed, start with flipped side (back/definition)
    setIsFlipped(isReversed);
  };

  // Front is always the word
  const front = currentCard.word;

  // Back is always meaning/readings based on checkboxes
  const back: {
    meaning?: string;
    readings?: string[];
  } = {};

  if (isMeaningChecked) {
    back.meaning = currentCard.meaning;
  }
  if (isReadingsChecked && currentCard.reading) {
    back.readings = [currentCard.reading];
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center px-4 py-6 space-y-12">
        <h1 className="text-4xl font-bold">Vocab (coming-soon)</h1>

        {!showFlashcards ? (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={() => setShowFlashcards(true)}
              className="bg-customCream hover:opacity-70 text-black font-semibold py-4 px-8 rounded-md text-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Quartet 1 vocab
            </button>
            <p className="text-gray-600">
              {vocabData.items.length} vocabulary items
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex justify-center items-center">
                <div className="flex items-center space-x-2 m-2">
                  <Checkbox
                    id="meaning"
                    checked={isMeaningChecked}
                    onCheckedChange={() =>
                      setIsMeaningChecked(!isMeaningChecked)
                    }
                  />
                  <label htmlFor="meaning" className="text-sm font-medium">
                    Meaning
                  </label>

                  <Checkbox
                    id="readings"
                    checked={isReadingsChecked}
                    onCheckedChange={() =>
                      setIsReadingsChecked(!isReadingsChecked)
                    }
                  />
                  <label htmlFor="readings" className="text-sm font-medium">
                    Readings
                  </label>
                </div>

                <button
                  type="button"
                  className="rounded-sm p-1 px-2 text-sm bg-black text-white hover:opacity-70 cursor-pointer"
                  onClick={shuffle}
                  aria-label="Shuffle flashcards"
                >
                  <FaShuffle size={22} />
                </button>
              </div>

              <button
                onClick={() => {
                  setIsReversed(!isReversed);
                  // Toggle which side is shown
                  setIsFlipped(!isFlipped);
                }}
                className="bg-gray-400 text-white text-sm p-2 rounded-sm hover:opacity-70 cursor-pointer"
              >
                Switch Term and Definition
              </button>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">{vocabData.title}</h2>
              <p className="text-gray-600">
                Card {currentIndex + 1} of {vocabItems.length}
              </p>
            </div>

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

            <button
              onClick={() => {
                setShowFlashcards(false);
                setCurrentIndex(0);
                setIsFlipped(false);
                setIsReversed(false);
                setVocabItems(vocabData.items);
                setIsMeaningChecked(true);
                setIsReadingsChecked(true);
              }}
              className="bg-gray-400 text-white text-sm p-2 rounded-sm hover:opacity-70 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Back to Menu
            </button>
          </>
        )}
      </main>
    </>
  );
}
