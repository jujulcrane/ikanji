export interface Lesson  {
  id?: string;
  name: string;
  kanjiList: Kanji[]; 
  practiceSentences: PracticeSentence[];
  multipleChoice?: MultipleChoiceQuestion[];
  userId?: string;
};

export interface Kanji  { 
  character: string;
  meaning: string;
  strokeOrder: string;
  readings: string[];
}

export interface PracticeSentence  {
  japanese: string;
  english: string;
}

export interface MultipleChoiceQuestion {
  term: string;
  correct: string[];
  false: string[];
}

export function Lesson() {
  
}