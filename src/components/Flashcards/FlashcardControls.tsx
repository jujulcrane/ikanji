import { IoArrowBackOutline } from 'react-icons/io5';
import { FaShuffle } from 'react-icons/fa6';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/router';
import { Lesson } from '@/components/Lesson';

type Props = {
  lesson: Lesson;
  isPracticeMode: boolean;
  isMeaningChecked: boolean;
  isReadingsChecked: boolean;
  setIsPracticeMode: (value: boolean) => void;
  setIsMeaningChecked: (value: boolean) => void;
  setIsReadingsChecked: (value: boolean) => void;
  shuffle: () => void;
};

export default function FlashcardControls({
  lesson,
  isPracticeMode,
  isMeaningChecked,
  isReadingsChecked,
  setIsMeaningChecked,
  setIsReadingsChecked,
  setIsPracticeMode,
  shuffle,
}: Props) {
  const router = useRouter();

  const togglePracticeMode = (): void => {
    const newMode = !isPracticeMode;
    setIsPracticeMode(newMode);
    if (newMode) {
      setIsMeaningChecked(false);
      setIsReadingsChecked(false);
    } else {
      setIsMeaningChecked(true);
      setIsReadingsChecked(true);
    }
  }

  return (
    <div className="mt-8 flex justify-center items-center">
      <div className="flex items-center space-x-2 m-2">
        <button
          type="button"
          className="bg-blue-400 text-white rounded-sm p-1 px-2 text-sm mr-2 hover:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={() =>
            router.push({
              pathname: `/dashboard/my-lessons`,
              query: { lessonId: lesson.id },
            })
          }
          aria-label="Return to lessons dashboard"
        >
          <IoArrowBackOutline size={22} />
        </button>

        <Checkbox
          id="meaning"
          checked={isMeaningChecked}
          onCheckedChange={() => {
            setIsMeaningChecked(!isMeaningChecked);
            if (isPracticeMode) setIsPracticeMode(false);
          }}
        />
        <label htmlFor="meaning" className="text-sm font-medium">
          Meaning
        </label>

        <Checkbox
          id="readings"
          checked={isReadingsChecked}
          onCheckedChange={() => {
            setIsReadingsChecked(!isReadingsChecked);
            if (isPracticeMode) setIsPracticeMode(false);
          }}
        />
        <label htmlFor="readings" className="text-sm font-medium">
          Readings
        </label>

        <button
          type="button"
          className="rounded-sm p-1 px-2 text-sm bg-customCream hover:opacity-70 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          disabled={lesson.practiceSentences.length < 1}
          onClick={togglePracticeMode}
          aria-disabled={lesson.practiceSentences.length < 1}
        >
          Practice Sentences
        </button>
      </div>

      <button
        type="button"
        className="rounded-sm p-1 px-2 text-sm bg-black text-white hover:opacity-70 cursor-pointer"
        onClick={shuffle}
        aria-label="Shuffle flashcards"
      >
        <FaShuffle size={22} />
      </button>
    </div>
  );
}
