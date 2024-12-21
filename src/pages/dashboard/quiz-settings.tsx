import { Lesson, MultipleChoiceQuestion } from "@/components/Lesson";
import Navbar from "@/components/Navbar";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

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

    //put changes to firebase
  }

  const addCorrectAnswer = () => {
    if (!editingQuestion) return;
    const updatedQuestion = { ...editingQuestion.question };
    updatedQuestion.correct = [...updatedQuestion.correct, newCorrectAnswer];
    setEditingQuestion({ ...editingQuestion, question: updatedQuestion });
    setNewCorrectAnswer('');
  };

  const deleteAnswer = (answerIndex: number) => {
    if (!lesson || !editingQuestion || editingQuestion.question.correct.length <= 1) return;

    const updatedQuestion = { ...editingQuestion.question };
    updatedQuestion.correct = updatedQuestion.correct.filter((_, index) => index != answerIndex);
    setEditingQuestion({ ...editingQuestion, question: updatedQuestion });
  };

  return (
    <>
      <Navbar />
      <h1 className="text-center text-xl pt-4">Settings for {lesson?.name}</h1>
      <div className="">
        <ul className="md:grid lg:grid-cols-3">
          {lesson?.quizSets?.aiSet?.map((question, index) => (
            <li key={index} className="list-none text-xl m-4 border rounded-sm p-2">
              <Dialog>
                <DialogTrigger onClick={() => editQuestion(question, index)} className="hover:underline"><FaRegEdit className='opacity-60 hover:opacity-100 transition-opacity' /></DialogTrigger>
                <DialogContent className="bg-customCream">
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
                          className="border p-2 rounded mb-2"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm">
                          Correct Answers:
                        </label>
                        {editingQuestion?.question.correct.map((answer, idx) => (
                          <li className="list-none" key={idx}>
                            {answer} <button className="ml-2 text-red-500" onClick={() => deleteAnswer(idx)}><RiDeleteBin5Line size={22} /></button>
                          </li>
                        ))}
                        <input
                          type="text"
                          id="newAnswer"
                          value={newCorrectAnswer}
                          onChange={(e) => setNewCorrectAnswer(e.target.value)}
                          className="border p-2 rounded mb-2"
                        />
                        <button
                          type="button"
                          onClick={addCorrectAnswer}
                          className="bg-customBrownDark text-customCream px-2 py-1 rounded">Add Corect Answer</button>
                      </div>
                    </DialogDescription>
                    <button
                      type="button"
                      onClick={saveQuestion}
                      className="w-full py-2 px-2 font-medium rounded-md bg-customBrownDark text-customCream hover:opacity-50"
                    >
                      Save
                    </button>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              {question.term}
              <ul className="mt-2">
                <h1 className="text-sm">Correct Answer:</h1>
                {question.correct.map((answer, index) => (
                  <li className="text-sm font-normal" key={index}>
                    {answer}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}