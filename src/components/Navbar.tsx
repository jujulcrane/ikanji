import Link from "next/link";
import Image from "next/image";
import KanjiLogo from "../../public/I-Kanji_Logo.png";

export default function Navvar() {
  return (
    <>


<nav className="bg-white border-gray-200 dark:bg-gray-900">
    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Image src={KanjiLogo} className="h-11 w-11" alt="I-Kanji Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">I-漢字</span>
        </div>
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <p className="text-sm  text-gray-500 dark:text-white hover:underline">jlc565@cornell.edu</p>
            <Link href="../" className="text-sm  text-blue-600 dark:text-blue-500 hover:underline">Login</Link>
        </div>
    </div>
</nav>
<nav className="bg-gray-50 dark:bg-gray-700">
    <div className="max-w-screen-xl px-4 py-3 mx-auto">
        <div className="flex items-center">
            <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                <li>
                    <Link href="/dashboard" className="text-gray-900 dark:text-white hover:underline" aria-current="page">Home</Link>
                </li>
                <li>
                <Link href="/dashboard/my-lessons" className="text-gray-900 dark:text-white hover:underline" aria-current="page">My Lessons</Link>
                </li>
                <li>
                <Link href="/dashboard/create-new-lesson" className="text-gray-900 dark:text-white hover:underline" aria-current="page">Create New Lesson</Link>
                </li>
            </ul>
        </div>
    </div>
</nav>

    </>
  )
}