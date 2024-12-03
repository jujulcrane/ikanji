import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="">
        <p className="text-center p-8">
          I-漢字へようこそ！ Welcome to I-Kanji!
        </p>
        <p className="text-center">
          Create custom kanji lessons and study them on the my lessons page.
        </p>
        <div className="my-10 flex justify-center">
          <Link className="p-2 rounded-sm text-2xl bg-customGold" href="/dashboard/genki-lessons">Add Genki Kanji Lessons</Link>
        </div>
      </div>
    </>
  );
}
