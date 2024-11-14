import { useState } from "react";

interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
}

export default function Flashcard({ front, back, isFlipped, setIsFlipped}: FlashcardProps) {
  
  const handleFlip = () => {
    // @ts-ignore
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      className="flex items-center justify-center pt-8 pb-4"
      onClick={handleFlip}
    >
      {/* Outer container with perspective */}
      <div className="relative w-96 h-64 cursor-pointer perspective">
        {/* Inner container that rotates */}
        <div
          className={`relative w-full h-full transition-transform duration-500 ease-in-out transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full bg-customBrownDark text-customCream rounded-lg shadow-xl flex items-center justify-center text-center backface-hidden">
            <h2 className="text-2xl font-bold">{front}</h2>
          </div>

          {/* Back Side */}
          <div className="absolute w-full h-full bg-customGold rounded-lg shadow-xl flex items-center justify-center text-center backface-hidden rotate-y-180">
            <p className="text-xl">{back}</p>
          </div>
        </div>
      </div>
    </div>
  );
}