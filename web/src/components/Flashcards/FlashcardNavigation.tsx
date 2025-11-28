type Props = {
  currentIndex: number;
  isFinished: boolean;
  goToCard: (index: number) => void;
};

export default function FlashcardNavigation({
  currentIndex,
  isFinished,
  goToCard,
}: Props) {
  return (
    <div
      className="flex justify-evenly w-full mt-4"
      role="navigation"
      aria-label="Flashcard navigation"
    >
      <button
        type="button"
        aria-disabled={currentIndex === 0}
        onClick={() => goToCard(currentIndex - 1)}
        disabled={currentIndex === 0}
        className={`${
          currentIndex === 0
            ? 'bg-gray-200 cursor-not-allowed'
            : 'bg-customCream cursor-pointer'
        } w-44 h-20 rounded-md ml-4`}
      >
        Back
      </button>

      <button
        type="button"
        onClick={() => goToCard(currentIndex + 1)}
        disabled={isFinished}
        aria-disabled={isFinished}
        className={`${
          isFinished
            ? 'bg-gray-200 cursor-not-allowed'
            : 'bg-customCream cursor-pointer'
        } w-44 h-20 rounded-md mr-4`}
      >
        Next
      </button>
    </div>
  );
}
