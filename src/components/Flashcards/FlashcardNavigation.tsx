type Props = {
  currentIndex: number;
  isFinished: boolean;
  goToCard: (index: number) => void;
};

export default function FlashcardNavigation({ currentIndex, isFinished, goToCard }: Props) {
  return (
    <div className="flex justify-evenly w-full mt-4">
      <button
        onClick={() => goToCard(currentIndex - 1)}
        disabled={currentIndex === 0}
        className={`${currentIndex === 0 ? 'bg-gray-200' : 'bg-customCream'
          } w-44 h-20 rounded-md ml-4 cursor-pointer`}
      >
        Back
      </button>

      <button
        onClick={() => goToCard(currentIndex + 1)}
        disabled={isFinished}
        className={`${isFinished ? 'bg-gray-200' : 'bg-customCream'
          } w-44 h-20 rounded-md mr-4 cursor-pointer`}
      >
        Next
      </button>
    </div>
  );
}
