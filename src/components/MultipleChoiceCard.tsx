import { useEffect, useState } from 'react';

interface MultipleChoiceProps {
  question: string;
  correct: string;
  incorrect: string[];
  onCorrect: () => void;
}

export default function MultipleChoiceCard({
  question,
  correct,
  incorrect,
  onCorrect,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * (options.length + 1));
    const newOptions = [...incorrect];
    newOptions.splice(randomIndex, 0, correct);
    setOptions(newOptions);
    setFeedback(null);
    setSelected(null);
  }, [question, correct, incorrect]);

  const handleSelect = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const selectedValue = e.currentTarget.value;
    setSelected(selectedValue);

    if (selectedValue === correct) {
      console.log('correct!');
      setFeedback('Correct!');
      onCorrect();
    } else {
      console.log('incorrect');
      setFeedback('Incorrect. Try again!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-4">
      <div className="bg-customGold rounded-sm flex items-center justify-center pt-8 pb-4 w-96 h-64 mb-4">
        <h1 className="mx-2 text-3xl text-center leading-relaxed break-words overflow-hidden max-w-full">{question}</h1>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 w-96">
        {options.map((option, index) => (
          <button
            key={index}
            className={`pt-1 pb-1 rounded-sm bg-customBrownLight text-white ${selected === option
              ? option === correct
                ? 'bg-green-500'
                : 'bg-red-500'
              : ''
              }`}
            type="button"
            value={option}
            onClick={handleSelect}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && <p className="mt-4 text-lg">{feedback}</p>}
    </div>
  );
}
