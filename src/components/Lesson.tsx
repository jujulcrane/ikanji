export interface Lesson {
  id?: string;
  name: string;
  kanjiList: Kanji[];
  practiceSentences: PracticeSentence[];
  quizSets?: QuizSets;
  userId?: string;
}

export interface Kanji {
  character: string;
  meaning: string;
  strokeOrder?: string;
  readings: string[];
}

export interface PracticeSentence {
  japanese: string;
  english: string;
}

export interface MultipleChoiceQuestion {
  term: string;
  correct: string[];
  false: string[];
}

export interface MultipleChoice {
  questions: MultipleChoiceQuestion[];
  name: 'readings' | 'ai';
}

export interface QuizSets {
  readingSet: MultipleChoiceQuestion[] | null;
  aiSet: MultipleChoiceQuestion[] | null;
}

export function Lesson() { }
