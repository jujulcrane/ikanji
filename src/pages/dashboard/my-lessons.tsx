import { Lesson } from "@/components/Lesson";
import Navbar from "@/components/Navbar";
import Button from "@/components/button";
import { useLessons } from "@/hooks/use-lessons";
import router from "next/router";
import { useEffect, useState } from "react";


export default function myLessons() 
{
  const fetchedLessons: Lesson[] | null = useLessons();
  const [myLessons, setMyLessons] = useState<Lesson[] | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (fetchedLessons) {
      setMyLessons(fetchedLessons);
    }
  }, [fetchedLessons]);

  console.log("Fetched Lessons:", myLessons);

  const handleFlashCards = (lesson: Lesson) => {
    if (lesson)
    {
      router.push({
        pathname: '/dashboard/flashcards',
        query: { lessonId: lesson.id},
      });
    }
  }
  function handleLessonSelect(lessonName: string){
    if (myLessons){
      if (selectedLesson && selectedLesson.name === lessonName) {
        setSelectedLesson(null);
      } else{
      const lesson = myLessons.find((lesson) => lesson.name === lessonName);
      setSelectedLesson(lesson || null);
    }
  }
}

  function renderSelectedLesson(): JSX.Element | null{
      if (!selectedLesson) return null;
      console.log("Rendering Lesson:", selectedLesson);
        return (
          <>
            <h1>{selectedLesson.name}</h1>
            <ul>
              {selectedLesson.kanjiList.map((kanji) => (
                <li key={kanji.character}>
                  <div className="flex justify-center items-center space-x-2">
                    <h2 className="font-medium">{kanji.character}</h2>
                    <span>{kanji.meaning}</span>
                    </div>
                  <div>
                <h2 className = "font-medium">Readings</h2>
                <ul>
                  {kanji.readings.map((reading, index) => (
                      <li key={index}>{reading}</li>
                  ))}
                </ul>
              </div>
                  </li>
              ))}
            </ul>

            <h3 className = "p-2 font-medium">Practice Sentences</h3>
            <ul>
              {selectedLesson.practiceSentences.map((sentence, index) => (
                <li key= {index}>
                  <p>{sentence.japanese}</p> 
                  <p>{sentence.english}</p>
                  <br></br>
                  </li>
              ))}
            </ul>
            <button onClick={() => handleFlashCards(selectedLesson)} className="bg-customGold  w-44 h-20 rounded-md m-2"type="button">Flash Cards</button>
            <Button onClick={() => handleDeleteClick(selectedLesson)}>Delete {selectedLesson.name}</Button>
          </>
        );
  }

  function renderLessonButtons(): JSX.Element | null {
    if (!myLessons){
      console.log("No lessons loaded yet");
      return <p>Loading...</p>;
    }
    if (myLessons.length === 0){
      return <p>No Lessons Available</p>
    }
        return (
          <>
          {myLessons.map((lesson) => (
            <Button key={lesson.name} onClick={() => handleLessonSelect(lesson.name)}>{lesson.name}</Button>
            ))}
          </>
        );
  }

  const handleDeleteClick = async (lesson: Lesson) => {
    const isConfirmed = window.confirm(`Are you sure you want ot delete ${lesson.name}?`);
    if (isConfirmed){
      await deleteLesson(lesson.id);
    }
  }

  const deleteLesson = async (lessonId: string | undefined) => {
    if (!myLessons) return;
    const backupLessons: Lesson[] = [...myLessons];
    const updatedLessons = myLessons.filter((lesson) => lesson.id != lessonId);
    setMyLessons(updatedLessons);
    

    if (selectedLesson && selectedLesson.id === lessonId) {
      setSelectedLesson(null);
    }
    
    try {
      const response = await fetch("/api/delete-lesson", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessonId }),
      });
      if (!response.ok)
      {
        const error = await response.json();
        console.error("Error deleting lesson:", error);
        throw new Error(error.error);
      }
    } catch (error) {
      console.error ("Error in deleteLesson:", error);
      setMyLessons(backupLessons);
    if (selectedLesson && selectedLesson.id === lessonId) {
      setSelectedLesson(backupLessons.find((lesson) => lesson.id === lessonId) || null);
    }
  }
  };


  return (
    <>
    <Navbar></Navbar>
    <div className="max-w-screen-xl mx-auto p-4">
      <div className = "flex justify-center">
      <h1 className = "font-semibold pb-6">My Lessons</h1>
      </div>
      {renderLessonButtons()}
      {renderSelectedLesson()}
      </div>
    </>
  )
}