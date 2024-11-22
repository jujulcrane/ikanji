import Image from "next/image";
import Button from "@/components/button";
import { useEffect, useState } from "react";
import { Profile } from "../api/profile";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Lesson } from "@/components/Lesson";
import { useLessons } from "@/hooks/use-lessons";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  return (
    <>
    <Navbar/>
    <div>
      <p className="text-center p-8">I-漢字へようこそ！ Welcome to I-Kanji!</p>
      <p className="text-center ">Create custom kanji lessons and study them on the my lessons page.</p>
      {/* <div>
        <Button onClick={() => postRequest()}>Add LESSON </Button>
      </div> */}
    </div>
    </>
  );
}
