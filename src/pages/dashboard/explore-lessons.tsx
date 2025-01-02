import { auth } from '@/utils/firebase';
import { getIdToken } from 'firebase/auth';
import { Lesson } from '@/components/Lesson';
import Navbar from '@/components/Navbar';
import { usePublicLessons } from '@/hooks/use-public-lessons';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '@fontsource/noto-sans-jp';
import { TbTruckLoading } from 'react-icons/tb';
import { MdAddShoppingCart } from 'react-icons/md';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { DialogHeader } from '@/components/ui/dialog';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from '@radix-ui/react-dialog';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Input } from '@/components/ui/input';
import { FaSearch } from 'react-icons/fa';
import { useUsers } from '@/hooks/use-users';

export default function ExploreLessons() {
  const router = useRouter();
  const { lessonId } = router.query;

  const fetchedLessons: Lesson[] | null = usePublicLessons();
  const [publicLessons, setPublicLessons] = useState<Lesson[] | null>(null);

  const [userIds, setUserIds] = useState<string[]>([]);
  const { users, loading: loadingUsers } = useUsers(userIds);

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loadingLessons, setLoadingLessons] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmAdd, setConfirmAdd] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLessons: Lesson[] | undefined = publicLessons?.slice(
    startIndex,
    endIndex
  );

  useEffect(() => {
    if (fetchedLessons) {
      setPublicLessons(fetchedLessons);
      setLoadingLessons(false);

      if (lessonId) {
        const lessonToSelect = fetchedLessons.find(
          (lesson) => lesson.id === lessonId
        );
        setSelectedLesson(lessonToSelect || null);
      }
    }
  }, [fetchedLessons, lessonId]);

  useEffect(() => {
    if (paginatedLessons) {
      const newUserIds: string[] = paginatedLessons.map(
        (lesson) => lesson.userId ?? 'no specified user'
      );
      if (JSON.stringify(newUserIds) !== JSON.stringify(userIds)) {
        setUserIds(newUserIds);
      }
    }
  }, [paginatedLessons]);

  const nextPage = () => {
    if (publicLessons)
      if (currentPage < Math.ceil(publicLessons.length / itemsPerPage)) {
        setCurrentPage(currentPage + 1);
      }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const searchBar = () => {
    return (
      <div className="flex justify-center items-center w-full pt-2">
        <div className="flex w-full max-w-sm items-center justify-center space-x-2">
          <FaSearch className="text-white" />
          <Input
            className="text-white placeholder:text-gray-300"
            onChange={(e) => {
              const searchValue = e.target.value;
              if (fetchedLessons && searchValue.trim() !== '') {
                setPublicLessons(
                  fetchedLessons.filter((lesson) =>
                    lesson.name
                      .toLowerCase()
                      .trim()
                      .includes(searchValue.toLowerCase().trim())
                  )
                );
              } else {
                setPublicLessons(fetchedLessons);
              }
            }}
            type="text"
            placeholder="Search lesson name..."
          />
        </div>
      </div>
    );
  };

  const paginator = () => {
    if (publicLessons)
      return (
        <Pagination className="pb-6 text-white">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={prevPage}
                className={
                  currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">{currentPage}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={nextPage}
                className={
                  currentPage * itemsPerPage >= publicLessons?.length
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
  };

  function renderSelectedLesson(index: number): JSX.Element | null {
    if (!selectedLesson) return null;

    console.log('Rendering Lesson:', selectedLesson);
    return (
      <div className="py-6">
        <div className="flex items-start space-x-2">
          <h1 className="text-2xl font-semibold pb-4">{selectedLesson.name}</h1>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedLesson.kanjiList.map((kanji, index) => (
            <li
              key={`${lessonId}-${kanji.character}-${index}`}
              className="relative border p-4 rounded-lg bg-customCream font-sansJP"
            >
              <div className="flex flex-col items-center space-y-2">
                <h2 className="font-bold text-2xl">{kanji.character}</h2>
                <span className="text-sm">{kanji.meaning}</span>
              </div>
              <div>
                <h2 className="font-medium">Readings</h2>
                <ul>
                  {kanji.readings.map((reading, index) => (
                    <li key={`kanji-${reading}-${index}`}>{reading}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <h3 className="mt-2 p-2 font-medium text-lg">Practice Sentences</h3>
        {selectedLesson.practiceSentences.length == 0 ? (
          <h1>No Sentences</h1>
        ) : (
          <ul>
            {selectedLesson.practiceSentences.map((sentence, index) => (
              <li
                className="border my-8 rounded-sm"
                key={`practice-${sentence}-${index}`}
              >
                <div className="p-4 md:flex md:justify-between">
                  <p className="text-lg">{sentence.japanese}</p>
                  <p className="text-sm text-gray-600 mt-2 md:ml-4 md:mt-0">
                    {sentence.english}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button
          key={index}
          className="bg-customCream rounded-sm p-2 my-2 flex justify-center hover:opacity-50 hover:scale-105 absolute bottom-2 right-2"
          onClick={() => {
            setConfirmAdd(index);
          }}
        >
          <MdAddShoppingCart size={24} />
        </button>
      </div>
    );
  }

  function renderLessonButtons(): JSX.Element | null {
    if (loadingLessons || loadingUsers) {
      console.log('No lessons loaded yet');
      return (
        <div className="flex items-center justify-center w-3/4 p-4">
          <p className="min-h-[64vh] text-gray-200">Loading...</p>
        </div>
      );
    }
    if (!publicLessons || publicLessons.length === 0) {
      return (
        <div className="flex items-center justify-center w-3/4 p-4">
          <p className="min-h-[64vh] text-gray-200">No Lessons Available</p>
        </div>
      );
    }
    return (
      <div className="grid gird-cols-1 gap-y-2 items-center justify-center min-h-[67vh] mx-auto md:w-2/3 py-2">
        {paginatedLessons?.map((lesson, index) => (
          <div
            className="border rounded-sm p-4 relative min-w-96 bg-customCream bg-opacity-70"
            key={index}
          >
            <h1 className="font-semibold mr-2">{lesson.name}</h1>
            <p className="text-sm text-gray-600 md:w-4/5 w-3/4">
              {users[index] ? users[index].displayName : 'No associated user'}
            </p>
            <p className="py-1 md:w-4/5 w-3/4">
              {lesson.kanjiList.map((kanji) => kanji.character).join(', ')}
            </p>
            <Dialog
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setSelectedLesson(null);
                }
              }}
            >
              <DialogTrigger
                onClick={() => setSelectedLesson(lesson)}
                className="aboslute left-2"
              >
                {selectedLesson ? (
                  <IoMdEyeOff
                    size={22}
                    className="opacity-60 hover:opacity-100 transition-opacity mr-2"
                  />
                ) : (
                  <IoMdEye
                    size={22}
                    className="opacity-60 hover:opacity-100 transition-opacity mr-2"
                  />
                )}
              </DialogTrigger>
              <DialogContent className="mb-2">
                <DialogHeader>
                  <DialogDescription>
                    <div>{renderSelectedLesson(index)}</div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {!selectedLesson && (
              <button
                key={index}
                className="bg-customCream rounded-sm p-2 my-2 flex justify-center hover:opacity-50 hover:scale-105 absolute bottom-2 right-2"
                onClick={() => {
                  setConfirmAdd(index);
                }}
              >
                <MdAddShoppingCart size={24} />
              </button>
            )}
          </div>
        ))}
      </div>
    );
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

  const handleSuccess = () => {
    setSuccessMessage(null);
  };

  const postRequest = async (lessonToAdd: Lesson) => {
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

    const copiedLesson = {
      ...lessonToAdd,
      id: undefined,
      name: `Copy of ${lessonToAdd.name}`,
      userId: user.uid,
      publishStatus: 'private',
    };

    try {
      const response = await fetch('/api/create-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(copiedLesson),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Backend Error:', error);
        throw new Error(error.error);
      }

      const result = await response.json();
      console.log(result.message);
      setSuccessMessage('Lesson successfully added!');
    } catch (error) {
      console.error('Error sending lesson to backend:', error);
      setSuccessMessage('Failed to add lesson :(');
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="bg-customBrownDark min-h-screen">
        <h1 className="pt-4 text-center font-semibold text-lg pb-2 text-gray-200">
          Explore Lessons
        </h1>
        {loading && displayLoading()}
        {successMessage ? (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md text-center">
              <h2 className="text-xl text-customBrownDark">{successMessage}</h2>
              <button
                onClick={handleSuccess}
                className="mt-4 py-2 px-4 bg-customBrownDark text-white rounded-md hover:bg-customBrownLight"
              >
                OK
              </button>
            </div>
          </div>
        ) : (
          <div>
            {searchBar()}
            {renderLessonButtons()}
            {paginator()}
          </div>
        )}
        <AlertDialog open={confirmAdd != null}>
          <AlertDialogContent className="bg-customBrownLight">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                {confirmAdd !== null && publicLessons && paginatedLessons
                  ? paginatedLessons[confirmAdd]?.name
                    ? `Are you sure you want to add ${paginatedLessons[confirmAdd].name}?`
                    : 'Unknown Lesson'
                  : 'Loading...'}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-white"
                onClick={() => {
                  setConfirmAdd(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="hover:opacity-50"
                onClick={() => {
                  if (paginatedLessons)
                    postRequest(paginatedLessons[confirmAdd!]);
                  setConfirmAdd(null);
                }}
              >
                Add
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
