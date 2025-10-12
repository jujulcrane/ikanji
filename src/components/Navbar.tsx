import Link from 'next/link';
import Image from 'next/image';
import KanjiLogo from '../../public/I-Kanji_Logo.png';
import { useAuth } from './AuthUserProvider';
import { signOut } from '@/utils/firebase';
import { useRouter } from 'next/router';

const AUTHORIZED_USER_ID = 'V7ZOSGug90XpRG09dFPJX9nNZex2';

export default function Navbar() {
  const router = useRouter();

  const { user } = useAuth();
  const isVocabAuthorized = user?.uid === AUTHORIZED_USER_ID;

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Image src={KanjiLogo} className="h-11 w-11" alt="I-Kanji Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              I-漢字
            </span>
          </div>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <p className="text-sm  text-gray-500 dark:text-white hover:underline">
              {user?.displayName ?? 'not signed in'}
            </p>
            <button
              onClick={() => {
                signOut();
                router.push('/');
              }}
              className="text-sm  text-blue-600 dark:text-blue-500 hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>
      <nav className="bg-gray-50 dark:bg-gray-700">
        <div className="max-w-screen-xl px-4 py-3 mx-auto">
          <div className="flex items-center">
            <ul className="flex flex-row flex-wrap font-medium mt-0 space-x-4 md:space-x-8 rtl:space-x-reverse text-sm gap-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-900 dark:text-white hover:underline"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/my-lessons"
                  className="text-gray-900 dark:text-white hover:underline"
                  aria-current="page"
                >
                  My Lessons
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/create-new-lesson"
                  className="text-gray-900 dark:text-white hover:underline"
                  aria-current="page"
                >
                  Create New Lesson
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/genki-lessons"
                  className="text-gray-900 dark:text-white hover:underline"
                  aria-current="page"
                >
                  Add Genki Lessons
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/explore-lessons"
                  className="text-gray-900 dark:text-white hover:underline"
                  aria-current="page"
                >
                  Explore Lessons
                </Link>
              </li>
              <li>
                {isVocabAuthorized ? (
                  <Link
                    href="/dashboard/vocab"
                    className="text-gray-900 dark:text-white hover:underline"
                    aria-current="page"
                  >
                    Vocab (coming-soon)
                  </Link>
                ) : (
                  <span
                    className="text-gray-400 cursor-not-allowed opacity-50"
                    aria-disabled="true"
                  >
                    Vocab (coming-soon)
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
