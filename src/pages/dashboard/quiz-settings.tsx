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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { IoIosAddCircle } from "react-icons/io";
import { TbTruckLoading } from "react-icons/tb";
import { RiAiGenerate } from "react-icons/ri";
import { IoArrowBackCircle } from "react-icons/io5";

export default function QuizSettings() {
  const router = useRouter();
  const { lessonId } = router.query;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loadingNewQuestion, setLoadingNewQuestion] = useState<boolean>();
  const [editingQuestion, setEditingQuestion] = useState<{
    question: MultipleChoiceQuestion;
    index: number;
  } | null>(null);
  const [updatedTerm, setUpdatedTerm] = useState<string>('');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [newOption, setNewOption] = useState<string>('');
  const [newQuestion, setNewQuestion] = useState<MultipleChoiceQuestion>({ term: '', correct: [], false: [] });
  const [newFeedBack, setNewFeedBack] = useState<string>('');
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

  const displayLoading = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <p className="text-white text-lg"> Generating New Question
          <TbTruckLoading className="animate-spin" /> ... </p>
      </div>
    );
  };

  const editQuestion = (question: MultipleChoiceQuestion, index: number) => {
    setEditingQuestion({ question, index });
    setUpdatedTerm(question.term);
    setNewFeedBack(question.feedback ? question.feedback : '');
  };

  const generateAiQuestion = async () => {
    if (!lesson) return;
    setLoadingNewQuestion(true);
    try {
      const res = await fetch('/api/ai-generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kanji: lesson.kanjiList.map((kanji) => kanji.character),
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const aiQuestions: {
        question: string;
        correctAnswer: string;
        incorrectOptions: string[];
        feedback: string;
      }[] = await res.json();

      console.log('Received AI Questions:', aiQuestions);

      const newAiSet: MultipleChoiceQuestion[] = aiQuestions.map(
        (q) => ({
          term: q.question,
          correct: [q.correctAnswer],
          false: q.incorrectOptions,
          feedback: q.feedback,
        })
      );
      const firstQuestion: MultipleChoiceQuestion = newAiSet[0];
      addQuestion(firstQuestion);
      setLoadingNewQuestion(false);
    } catch (error) {
      console.error('Failed to generate AI set:', error);
    }
  };

  const addQuestion = (question: MultipleChoiceQuestion) => {
    if (!lesson) return;

    const updatedLesson = { ...lesson };
    if (updatedLesson.quizSets?.aiSet) {
      updatedLesson.quizSets.aiSet.push(question);
    }
    setLesson(updatedLesson);
    putToFb(updatedLesson);
    setNewQuestion({ term: '', correct: [], false: [] });
    setUpdatedTerm('');
    setNewFeedBack('');
    setNewCorrectAnswer('');
    setNewOption('');
  };

  const putToFb = async (updatedLesson: Lesson) => {
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

  const saveQuestion = async () => {
    if (!lesson || !editingQuestion) return;

    const updatedLesson = { ...lesson };
    if (updatedLesson.quizSets?.aiSet) {
      updatedLesson.quizSets.aiSet[editingQuestion.index] = {
        ...editingQuestion.question,
        correct: editingQuestion.question.correct,
        term: updatedTerm,
        feedback: newFeedBack,
      };
    }
    setLesson(updatedLesson);
    await putToFb(updatedLesson);
  };

  const addAnswer = (type: 'correct' | 'false') => {
    if (!editingQuestion) return;
    const updatedQuestion = { ...editingQuestion.question };
    if (type === 'correct') {
      updatedQuestion.correct = [...updatedQuestion.correct, newCorrectAnswer];
      setEditingQuestion({ ...editingQuestion, question: updatedQuestion });
      setNewCorrectAnswer('');
    } else {
      updatedQuestion.false = [...updatedQuestion.false, newOption];
      setEditingQuestion({ ...editingQuestion, question: updatedQuestion });
      setNewOption('');
    }
  };

  const createAnswers = (type: 'false' | 'correct') => {
    const updatedQuestion: MultipleChoiceQuestion = { ...newQuestion };
    if (type == 'correct') {
      updatedQuestion.correct.push(newCorrectAnswer);
      setNewQuestion(updatedQuestion);
      setNewCorrectAnswer('');
    } else {
      updatedQuestion.false.push(newOption);
      setNewQuestion(updatedQuestion);
      setNewOption('');
    }
  }

  const deleteAnswer = (answerIndex: number, type: 'correct' | 'false') => {
    if (!lesson || !editingQuestion) return;
    const updatedQuestion = { ...editingQuestion.question };
    if (type === 'correct') {
      if (editingQuestion.question.correct.length <= 1) {
        alert(`Please add at least 1 correct answer before deleting`);
        return;
      }
      updatedQuestion.correct = updatedQuestion.correct.filter((_, index) => index != answerIndex);
    } else {
      if (editingQuestion.question.false.length <= 3) {
        alert(`Please add at least 1 more option before deleting`);
        return;
      }
      updatedQuestion.false = updatedQuestion.false.filter((_, index) => index != answerIndex);
    }
    setEditingQuestion({ ...editingQuestion, question: updatedQuestion });
  };

  const deleteNewAnswer = (answerIndex: number, type: 'correct' | 'false') => {
    if (!lesson) return;
    const updatedQuestion: MultipleChoiceQuestion = { ...newQuestion };
    if (type === 'correct') {
      updatedQuestion.correct = updatedQuestion.correct.filter((_, index) => index != answerIndex);
      setNewQuestion(updatedQuestion);
    } else {
      updatedQuestion.false = updatedQuestion.false.filter((_, index) => index != answerIndex);
      setNewQuestion(updatedQuestion);
    }
  };

  const deleteQuestion = async (index: number): Promise<void> => {
    if (!lesson) return;

    const updatedLesson = { ...lesson };
    if (updatedLesson.quizSets?.aiSet) {
      const newAiSet = updatedLesson.quizSets.aiSet.filter((_, i) => i !== index);
      updatedLesson.quizSets.aiSet = newAiSet;
    }

    setLesson(updatedLesson);
    await putToFb(updatedLesson);
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
      <div className="bg-customCream pb-72">
        {!lesson ? <div className='flex items-center justify-center h-screen'>
          <BiError size={32} className='mr-2' />
          <h1 className=" text-center font-semibold text-2xl"> No Multiple Choice Data Avaliable</h1>
          <BiError size={32} className='ml-2' />
        </div> :
          <div>
            {loadingNewQuestion && displayLoading()}
            <button onClick={() => returnToMult()} className='lg:absolute lg:left-4 lg:top-32 bg-blue-400 text-white hover:opacity-50 uppercase text-sm m-2 px-2 py-1 rounded-sm'><div className="flex"><IoArrowBackCircle /><p>Return to multiple choice questions</p></div></button>
            <h1 className=" text-center text-2xl pt-8 font-semibold">Settings for {lesson?.name}</h1>
            <ul className="md:grid lg:grid-cols-3">
              {lesson?.quizSets?.aiSet?.map((question, index) => (
                <li key={index} className="list-none text-xl my-8 mx-6 rounded-sm p-4 bg-white">
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
                                {answer} <button className="mr-2" onClick={() => deleteAnswer(idx, 'correct')}><RiDeleteBin5Line size={22} /></button>
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
                              onClick={() => addAnswer('correct')}
                              className="m-2 bg-customGold text-left text-black text-sm px-2 py-1 rounded w-fit hover:opacity-50">Add Corect Answer</button>
                          </div>
                          <div className="flex flex-col">
                            <label htmlFor="password" className="text-sm">
                              Options:
                            </label>
                            {editingQuestion?.question.false.map((answer, idx) => (
                              <li className="list-none flex justify-between items-center ml-12" key={idx}>
                                {answer} <button className="mr-2" onClick={() => deleteAnswer(idx, 'false')}><RiDeleteBin5Line size={22} /></button>
                              </li>
                            ))}
                            <input
                              type="text"
                              id="newOption"
                              value={newOption}
                              onChange={(e) => setNewOption(e.target.value)}
                              className="m-1 border p-2 rounded mb-2 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => addAnswer('false')}
                              className="m-2 bg-customGold text-left text-black text-sm px-2 py-1 rounded w-fit hover:opacity-50">Add Option</button>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm mt-2">
                              Feedback
                            </label>
                            <input
                              type="text"
                              id="feedback"
                              value={newFeedBack}
                              onChange={(e) => setNewFeedBack(e.target.value)}
                              className="m-1 border p-2 rounded mb-2 text-sm"
                            />
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
                    <h1 className="text-sm">Correct Answer(s):</h1>
                    {
                      question.correct.map((answer, index) => (
                        <li className="text-sm font-normal" key={index}>
                          {answer}
                        </li>
                      ))
                    }
                  </ul >
                  < ul className="mt-2" >
                    <h1 className="text-sm">Options:</h1>
                    {
                      question.false.map((answer, index) => (
                        <li className="text-sm font-normal" key={index}>
                          {answer}
                        </li>
                      ))
                    }
                  </ul >
                  <h1 className="text-sm mt-2">Feedback:</h1>
                  {question.feedback && question.feedback.trim() !== '' ? (
                    <p className="text-sm w-5/6">{question.feedback}</p>
                  ) : (
                    <p className="text-sm italic">None</p>
                  )}
                  <div className="relative">
                    <button onClick={() => setConfirmDelete(index)} className="absolute right-2 bottom-1"><RiDeleteBin5Line size={26} /></button>
                  </div>
                </li >
              ))
              }
            </ul >

            <Dialog onOpenChange={() => {
              setNewCorrectAnswer('');
              setNewOption('');
              setUpdatedTerm('');
              setNewFeedBack('');
              setNewQuestion({ term: '', correct: [], false: [] });
            }}>
              <div className="flex justify-center items-center">
                <button className="hover:opacity-50 mb-4 mx-4 bg-blue-400 text-white p-1 flex rounded-sm" onClick={() => generateAiQuestion()}><p>Generate New Question</p><RiAiGenerate /></button>
                <DialogTrigger className="hover:opacity-50 mb-4 mx-4"><div className="bg-customBrownLight text-white p-1 flex rounded-sm"><p>Add Question</p><IoIosAddCircle />
                </div></DialogTrigger>
              </div>
              <DialogContent className="mb-2 bg-white m-8 p-8 rounded-lg">
                <DialogHeader>
                  <DialogTitle>Create New Question</DialogTitle>
                  <DialogDescription>
                    <div className="flex flex-col">
                      <label className="text-sm mt-2">
                        Question
                        {updatedTerm == '' && (<h1 className='text-red-500'>Please provide a question</h1>)}
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
                      <label className="text-sm">
                        Correct Answers:
                        {newQuestion.correct.length < 1 && (<h1 className='text-red-500'>Please add at least 1</h1>)}
                      </label>
                      {newQuestion.correct.map((answer, idx) => (
                        <li className="list-none flex justify-between items-center ml-12" key={idx}>
                          {answer} <button className="mr-2" onClick={() => deleteNewAnswer(idx, 'correct')}><RiDeleteBin5Line size={22} /></button>
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
                        onClick={() => createAnswers('correct')}
                        className="m-2 bg-customGold text-left text-black text-sm px-2 py-1 rounded w-fit hover:opacity-50">Add Corect Answer</button>
                    </div>
                    <div className="flex flex-col">
                      <label className='text-sm'>
                        Options:
                        {newQuestion.false.length < 3 && (<h1 className='text-red-500'>Please add at least 3</h1>)}
                      </label>
                      {newQuestion.false.map((answer, idx) => (
                        <li className="list-none flex justify-between items-center ml-12" key={idx}>
                          {answer} <button className="mr-2" onClick={() => deleteNewAnswer(idx, 'false')}><RiDeleteBin5Line size={22} /></button>
                        </li>
                      ))}
                      <input
                        type="text"
                        id="newAnswer"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        className="m-1 border p-2 rounded mb-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => createAnswers('false')}
                        className="m-2 bg-customGold text-left text-black text-sm px-2 py-1 rounded w-fit hover:opacity-50">Add Option</button>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm mt-2">
                        Feedback
                      </label>
                      <input
                        type="text"
                        id="feedback"
                        value={newFeedBack}
                        onChange={(e) => setNewFeedBack(e.target.value)}
                        className="m-1 border p-2 rounded mb-2 text-sm"
                      />
                    </div>
                  </DialogDescription>
                  <button
                    type="button"
                    disabled={newQuestion.false.length < 3 || newQuestion.correct.length < 1 || updatedTerm == ''}
                    onClick={() => {
                      const question: MultipleChoiceQuestion = ({ term: updatedTerm, correct: newQuestion.correct, false: newQuestion.false });
                      if (newFeedBack != '') {
                        question.feedback = newFeedBack;
                      }
                      addQuestion(question);
                    }}
                    className="w-full py-2 px-2 font-medium rounded-md bg-customBrownDark text-white hover:opacity-50"
                  >
                    Save
                  </button>
                </DialogHeader>
              </DialogContent>
            </Dialog >
          </div >}
        <AlertDialog open={confirmDelete != null}>
          <AlertDialogContent className="bg-customBrownLight">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Are you sure you want to delete the following question?</AlertDialogTitle>
              <AlertDialogDescription className="text-white">
                {lesson?.quizSets?.aiSet && confirmDelete !== null
                  ? lesson.quizSets.aiSet[confirmDelete]?.term || "Unknown term"
                  : "No term available"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white" onClick={() => {
                setConfirmDelete(null);
              }}>Cancel</AlertDialogCancel>
              <AlertDialogAction className="hover:opacity-50"
                onClick={async () => {
                  if (confirmDelete !== null) {
                    await deleteQuestion(confirmDelete);
                    setConfirmDelete(null);
                  }
                }}>
                Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}