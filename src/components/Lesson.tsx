export interface Lesson {
  id?: string;
  name: string;
  kanjiList: Kanji[];
  practiceSentences: PracticeSentence[];
  quizSets?: QuizSets;
  userId?: string;
  createdAt?: string;
  publishStatus?: 'pending' | 'published' | 'private';
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
  audioUrl?: string;
}

export interface MultipleChoiceQuestion {
  term: string;
  correct: string[];
  false: string[];
  feedback?: string;
}

export interface QuizSets {
  readingSet: MultipleChoiceQuestion[] | null;
  aiSet: MultipleChoiceQuestion[] | null;
}

export interface User {
  email: string;
  profilePicture?: string;
  createdAt: string;
  lastLogin?: string;
  lessonIds?: string[];
  displayName: string;
  id?: string;
}

export function Lesson() {}
