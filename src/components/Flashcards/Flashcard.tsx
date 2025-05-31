interface FlashcardProps {
  front: string;
  back: {
    meaning?: string;
    readings?: string[];
    strokeOrder?: string;
    english?: string;
  };
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Flashcard({
  front,
  back,
  isFlipped,
  setIsFlipped,
}: FlashcardProps) {
  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <div
      className="flex items-center justify-center w-full px-4"
      onClick={handleFlip}
      role="button"
      aria-pressed={isFlipped}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Outer container with perspective */}
      <div className="relative w-96 h-64 cursor-pointer perspective">
        {/* Inner container that rotates */}
        <div
          className={`relative w-full h-full transition-transform duration-300 ease-in-out transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
            }`}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full bg-customBrownDark text-customCream rounded-xl shadow-xl flex items-center justify-center text-center backface-hidden cursor-pointer">
            <h2 className="m-4 text-3xl font-bold">{front}</h2>
          </div>

          {/* Back Side */}
          <div className="absolute w-full h-full bg-customGold rounded-xl shadow-xl flex items-center justify-center text-center backface-hidden rotate-y-180 cursor-pointer gap-2 px-4 gap-x-6">
            {back.meaning && <p className="text-2xl">{back.meaning}</p>}
            {back.readings && (
              <ul>
                {back.readings.map((reading, index) => (
                  <li key={index} className="text-2xl">{reading}</li>
                ))}
              </ul>
            )}
            {back.english && <p className="m-4 text-xl">{back.english}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
