import { Lesson, MultipleChoiceQuestion } from "@/components/Lesson";
import Navbar from "@/components/Navbar";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiError } from "react-icons/bi";

export default function QuizSettings() {
  const router = useRouter();
  const { lessonId } = router.query;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<{
    question: MultipleChoiceQuestion;
    index: number;
  } | null>(null);
  const [updatedTerm, setUpdatedTerm] = useState<string>('');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState<string>('');
  const auth = getAuth();

  useEffect(() => {
    if (lessonId) {
      const fetchLesson = async () => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const response = await fetch(`/api/get-lesson?lessonId=${lessonId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log('Fetched lesson data:', data);
        if (data) {
          setLesson(data);
        } else {
          console.error('Lesson not found:', data.error);
        }
      };

      fetchLesson();
    }
  }, [lessonId]);

  const editQuestion = (question: MultipleChoiceQuestion, index: number) => {
    setEditingQuestion({ question, index });
    setUpdatedTerm(question.term);
  };

  const saveQuestion = async () => {
    if (!lesson || !editingQuestion) return;

    const updatedLesson = { ...lesson };
    if (updatedLesson.quizSets?.aiSet) {
      updatedLesson.quizSets.aiSet[editingQuestion.index] = {
        ...editingQuestion.question,
        correct: editingQuestion.question.correct,
        term: updatedTerm,
      };
    }
    setLesson(updatedLesson);
    try {
      const idToken = await auth.currentUser?.getIdToken();

      const res = await fetch('/api/update-lesson', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ lessonId: lessonId, updatedLesson: updatedLesson }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Error chaning lesson:', error);
        throw new Error(error.error);
      } else {
        console.log('Lesson successfuly updated');
        setLesson(updatedLesson);
        setEditingQuestion(null);
      }
    } catch (error) {
      console.error('Error in saveLesson:', error);
    }
  };

  const addCorrectAnswer = () => {
    if (!editingQuestion) return;
    const updatedQuestion = { ...editingQuestion.question };
    updatedQuestion.correct = [...updatedQuestion.correct, newCorrectAnswer];
    setEditingQuestion({ ...editingQuestion, question: updatedQuestion });
    setNewCorrectAnswer('');
  };

  const deleteAnswer = (answerIndex: number) => {
    if (!lesson || !editingQuestion) return;
    if (editingQuestion.question.correct.length <= 1) {
      alert(`Please add at least 1 correct answer before deleting`);
      return;
    }

    const updatedQuestion = { ...editingQuestion.question };
    updatedQuestion.correct = updatedQuestion.correct.filter((_, index) => index != answerIndex);
    setEditingQuestion({ ...editingQuestion, question: updatedQuestion });
  };

  const returnToMult = () => {
    if (!lesson) return;
    router.push({
      pathname: `/dashboard/multiple-choice`,
      query: { lessonId: lesson.id },
    });
  };

  return (
    <>
      <Navbar />
      <div className="bg-customCream">
        {!lesson ? <div className='flex items-center justify-center h-screen'>
          <BiError size={32} className='mr-2' />
          <h1 className=" text-center font-semibold text-2xl"> No Multiple Choice Data Avaliable</h1>
          <BiError size={32} className='ml-2' />
        </div> :
          <div>
            <button onClick={() => returnToMult()} className='lg:absolute lg:left-2 lg:top-35 bg-customGold text-white hover:opacity-50 uppercase text-sm m-2 px-2 py-1 rounded-sm'>Return to multiple choice questions</button>
            <h1 className=" text-center text-xl pt-4 font-semibold">Settings for {lesson?.name}</h1>
            <ul className="md:grid lg:grid-cols-3">
              {lesson?.quizSets?.aiSet?.map((question, index) => (
                <li key={index} className="list-none text-xl m-4 rounded-sm p-3 bg-white">
                  <Dialog>
                    <DialogTrigger onClick={() => editQuestion(question, index)} className="hover:underline"><FaRegEdit className='opacity-60 hover:opacity-100 transition-opacity mr-2' /></DialogTrigger>
                    <DialogContent className="mb-2">
                      <DialogHeader>
                        <DialogTitle>Edit Question</DialogTitle>
                        <DialogDescription>
                          <div className="flex flex-col">
                            <label htmlFor="email" className="text-sm mt-2">
                              Term
                            </label>
                            <input
                              type="text"
                              id="term"
                              value={updatedTerm}
                              onChange={(e) => setUpdatedTerm(e.target.value)}
                              className="m-1 border p-2 rounded mb-2 text-sm"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label htmlFor="password" className="text-sm">
                              Correct Answers:
                            </label>
                            {editingQuestion?.question.correct.map((answer, idx) => (
                              <li className="list-none flex justify-between items-center ml-12" key={idx}>
                                {answer} <button className="mr-2" onClick={() => deleteAnswer(idx)}><RiDeleteBin5Line size={22} /></button>
                              </li>
                            ))}
                            <input
                              type="text"
                              id="newAnswer"
                              value={newCorrectAnswer}
                              onChange={(e) => setNewCorrectAnswer(e.target.value)}
                              className="m-1 border p-2 rounded mb-2 text-sm"
                            />
                            <button
                              type="button"
                              onClick={addCorrectAnswer}
                              className="m-2 bg-customGold text-left text-black text-sm px-2 py-1 rounded w-fit hover:opacity-50">Add Corect Answer</button>
                          </div>
                        </DialogDescription>
                        <button
                          type="button"
                          onClick={saveQuestion}
                          className="w-full py-2 px-2 font-medium rounded-md bg-customBrownDark text-white hover:opacity-50"
                        >
                          Save
                        </button>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog >
                  {question.term}
                  < ul className="mt-2" >
                    <h1 className="text-sm">Correct Answer:</h1>
                    {
                      question.correct.map((answer, index) => (
                        <li className="text-sm font-normal" key={index}>
                          {answer}
                        </li>
                      ))
                    }
                  </ul >
                </li >
              ))
              }
            </ul >
          </div >}
      </div>
    </>
  )
}