import { CreateNewLessonForm } from "@/components/CreateLessonForm"
import Navbar from "@/components/Navbar"

export default function createNewLesson() 
{
  return (
    <>
    <Navbar></Navbar>
      <CreateNewLessonForm></CreateNewLessonForm>
    </>
  )
}