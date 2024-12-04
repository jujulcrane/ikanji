import { Lesson } from '@/components/Lesson';
import Navbar from '@/components/Navbar';
import Button from '@/components/button';
import { useLessons } from '@/hooks/use-lessons';
import { auth } from '@/utils/firebase';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { FaRegEdit } from "react-icons/fa";

export default function MyLessons() {
  const fetchedLessons: Lesson[] | null = useLessons();
  const [myLessons, setMyLessons] = useState<Lesson[] | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (fetchedLessons) {
      setMyLessons(fetchedLessons);
      setLoading(false);
    }
  }, [fetchedLessons]);

  console.log('Fetched Lessons:', myLessons);

  const renderNameInput = () => {
    return (
      <>
        <input
          type="text"
          value={newName}
          className="border"
          placeholder="new lesson name"
          onChange={(e) => setNewName(e.target.value)}
        ></input>
      </>
    );
  };

  const changeLessonName = () => {
    console.log('changing lesson name');
    setIsEditing(true);
    console.log('new name: ' + newName);
  };

  const saveLessonName = async () => {
    if (!selectedLesson) return;
    console.log('Saving new name', newName);
    setSelectedLesson({ ...selectedLesson, name: newName });
    setIsEditing(false);

    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('No authenticated user found');
      return;
    }
    //PUT call
    try {
      const idToken = await currentUser.getIdToken();
      console.log('Sending to API:', {
        lessonId: selectedLesson.id,
        newLessonName: newName,
      });

      const res = await fetch('/api/change-lesson-name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          newLessonName: newName,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Error chaning lesson name:', error);
        throw new Error(error.error);
      } else {
        console.log('Lesson name successfuly updated');
      }
    } catch (error) {
      console.error('Error in saveLessonName:', error);
    }
  };

  const handleLearning = (lesson: Lesson, route: string) => {
    if (lesson) {
      router.push({
        pathname: `/dashboard/${route}`,
        query: { lessonId: lesson.id },
      });
    }
  };

  function handleLessonSelect(lessonName: string) {
    if (myLessons) {
      if (selectedLesson && selectedLesson.name === lessonName) {
        setSelectedLesson(null);
      } else {
        const lesson = myLessons.find((lesson) => lesson.name === lessonName);
        setSelectedLesson(lesson || null);
      }
    }
  }

  function renderSelectedLesson(): JSX.Element | null {
    if (!selectedLesson) return null;

    console.log('Rendering Lesson:', selectedLesson);
    return (
      <div className='py-6'>
        <div className="flex items-start space-x-2">
          <h1 className='text-2xl font-semibold'>{selectedLesson.name}</h1>
          <button
            type="button"
            className='opacity-60 hover:opacity-100 transition-opacity'
            onClick={changeLessonName}
          >
            <FaRegEdit />
          </button>
        </div>

        {isEditing && (
          <>
            {renderNameInput()}
            <button
              className="bg-customGold rounded-sm m-2"
              type="button"
              onClick={saveLessonName}
            >
              save
            </button>
            <button
              className="bg-customBrownDark rounded-sm m-2"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              cancel
            </button>
          </>
        )}
        <div className="my-4 pb-2 space-y-2">
          <h3 className='text-lg font-semibold'>Practice</h3>
          <button
            onClick={() => handleLearning(selectedLesson, 'flashcards')}
            className="bg-customGold  w-44 h-20 rounded-md m-2"
            type="button"
          >
            Flash Cards
          </button>
          <button
            onClick={() => handleLearning(selectedLesson, 'multiple-choice')}
            className="bg-customGold  w-44 h-20 rounded-md m-2"
            type="button"
          >
            Multiple Choice
          </button>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedLesson.kanjiList.map((kanji) => (
            <li key={kanji.character} className='border p-4 rounded-lg bg-customCream/50'>
              <div className="flex flex-col items-center space-y-2">
                <h2 className="font-bold text-2xl">{kanji.character}</h2>
                <span className="text-sm">{kanji.meaning}</span>
              </div>
              <div>
                <h2 className="font-medium">Readings</h2>
                <ul>
                  {kanji.readings.map((reading, index) => (
                    <li key={index}>{reading}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-2 p-2 font-medium text-lg">Practice Sentences</h3>
        <ul>
          {selectedLesson.practiceSentences.map((sentence, index) => (
            <li className="border my-8 rounded-sm" key={index}>
              <div className="p-4 md:flex md:justify-between">
                <p className="text-lg">{sentence.japanese}</p>
                <p className="text-sm opacity-40 mt-2 md:ml-4 md:mt-0">{sentence.english}</p>
              </div>
            </li>
          ))}
        </ul>
        <Button onClick={() => handleDeleteClick(selectedLesson)}>
          Delete {selectedLesson.name}
        </Button>
      </div>
    );
  }

  function renderLessonButtons(): JSX.Element | null {
    if (loading) {
      console.log('No lessons loaded yet');
      return <p>Loading...</p>;
    }
    if (!myLessons || myLessons.length === 0) {
      return <p>No Lessons Available</p>;
    }
    return (
      <div className="grid grid-cols-3 gap-2">
        {myLessons.map((lesson) => (
          <Button
            key={lesson.name}
            onClick={() => handleLessonSelect(lesson.name)}
          >
            {lesson.name}
          </Button>
        ))}
      </div>
    );
  }

  const handleDeleteClick = async (lesson: Lesson) => {
    const isConfirmed = window.confirm(
      `Are you sure you want ot delete ${lesson.name}?`
    );
    if (isConfirmed) {
      await deleteLesson(lesson.id);
    }
  };

  const deleteLesson = async (lessonId: string | undefined) => {
    if (!myLessons || !lessonId) return;
    const backupLessons: Lesson[] = [...myLessons];
    const updatedLessons = myLessons.filter((lesson) => lesson.id != lessonId);
    setMyLessons(updatedLessons);

    if (selectedLesson && selectedLesson.id === lessonId) {
      setSelectedLesson(null);
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }
      const token = await user.getIdToken();

      const response = await fetch('/api/delete-lesson', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lessonId }),
      });
      if (!response.ok) {
        const error = await response.json();
        console.error('Error deleting lesson:', error);
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Error in deleteLesson:', error);
      setMyLessons(backupLessons);
      if (selectedLesson && selectedLesson.id === lessonId) {
        setSelectedLesson(
          backupLessons.find((lesson) => lesson.id === lessonId) || null
        );
      }
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="max-w-screen-xl mx-auto p-4 md:w-3/4 lg:w-2/3">
        <h1 className="font-semibold text-lg pb-2">My Lessons</h1>
        {renderLessonButtons()}
        {renderSelectedLesson()}
      </div>
    </>
  );
}
