import { useState, ChangeEvent, useCallback } from 'react';
import Button from './button';
import { PracticeSentence, Kanji, Lesson, Reading } from './Lesson';
import { auth } from '@/utils/firebase';
import { getIdToken } from 'firebase/auth';
import { TbTruckLoading } from 'react-icons/tb';
import { fetchKanji } from '@/hooks/fetch-kanji';
import { useRouter } from 'next/router';

export function CreateNewLessonForm() {
  const [kanjiChar, setKanjiChar] = useState<string>('');
  const [meaning, setMeaning] = useState<string>('');
  const [readingValue, setReadingValue] = useState<string>('');
  const [readingType, setReadingType] = useState<'kun' | 'on'>('kun');
  const [japanese, setJapanese] = useState<string>('');
  const [english, setEnglish] = useState<string>('');
  const [loadingAiSentences, setLoadingAiSentences] = useState(false);
  const [readings, setReadings] = useState<Reading[]>([]); const [practiceSentences, setPracticeSentences] = useState<
    PracticeSentence[]
  >([]);
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const [name, setName] = useState<string>('');
  const [character, setCharacter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleReadingValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReadingValue(e.target.value);
  };

  const handleReadingTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setReadingType(e.target.value as 'kun' | 'on');
  };

  const handleReadingSubmit = () => {
    const newReading: Reading = { value: readingValue, type: readingType };
    setReadings((prevReadings) => [...prevReadings, newReading]);
    setReadingValue('');
  };

  const handleKanjiSubmit = () => {
    if (
      !kanjiChar.trim() ||
      !meaning.trim() ||
      readings.length === 0
    ) {
      alert('Please fill in all the fields and add at least one reading.');
      return;
    }
    const newKanji: Kanji = {
      character: kanjiChar,
      meaning: meaning,
      readings: readings,
    };

    setKanjiList((prevList) => [...prevList, newKanji]);

    setKanjiChar('');
    setMeaning('');
    setReadings([]);
  };

  const fetchKanjiData = async () => {
    try {
      const newKanji = await fetchKanji(character);
      setKanjiList((prev) => [...prev, newKanji]);
    } catch (error) {
      console.error('Error fetching kanji:', error);
    }
  };

  const handleSentenceSubmit = () => {
    if (!japanese.trim() || !english.trim()) {
      alert('Please fill in all the fields and add at least one reading.');
      return;
    }
    const newSentence: PracticeSentence = {
      japanese: japanese,
      english: english,
    };

    setPracticeSentences((prevList) => [...prevList, newSentence]);

    setJapanese('');
    setEnglish('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMessage(null);
    const user = auth.currentUser;

    if (!user) {
      console.error('User not authenticated');
      return;
    } else {
      console.log('Authenticated user UID:', user.uid);
    }

    const token = await getIdToken(user);

    const newLesson: Lesson = {
      name: name,
      kanjiList: kanjiList,
      practiceSentences: practiceSentences,
      userId: user.uid,
      publishStatus: 'private',
    };

    console.log('Creating Lesson:', newLesson);

    try {
      const response = await fetch('/api/create-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLesson),
      });

      if (response.ok) {
        await response.json();

        setSuccessMessage('Lesson successfully added!');

        setKanjiList([]);
        setPracticeSentences([]);
        setReadings([]);
        setKanjiChar('');
        setMeaning('');
        setJapanese('');
        setEnglish('');
        setName('');
      } else {
        throw new Error('Failed to create lesson');
      }
    } catch (error) {
      console.error('Error sending lesson to backend:', error);
      setSuccessMessage('Failed to add lesson :(');
    }
    setLoading(false);
  };

  function renderKanjiList() {
    return kanjiList.map((kanji) => (
      <li key={kanji.character}>
        <strong>{kanji.character}</strong>: {kanji.meaning}
        <div>
          <p>
            {kanji.readings.map((reading, index) => (
              <span key={index}>
                {reading.value} ({reading.type})
                {index < kanji.readings.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        </div>
      </li>
    ));
  }

  const generateAISentences = useCallback(async () => {
    const res = await fetch('/api/generate-sentences', {
      method: 'POST',
      body: JSON.stringify({
        kanji: kanjiList.map((kanji) => kanji.character),
      }),
    });
    const generatedSentences = await res.json();
    setPracticeSentences([...generatedSentences, ...practiceSentences]);
    if (res.ok) {
      setLoadingAiSentences(false);
    }
  }, [kanjiList, practiceSentences, setPracticeSentences]);

  function renderPracticeSentences() {
    return (
      <ul>
        {practiceSentences.map((practiceSentence, index) => (
          <li key={index}>
            {' '}
            {practiceSentence.japanese} / {practiceSentence.english}
          </li>
        ))}
      </ul>
    );
  }

  function renderReadings() {
    return readings.map((reading, index) => (
      <li key={index}>{reading.value} ({reading.type})</li>
    ));
  }

  const displayLoading = () => {
    return (
      <div className="flex items-center justify-center">
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <h1 className="text-white">
            {' '}
            Adding lesson
            <TbTruckLoading className="animate-spin" /> ...{' '}
          </h1>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-customCream">
        {loading && displayLoading()}
        {successMessage ? (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md text-center">
              <h2 className="text-xl text-customBrownDark">{successMessage}</h2>
              <div className="grid-cols-1 gap-2">
                <button
                  onClick={() => router.push('/dashboard/my-lessons')}
                  className="mt-4 py-2 w-1/2 px-4 bg-customBrownLight text-white rounded-md hover:opacity-70"
                >
                  Go to My Lessons
                </button>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className=" w-3/5 mt-4 py-2 px-4 bg-customBrownDark text-white rounded-md hover:bg-opacity-70"
                >
                  Continue Creating Lessons
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form
            className="w-2/3 bg-white shadow-lg rounded-lg p-8 space-y-6 mx-auto mt-4"
            onSubmit={handleSubmit}
          >
            <h1 className="font-semibold p-8 text-lg">Create New Lesson</h1>
            <div>
              <label htmlFor="name" className="p-2">
                Lesson Name
              </label>
              <input
                className="border"
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold pt-6 pb-2">Kanji</h3>
              <ul>{renderKanjiList()}</ul>
            </div>
            <h1 className="font-semibold">Add Kanji From its Character</h1>
            <div className='flex items-center justify-center gap-2 md:w-1/2'>
              <label className="p-2">
                Character
              </label>
              <input
                className="border w-1/2"
                type="text"
                id="character"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
              />
              <div className="w-1/3">
                <Button onClick={fetchKanjiData}>Add</Button>
              </div>
            </div>
            <h1 className="font-semibold">Add Kanji Manually</h1>
            <div>
              <label className="p-2" htmlFor="kanjiChar">
                Character
              </label>
              <input
                className="border"
                type="text"
                id="kanjiChar"
                value={kanjiChar}
                onChange={(e) => setKanjiChar(e.target.value)}
              />
            </div>
            <div>
              <label className="p-2" htmlFor="meaning">
                Meaning
              </label>
              <input
                className="border"
                type="text"
                id="meaning"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
              />
            </div>
            <div>
              <h1>Readings</h1>
              <ul>{renderReadings()}</ul>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap" htmlFor="reading">Readings</label>
                <div className="flex">
                  <input
                    className="border rounded px-4 py-2 mr-2 md:mr-4 w-1/3 md:w-1/2 lg:w-2/3"
                    type="text"
                    id="reading"
                    value={readingValue}
                    onChange={handleReadingValueChange}
                  />
                  <select
                    className="border rounded px-4 py-2 mr-2"
                    value={readingType}
                    onChange={handleReadingTypeChange}
                  >
                    <option value="kun">Kun</option>
                    <option value="on">On</option>
                  </select>
                  <Button onClick={handleReadingSubmit}>Add Reading</Button>
                </div>
              </div>
            </div>
            <div className="p-2">
              <Button onClick={handleKanjiSubmit}>Add Kanji</Button>
            </div>
            <div>
              <div className="flex w-full justify-between items-center">
                <h1 className="p-4 font-semibold text-lg">Practice Sentences</h1>
                <button
                  type="button"
                  className="text-blue-500 text-sm"
                  onClick={() => {
                    setLoadingAiSentences(true);
                    generateAISentences();
                  }}
                >
                  Generate with AI
                </button>
                {loadingAiSentences && (
                  <div className="inline-flex items-center">
                    <h1 className="text-sm">
                      Generating AI sentences please wait...
                    </h1>
                    <TbTruckLoading className="animate-spin" />
                  </div>
                )}
              </div>
              <ul>{renderPracticeSentences()}</ul>
            </div>
            <div>
              <label className="p-2" htmlFor="japanese">
                Japanese
              </label>
              <input
                className="border"
                type="text"
                id="japanese"
                value={japanese}
                onChange={(e) => setJapanese(e.target.value)}
              />
              <label className="p-2" htmlFor="english">
                Translation
              </label>
              <input
                className="border m-2"
                type="text"
                id="english"
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
              />
              <Button onClick={handleSentenceSubmit}>Add</Button>
            </div>

            <Button onClick={handleSubmit} disabled={kanjiList.length == 0 || name.trim().length < 1}>
              Create Lesson
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
