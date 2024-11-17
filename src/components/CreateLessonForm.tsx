import { useState, ChangeEvent, FormEvent, MouseEvent, useCallback } from "react";
import Button from "./button";
import { collection } from "firebase/firestore";
import { PracticeSentence, Kanji, Lesson } from "./Lesson";

export function CreateNewLessonForm()
{

const [kanjiChar, setKanjiChar] = useState <string> ('');
const [meaning, setMeaning] = useState <string> ('');
const [strokeOrder, setStrokeOrder] = useState <string> ('');
const [reading, setReading] = useState <string> ('');
const [japanese, setJapanese] = useState <string> ('');
const [english, setEnglish] = useState <string> ('');

const [readings, setReadings] = useState<string[]>([]);
const [practiceSentences, setPracticeSentences] = useState<PracticeSentence[]>([]);
const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
const [name, setName] = useState<string>('');
  
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value
    );
  };
  
  const handleReadingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReading(e.target.value);
  };

  const handleReadingSubmit = () => {
    if (!reading.trim()) {
      alert("Please add at least one reading.");
      return;
    } else{
      setReadings(prevReadings => [...prevReadings, reading]);
      setReading('');
    }
  };

  const handleKanjiSubmit = () => {
    if (!kanjiChar.trim() || !meaning.trim() || !strokeOrder.trim() || readings.length === 0) {
      alert("Please fill in all the fields and add at least one reading.");
      return;
    }
    const newKanji: Kanji = {
      character: kanjiChar,
      meaning: meaning,
      strokeOrder: strokeOrder,
      readings: readings
    };

    setKanjiList(prevList => [...prevList, newKanji]);

    setKanjiChar('');
    setMeaning('');
    setStrokeOrder('');
    setReadings([]);
  }

  const handleSentenceSubmit = () => {
    if (!japanese.trim() || !english.trim()) {
      alert("Please fill in all the fields and add at least one reading.");
      return;
    }
    const newSentence: PracticeSentence = {
      japanese: japanese,
      english: english
    };

    setPracticeSentences(prevList => [...prevList, newSentence]);

    setJapanese('');
    setEnglish('');

  }

  const handleSubmit = async () => {

    const newLesson: Lesson = {
      name: name,
      kanjiList: kanjiList,
      practiceSentences: practiceSentences,
    };
    console.log("Creating Lesson:", newLesson);

     try {
      const response = await fetch("/api/update-lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLesson),
      });

      if (response.ok) {
        const result = await response.json();

        console.log("New lesson created with ID:", result.id);
        
        setKanjiList([]);
      setPracticeSentences([]);
      setReadings([]);
      setKanjiChar('');
      setMeaning('');
      setStrokeOrder('');
      setReading('');
      setJapanese('');
      setEnglish('');
      setName('');
      } else {
        throw new Error("Failed to create lesson");
      }
     } catch (error) {
      console.error("Error sending lesson to backend:", error);
     }
  };

  function renderKanjiList(){
    return(
    kanjiList.map((kanji, index) => (
      <li key={kanji.character}>
        <strong>{kanji.character}</strong>: {kanji.meaning} (Stroke Order: {kanji.strokeOrder})
        <div>
            <p>{kanji.readings.join(', ')}</p>
        </div>
      </li>
    )));
  }

  const generateAISentences = useCallback(async () => {
    const res = await fetch("/api/generate-sentences", {
      method: "POST",
      body: JSON.stringify({
        kanji: kanjiList.map(kanji => kanji.character)
      })
    });
    const generatedSentences = await res.json();
    setPracticeSentences([...generatedSentences, ...practiceSentences])
  }, [kanjiList, practiceSentences, setPracticeSentences])

  function renderPracticeSentences(){
    return(
      <ul>
    {practiceSentences.map((practiceSentence, index) => (
      <li key={index}> {practiceSentence.japanese} / {practiceSentence.english}
      </li>
    ))}
    </ul>
    );
  }

  function renderReadings() {
    return readings.map((reading, index) => (
      <li key={index}>{reading}</li>
    ));
  }
  
  //function submiteform (POST)
  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-customCream">
        <form className="w-2/3 bg-white shadow-lg rounded-lg p-8 space-y-6 mx-auto" onSubmit={handleSubmit}>
            <h1 className="font-semibold p-8 text-lg" >Create New Lesson</h1>
            <div>
                <label htmlFor="name" className="p-2">Lesson Name</label>
                <input className= "border"
                type="text" 
                id="name" 
                value = {name}
                onChange = {handleNameChange}
                />
            </div>
            <div>
            <h3 className="font-medium pt-6 pb-2">Kanji</h3>
            <ul>
            {renderKanjiList()}
            </ul>
            </div>
            <div>
                <label className="p-2" htmlFor="kanjiChar">Kanji</label>
                <input className="border"
                type="text" 
                id="kanjiChar" 
                value = {kanjiChar}
                onChange={(e) => setKanjiChar(e.target.value)}
                />
            </div>
            <div>
                <label className="p-2" htmlFor="meaning">Meaning</label>
                <input className="border" 
                type="text" 
                id="meaning" 
                value = {meaning}
                onChange = {(e) => setMeaning(e.target.value)}
                />
            </div>
            <div>
                <label className="p-2" htmlFor="strokeOrder">Stroke Order IMG url</label>
                <input className="border"
                type="text" 
                id="strokeOrder" 
                value = {strokeOrder}
                onChange={(e) => setStrokeOrder(e.target.value)}
                />
            </div>
            <div>
              <h1>Readings</h1>
              <ul>
                {renderReadings()}
              </ul>
            </div>
            <div>
            <div className="flex items-center gap-2">
                <label className="whitespace-nowrap" htmlFor="reading">Readings</label>
                <input className="border rounded px-4 py-2 flex-grow"
                type="text" 
                id="reading" 
                value = {reading}
                onChange = {handleReadingChange}
                />
                <Button onClick={handleReadingSubmit}>Add Reading</Button>
                </div>
            </div>
            <div className="p-2">
            <Button onClick={handleKanjiSubmit} >Add Kanji</Button>
            </div>
            <div>
              <div className="flex w-full justify-between items-center">
            <h1 className="p-4 font-medium">Practice Sentences</h1>
              <button type="button" className="text-blue-500 text-sm" onClick={generateAISentences}>Generate with AI</button>
            </div>
              <ul>
                {renderPracticeSentences()}
              </ul>
            </div>
            <div>
                <label className="p-2" htmlFor="japanese">Japanese</label>
                <input className="border"
                type="text" 
                id="japanese" 
                value = {japanese}
                onChange = {(e) => setJapanese(e.target.value)}
                />
                <label className="p-2" htmlFor="english">Translation</label>
                <input className="border m-2"
                type="text" 
                id="english" 
                value = {english}
                onChange = {(e) => setEnglish(e.target.value)}
                />
                <Button onClick={handleSentenceSubmit}>Add</Button>
              </div>

            <Button onClick={handleSubmit} disabled={kanjiList.length==0}>Create Lesson</Button>
        </form>
    </div>
    </>
  );
}