export interface Lesson  {
  id?: string;
  name: string;
  kanjiList: Kanji[]; 
  practiceSentences: PracticeSentence[];
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

export function Lesson() {
  
}