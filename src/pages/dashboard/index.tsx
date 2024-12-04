import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { IoGameController } from "react-icons/io5";
import { FaBrain } from "react-icons/fa";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="h-screen flex flex-col justify-center items-center pt-0">
        <p className="text-2xl font-semibold text-center pb-8">
          I-漢字へようこそ！ Welcome to I-Kanji!
        </p>
        <div className="bg-customCream py-2 w-3/4 rounded-sm px-4 lg:w-1/2">
          <p className="text-center"><Link href="/dashboard/create-new-lesson" className="hover:underline">
            Create custom kanji lessons and study them on the my lessons page.</Link>
          </p>
          <ul className="flex justify-center items-center gap-8 mt-4">
            <li className="flex items-center gap-2"><FaBrain /><Link href="/dashboard/my-lessons" className="hover:underline">
              Study With Flash Cards
            </Link></li>
            <li className="flex items-center gap-2"><IoGameController /><Link href="/dashboard/my-lessons" className="hover:underline">
              Practice With Multiple Choice
            </Link></li>
          </ul>
        </div>
        <div className="bg-customBrownDark  mt-20 my-6 w-3/4 text-center mb-10 py-2 rounded-sm lg:w-1/2">
          <p className="mb-4 text-customCream p-4">
            Are you a Genki student? Take your learning to the next level by adding pre-made Kanji lessons from Genki Book 1. Each lesson includes the exact same kanji covered in the corresponding chapter, allowing you to master the material as you progress through the book. These lessons are designed to enhance your learning experience and help you achieve a deeper understanding of the kanji in context.          </p>
          <Link
            className="text-white p-2 rounded-sm text-2xl bg-customBrownLight hover:underline"
            href="/dashboard/genki-lessons"
          >
            Add Genki Kanji Lessons
          </Link>
        </div>
      </div>
    </>
  );
}
