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

  return (
    <div
      className="flex items-center justify-center pt-8 pb-4"
      onClick={handleFlip}
    >
      {/* Outer container with perspective */}
      <div className="relative w-96 h-64 cursor-pointer perspective">
        {/* Inner container that rotates */}
        <div
          className={`relative w-full h-full transition-transform duration-300 ease-in-out transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
            }`}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full bg-customBrownDark text-customCream rounded-lg shadow-xl flex items-center justify-center text-center backface-hidden">
            <h2 className="m-4 text-2xl font-bold">{front}</h2>
          </div>

          {/* Back Side */}
          <div className="absolute w-full h-full bg-customGold rounded-lg shadow-xl flex items-center justify-center text-center backface-hidden rotate-y-180">
            {back.meaning && <p className="text-xl">{back.meaning}</p>}
            {back.readings && (
              <ul>
                {back.readings.map((reading, index) => (
                  <li key={index}>{reading}</li>
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
