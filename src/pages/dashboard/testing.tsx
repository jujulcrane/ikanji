import Link from 'next/link';
import { Lesson } from '@/components/Lesson';
import Button from '@/components/button';
import Navbar from '@/components/Navbar';
import { auth } from '@/utils/firebase';
import { getIdToken } from 'firebase/auth';

export default function Dashboard() {
  const lesson9: Lesson = {
    name: 'Lesson 9',
    kanjiList: [
      {
        character: '午',
        meaning: 'noon',
        strokeOrder: 'someurl',
        readings: ['ご'],
      },
      {
        character: '後',
        meaning: 'after',
        strokeOrder: 'someurl',
        readings: ['ご', 'こう'],
      },
      {
        character: '前',
        meaning: 'before',
        strokeOrder: 'someurl',
        readings: ['ぜん', 'まえ'],
      },
      {
        character: '名',
        meaning: 'name',
        strokeOrder: 'someurl',
        readings: ['めい', 'な'],
      },
      {
        character: '白',
        meaning: 'white',
        strokeOrder: 'someurl',
        readings: ['しろ', 'はく'],
      },
      {
        character: '雨',
        meaning: 'rain',
        strokeOrder: 'someurl',
        readings: ['あめ', 'う'],
      },
      {
        character: '書',
        meaning: 'to write',
        strokeOrder: 'someurl',
        readings: ['しょ', 'か'],
      },
      {
        character: '友',
        meaning: 'friend',
        strokeOrder: 'someurl',
        readings: ['とも', 'ゆう'],
      },
      {
        character: '間',
        meaning: 'between',
        strokeOrder: 'someurl',
        readings: ['あいだ', 'かん'],
      },
      {
        character: '家',
        meaning: 'house',
        strokeOrder: 'someurl',
        readings: ['いえ', 'か'],
      },
      {
        character: '話',
        meaning: 'to talk',
        strokeOrder: 'someurl',
        readings: ['はなし', 'わ'],
      },
      {
        character: '少',
        meaning: 'few',
        strokeOrder: 'someurl',
        readings: ['しょう', 'すこ'],
      },
      {
        character: '古',
        meaning: 'old',
        strokeOrder: 'someurl',
        readings: ['ふる', 'こ'],
      },
      {
        character: '知',
        meaning: 'to know',
        strokeOrder: 'someurl',
        readings: ['し', 'しる'],
      },
      {
        character: '来',
        meaning: 'to come',
        strokeOrder: 'someurl',
        readings: ['らい', 'く'],
      },
    ],
    practiceSentences: [
      {
        japanese: '午前9時に学校に行きます。',
        english: 'I go to school at 9 AM.',
      },
      {
        japanese: '午後に友達と遊びます。',
        english: 'I play with my friends in the afternoon.',
      },
      {
        japanese: '前に行ったことがありますか？',
        english: 'Have you been there before?',
      },
      { japanese: '名前は何ですか？', english: 'What is your name?' },
      {
        japanese: '彼の白いシャツは綺麗です。',
        english: 'His white shirt is clean.',
      },
      { japanese: '雨が降っています。', english: 'It is raining.' },
      {
        japanese: '毎日、日記を書きます。',
        english: 'I write in my diary every day.',
      },
      {
        japanese: '友達と一緒に映画を見ます。',
        english: 'I watch a movie with my friend.',
      },
      {
        japanese: '図書館と家の間に公園があります。',
        english: 'There is a park between the library and my house.',
      },
      { japanese: '私の家は大きいです。', english: 'My house is big.' },
      { japanese: 'この店で話をしました。', english: 'I talked at this shop.' },
      { japanese: '少しだけ食べました。', english: 'I ate just a little.' },
      {
        japanese: '古い本を読んでいます。',
        english: 'I am reading an old book.',
      },
      {
        japanese: '彼はそのことを知っています。',
        english: 'He knows about that.',
      },
      { japanese: '明日、彼が来ます。', english: 'He will come tomorrow.' },
    ],
  };

  // const testLesson1: Lesson = {
  //   name: 'Test Lesson',
  //   kanjiList: [
  //     {
  //       character: '新',
  //       meaning: 'new',
  //       strokeOrder: 'https://example.com/stroke-order/shin',
  //       readings: ['しん', 'あたらしい'],
  //     },
  //     {
  //       character: '員',
  //       meaning: 'member',
  //       strokeOrder: 'https://example.com/stroke-order/in',
  //       readings: ['いん'],
  //     },
  //     {
  //       character: '聞',
  //       meaning: 'listen/hear',
  //       strokeOrder: 'https://example.com/stroke-order/mon',
  //       readings: ['ぶん', 'きく'],
  //     },
  //     {
  //       character: '作',
  //       meaning: 'make',
  //       strokeOrder: 'https://example.com/stroke-order/saku',
  //       readings: ['さく', 'つくる'],
  //     },
  //     {
  //       character: '仕',
  //       meaning: 'serve',
  //       strokeOrder: 'https://example.com/stroke-order/shi',
  //       readings: ['し', 'つかえる'],
  //     },
  //     {
  //       character: '事',
  //       meaning: 'thing/matter',
  //       strokeOrder: 'https://example.com/stroke-order/ji',
  //       readings: ['じ', 'こと'],
  //     },
  //     {
  //       character: '電',
  //       meaning: 'electricity',
  //       strokeOrder: 'https://example.com/stroke-order/den',
  //       readings: ['でん'],
  //     },
  //     {
  //       character: '車',
  //       meaning: 'car',
  //       strokeOrder: 'https://example.com/stroke-order/sha',
  //       readings: ['しゃ', 'くるま'],
  //     },
  //     {
  //       character: '休',
  //       meaning: 'rest',
  //       strokeOrder: 'https://example.com/stroke-order/kyuu',
  //       readings: ['きゅう', 'やすむ'],
  //     },
  //     {
  //       character: '言',
  //       meaning: 'say',
  //       strokeOrder: 'https://example.com/stroke-order/gen',
  //       readings: ['げん', 'いう'],
  //     },
  //     {
  //       character: '読',
  //       meaning: 'read',
  //       strokeOrder: 'https://example.com/stroke-order/doku',
  //       readings: ['どく', 'よむ'],
  //     },
  //     {
  //       character: '思',
  //       meaning: 'think',
  //       strokeOrder: 'https://example.com/stroke-order/shi',
  //       readings: ['し', 'おもう'],
  //     },
  //     {
  //       character: '次',
  //       meaning: 'next',
  //       strokeOrder: 'https://example.com/stroke-order/ji',
  //       readings: ['じ', 'つぎ'],
  //     },
  //     {
  //       character: '何',
  //       meaning: 'what',
  //       strokeOrder: 'https://example.com/stroke-order/nani',
  //       readings: ['なに', 'なん'],
  //     },
  //   ],
  //   practiceSentences: [
  //     {
  //       japanese: '新しい車を作ります。',
  //       english: 'I will make a new car.',
  //     },
  //     {
  //       japanese: '会社の員は仕事をします。',
  //       english: 'The company member works.',
  //     },
  //     {
  //       japanese: '新聞を読んでください。',
  //       english: 'Please read the newspaper.',
  //     },
  //     {
  //       japanese: '今日は休みです。',
  //       english: 'Today is a day off.',
  //     },
  //     {
  //       japanese: '次の電車は何時ですか。',
  //       english: 'What time is the next train?',
  //     },
  //     {
  //       japanese: '何を思っていますか。',
  //       english: 'What are you thinking about?',
  //     },
  //     {
  //       japanese: '彼の言うことを聞きます。',
  //       english: 'I will listen to what he says.',
  //     },
  //   ],
  // };

  //for testing purposes
  const postRequest = async (lessonToAdd: Lesson) => {
    const user = auth.currentUser;

    if (!user) {
      console.error('User not authenticated');
      return;
    } else {
      console.log('Authenticated user UID:', user.uid);
    }

    const token = await getIdToken(user);

    lessonToAdd = { ...lessonToAdd, userId: user.uid };
    try {
      const response = await fetch('/api/update-lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lessonToAdd),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Backend Error:', error);
        throw new Error(error.error);
      }

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error sending lesson to backend:', error);
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <ul>
        <li>
          <Link href="/dashboard/create-new-lesson">Create new lesson</Link>
        </li>
        <li>
          <Link href="/dashboard/my-lessons">My Lessons</Link>
        </li>
      </ul>
      {
        <div>
          <Button onClick={() => postRequest(lesson9)}>ADD TEST LESSON </Button>
        </div>
      }
    </div>
  );
}
