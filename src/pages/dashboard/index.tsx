import Navbar from '@/components/Navbar';

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div>
        <p className="text-center p-8">
          I-漢字へようこそ！ Welcome to I-Kanji!
        </p>
        <p className="text-center ">
          Create custom kanji lessons and study them on the my lessons page.
        </p>
      </div>
    </>
  );
}
