import { useState } from "react";

interface MultipleChoiceProps {
  question: string;
  correct: string;
  incorrect: string[];
}
interface MultipleChoiceQuestion {
  term: string;
  correct: string[];
  false: string[];
}

export default function MultipleChoice({ question, correct, incorrect}: MultipleChoiceProps) {
  
  const handleFlip = () => {
    // @ts-ignore
    setIsFlipped((prev) => !prev);
  };

  return (
    <div>
      <div className="bg-customGold rounded-sm flex items-center justify-center pt-8 pb-4 w-96 h-64">
        <h1>{question}</h1>
      </div>
    </div>
  );
}