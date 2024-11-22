import { Lesson } from "@/components/Lesson";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface MultipleChoiceQuestion {
  term: string;
  correct: string[];
  false: string[];
}
const hiragana = [
  "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ",
  "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と",
  "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ",
  "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り",
  "る", "れ", "ろ", "わ", "を", "ん",

  "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ",
  "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ",
  "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",

  "きゃ", "きゅ", "きょ", "ぎゃ", "ぎゅ", "ぎょ",
  "しゃ", "しゅ", "しょ", "じゃ", "じゅ", "じょ",
  "ちゃ", "ちゅ", "ちょ", "にゃ", "にゅ", "にょ",
  "ひゃ", "ひゅ", "ひょ", "びゃ", "びゅ", "びょ",
  "ぴゃ", "ぴゅ", "ぴょ", "みゃ", "みゅ", "みょ",
  "りゃ", "りゅ", "りょ"
];
const len = hiragana.length;

const randomIndex = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateWrongAnswers = ((correctReadings: string[]) => {
  const wrongAnswers: string[] = [];

  while (wrongAnswers.length < 3) {
    let reading = "";
    const randomLength = randomIndex(1,4);

    for (let i = 0; i < randomLength; i++) {
      reading += hiragana[randomIndex(0,len)];
    }

    if (!correctReadings.includes(reading) && !wrongAnswers.includes(reading)) {
      wrongAnswers.push(reading);
    }
  }
  return wrongAnswers;
});


export default function MultipleChoice() 
{
  const router = useRouter();
  const { lessonId } = router.query;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [multipleChoice, setMultipleChoice] = useState<MultipleChoiceQuestion[] | null>(null);


  useEffect(() => {
    if (lessonId) {
      const fetchLesson = async() => {
        const response = await fetch(`/api/get-lesson?lessonId=${lessonId}`);
        const data = await response.json();
        console.log("Fetched lesson data:", data);
        if (data)
        {
          setLesson(data);
        }else{
          console.error('Lesson not found:', data.error);
        }
      };

      fetchLesson();
    }
  }, [lessonId]);

  // const generateFalseMultipleChoice = (async (readings: string[]) => {
  //   try {
  //   const res = await fetch("/api/generate-multiple-choice", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ readings}),
  //   });

  //   if (!res.ok) {
  //     throw new Error("Failed to generate multiple choice");
  //   }

  //   return await res.json();

  // } catch (error) {
  //   console.error("Error generating multiple choice:", error);
  //   return [];
  // }
  // });

  useEffect(() => {
    if (lesson)
    {
        if (lesson.multipleChoice)
      {
        setMultipleChoice(lesson.multipleChoice);
      }
      else
      {
        
        const newMultipleChoice: MultipleChoiceQuestion[] = lesson.kanjiList.map((kanji) => ({
          term: kanji.character,
          correct: kanji.readings,
          false: generateWrongAnswers(kanji.readings),
        }));
        setMultipleChoice(newMultipleChoice);
        console.log('POST to database');
      }
    };
  }, [lesson]);
  
  return (
    <>
    <Navbar></Navbar>
    <div className="flex items-center space-x-2">
<p>Multiple Choice</p>
{lesson ? multipleChoice ? (
    <ul>
  {multipleChoice.map((kanji, kanjiIndex) => 
  <li key={kanjiIndex}>
    <p>{kanji.term}</p>
    <ul>
    {kanji.correct.map((reading, index) => (
    <li key={`correct-${kanjiIndex}-${index}`}>
      {reading}
      </li>))}
    </ul>
    <ul>
      <p> Wrong answers </p>
      <br></br>
    {kanji.false.map((falseChoice, index) => (
      <li key= {`false-${kanjiIndex}-${index}`}>{falseChoice}</li>))}
    </ul>
    </li>
  )}
  </ul>
  ) : (
    <p>Loading lesson data...</p>
  ) : (
    <p>Loading multiple choice data...</p>
  )
  }
      </div>
    </>
  );
}