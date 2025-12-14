import { useState } from 'react';
import { PracticeSentence, Kanji, Reading } from './Lesson';
import { FiDownload, FiUpload } from 'react-icons/fi';

interface ParsedLessonData {
  lessonName: string;
  kanjiList: Kanji[];
  practiceSentences: PracticeSentence[];
}

export function LessonFileUpload({
  onDataParsed,
}: {
  onDataParsed: (data: ParsedLessonData) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Track drag enter/leave events to handle nested elements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dragCounter, setDragCounter] = useState(0);

  const downloadTemplate = () => {
    const template = `LESSON_NAME,My Lesson Name
KANJI
character,meaning,kun-readings,on-readings
水,water,みず,スイ
山,mountain,やま,サン|セン
PRACTICE_SENTENCES
japanese,english
水を飲む,Drink water
山に登る,Climb a mountain`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lesson_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): ParsedLessonData => {
    const lines = text.split('\n').map((line) => line.trim());
    let lessonName = 'Untitled Lesson';
    const kanjiList: Kanji[] = [];
    const practiceSentences: PracticeSentence[] = [];
    let currentSection: 'none' | 'kanji' | 'sentences' = 'none';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines
      if (!line) continue;

      // Check for lesson name
      if (line.startsWith('LESSON_NAME,')) {
        lessonName = line.substring('LESSON_NAME,'.length);
        continue;
      }

      // Check for section headers
      if (line === 'KANJI') {
        currentSection = 'kanji';
        i++; // Skip the header row
        continue;
      }

      if (line === 'PRACTICE_SENTENCES') {
        currentSection = 'sentences';
        i++; // Skip the header row
        continue;
      }

      // Parse based on current section
      if (currentSection === 'kanji') {
        const parts = line.split(',').map((p) => p.trim());
        if (parts.length >= 2) {
          const character = parts[0];
          const meaning = parts[1];
          const kunReadings = parts[2] ? parts[2].split('|').map((r) => r.trim()) : [];
          const onReadings = parts[3] ? parts[3].split('|').map((r) => r.trim()) : [];

          const readings: Reading[] = [
            ...kunReadings.map((value) => ({ value, type: 'kun' as const })),
            ...onReadings.map((value) => ({ value, type: 'on' as const })),
          ];

          if (readings.length > 0) {
            kanjiList.push({ character, meaning, readings });
          }
        }
      } else if (currentSection === 'sentences') {
        const parts = line.split(',');
        if (parts.length >= 2) {
          const japanese = parts[0].trim();
          // Handle English that might contain commas
          const english = parts.slice(1).join(',').trim();
          if (japanese && english) {
            practiceSentences.push({ japanese, english });
          }
        }
      }
    }

    return { lessonName, kanjiList, practiceSentences };
  };

  const processFile = (file: File) => {
    console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
    setFileName(file.name);
    setError(null);
    setSuccessMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        console.log('File read successfully, length:', text?.length);
        console.log('First 200 chars:', text?.substring(0, 200));

        const parsedData = parseCSV(text);
        console.log('Parsed data:', {
          lessonName: parsedData.lessonName,
          kanjiCount: parsedData.kanjiList.length,
          sentencesCount: parsedData.practiceSentences.length
        });

        if (parsedData.practiceSentences.length === 0 && parsedData.kanjiList.length === 0) {
          setError('No valid data found in file. Please check the template format.');
          return;
        }

        console.log('Calling onDataParsed with:', parsedData);
        onDataParsed(parsedData);
        setError(null);

        const itemCount = parsedData.kanjiList.length + parsedData.practiceSentences.length;
        setSuccessMessage(
          `Successfully imported "${parsedData.lessonName}" with ${parsedData.kanjiList.length} kanji and ${parsedData.practiceSentences.length} practice sentences (${itemCount} total items)`
        );
        console.log('Data parsed successfully!');
      } catch (err) {
        console.error('Parse error:', err);
        setError(`Error parsing file: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setSuccessMessage(null);
      }
    };

    reader.onerror = (err) => {
      console.error('FileReader error:', err);
      setError('Error reading file. Please try again.');
      setSuccessMessage(null);
    };

    reader.readAsText(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragging(false);
      }
      return newCounter;
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Set the dropEffect to indicate this is a copy operation
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        processFile(file);
      } else {
        setError('Please upload a CSV or TXT file.');
      }
    }
  };

  return (
    <div className="rounded-lg">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 mb-4 transition-all cursor-pointer
          ${
            isDragging
              ? 'border-customBrownDark bg-customGold/20 scale-[1.02]'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
        `}
      >
        <div className="text-center pointer-events-none">
          <FiUpload
            size={48}
            className={`mx-auto mb-4 ${isDragging ? 'text-customBrownDark animate-bounce' : 'text-gray-400'}`}
          />
          <p className="text-lg font-semibold mb-2">
            {isDragging ? 'Drop your file here' : 'Drag and drop your CSV file here'}
          </p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center pointer-events-auto">
            <button
              type="button"
              onClick={downloadTemplate}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-customGold hover:opacity-80 rounded-md transition-opacity"
            >
              <FiDownload size={20} />
              Download Template
            </button>

            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-customBrownDark text-white hover:opacity-80 rounded-md cursor-pointer transition-opacity">
              <FiUpload size={20} />
              Browse Files
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {fileName && (
        <p className="text-sm text-gray-600 mb-2">
          Selected file: <span className="font-semibold">{fileName}</span>
        </p>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✓ {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          ✗ {error}
        </div>
      )}

      <details className="mt-4">
        <summary className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-gray-900">
          View File Format Instructions
        </summary>
        <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold mb-2">CSV File Format:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>First line: <code className="bg-gray-200 px-1 rounded">LESSON_NAME,Your Lesson Name</code></li>
            <li>Kanji section (optional): <code className="bg-gray-200 px-1 rounded">KANJI</code> header, then character,meaning,kun-readings,on-readings</li>
            <li>Practice sentences: <code className="bg-gray-200 px-1 rounded">PRACTICE_SENTENCES</code> header, then japanese,english</li>
            <li>Use | to separate multiple readings (e.g., <code className="bg-gray-200 px-1 rounded">スイ|サン</code>)</li>
          </ul>
        </div>
      </details>
    </div>
  );
}
