import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { IoGameController } from "react-icons/io5";
import { FaBrain } from "react-icons/fa";
import Image from 'next/image';

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="h-screen flex flex-col justify-center items-center pt-0">
        <h1 className="md:text-6xl text-5xl font-bold">I-漢字へようこそ</h1>
        <p className="text-2xl font-semibold text-center pb-8">
          Welcome to I-Kanji!
        </p>
        <div className="bg-customCream py-2 w-3/4 rounded-sm px-4 lg:w-2/3">
          <p className="text-center"><Link href="/dashboard/create-new-lesson" className="hover:underline">
            Master kanji and elevate your studies by creating custom lessons tailored to your learning needs.</Link>
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
      </div>
      <div className="relative flex flex-col justify-center items-center h-screen px-6 mx-auto rounded-sm w-full">
        {/* Background and opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-black bg-opacity-80 rounded-sm"
          style={{
            backgroundImage: "url('/GenkiBg.PNG')",
          }}
        ></div>
        {/* Content */}
        <div className="flex lg:w-2/3">
          <Image
            src="/GenkiBk1Cover.jpg"
            alt="Genki Book 1 Cover"
            width={400}
            height={600}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 30vw, 400px"
            className="z-10 rounded-md shadow-lg"
          />
          <div className="lg:mt-12 lg:mx-10 relative z-10 text-center text-customCream p-6">
            <p className="lg:mb-10 md:text-lg mb-4">
              Are you a Genki student? Take your learning to the next level by adding pre-made Kanji lessons from Genki Book 1. Each lesson includes the exact same kanji covered in the corresponding chapter, allowing you to master the material as you progress through the book. These lessons are designed to enhance your learning experience and help you achieve a deeper understanding of the kanji in context.
            </p>
            <Link
              className="text-white p-2 rounded-sm text-2xl bg-customBrownLight hover:underline"
              href="/dashboard/genki-lessons"
            >
              Add Genki Kanji Lessons
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
