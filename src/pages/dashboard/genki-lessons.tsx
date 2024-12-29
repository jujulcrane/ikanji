import { Lesson } from '@/components/Lesson';
import Navbar from '@/components/Navbar';
import { auth } from '@/utils/firebase';
import { getIdToken } from 'firebase/auth';
import { useState } from 'react';
import { TbTruckLoading } from "react-icons/tb";
import { MdAddShoppingCart } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function GenkiLessons() {
  const [addedLesson, setAddedLesson] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmAdd, setConfirmAdd] = useState<number | null>(null);

  const chapter12Lesson: Lesson = {
    name: "Genki Lesson 12",
    kanjiList: [
      { character: "昔", meaning: "Old times", readings: ["むかし"] },
      { character: "々", meaning: "Repetition of a kanji", readings: ['repeat'] },
      { character: "神", meaning: "God", readings: ["かみ", "じん", "しん"] },
      { character: "早", meaning: "Early", readings: ["はや"] },
      { character: "起", meaning: "To get up", readings: ["お", "き"] },
      { character: "牛", meaning: "Cow", readings: ["うし"] },
      { character: "使", meaning: "To use", readings: ["つか"] },
      { character: "働", meaning: "To work", readings: ["はたら", "どう"] },
      { character: "連", meaning: "To link", readings: ["つ", "れん"] },
      { character: "別", meaning: "To separate", readings: ["わか", "べつ"] },
      { character: "度", meaning: "Time; degrees", readings: ["ど"] },
      { character: "赤", meaning: "Red", readings: ["あか"] },
      { character: "青", meaning: "Blue", readings: ["あお"] },
      { character: "色", meaning: "Color", readings: ["いろ", "しょく", "しき"] },
    ],
    practiceSentences: [
      {
        japanese: "昔話を読むのが好きなんです。",
        english: "I like reading old stories."
      },
      {
        japanese: "神社が静かすぎるので、少し怖いです。",
        english: "The shrine is too quiet, so it's a little scary."
      },
      {
        japanese: "今日は早く起きたんですけど、電車が遅れました。",
        english: "I woke up early today, but the train was late."
      },
      {
        japanese: "牛乳を飲みすぎると、お腹が痛くなるんです。",
        english: "If I drink too much milk, my stomach hurts."
      },
      {
        japanese: "この漢字の使い方を教えていただけますか。",
        english: "Could you teach me how to use this kanji?"
      },
      {
        japanese: "毎日働きすぎるので、疲れています。",
        english: "I’m tired because I work too much every day."
      },
      {
        japanese: "友達を連れてきたんですが、ここで待っています。",
        english: "I brought my friend, but they are waiting here."
      },
      {
        japanese: "時間がないので、別の道を使いましょう。",
        english: "Since we don’t have time, let’s use a different route."
      },
      {
        japanese: "今度の旅行はどこに行くんですか。",
        english: "Where are you going on your next trip?"
      },
      {
        japanese: "赤い花が咲きすぎて、庭がとてもきれいです。",
        english: "So many red flowers have bloomed that the garden is very beautiful."
      },
      {
        japanese: "空が青すぎて、写真みたいです。",
        english: "The sky is so blue it looks like a photo."
      },
      {
        japanese: "この色が好きなので、このシャツを買いました。",
        english: "I bought this shirt because I like this color."
      },
    ],
  };

  const chapter11Lesson: Lesson = {
    name: "Genki Lesson 11",
    kanjiList: [
      { character: "手", meaning: "Hand", readings: ["て"] },
      { character: "紙", meaning: "Paper", readings: ["かみ"] },
      { character: "好", meaning: "To like", readings: ["す", "こう"] },
      { character: "近", meaning: "Near", readings: ["ちか", "きん"] },
      { character: "明", meaning: "Bright", readings: ["あか", "めい"] },
      { character: "病", meaning: "Illness", readings: ["びょう"] },
      { character: "院", meaning: "Institution", readings: ["いん"] },
      { character: "映", meaning: "To reflect", readings: ["えい"] },
      { character: "画", meaning: "Picture; Brush-stroke", readings: ["が", "かく"] },
      { character: "歌", meaning: "To sing; Song", readings: ["うた"] },
      { character: "市", meaning: "City; Market", readings: ["し"] },
      { character: "所", meaning: "Place", readings: ["ところ", "しょ"] },
      { character: "勉", meaning: "To study; Exertion", readings: ["べん"] },
      { character: "強", meaning: "Strong", readings: ["つよ", "きょう"] },
      { character: "有", meaning: "To exist; Possess", readings: ["あ", "ゆう"] },
      { character: "旅", meaning: "Travel; Trip", readings: ["たび", "りょ"] },
    ],
    practiceSentences: [
      {
        japanese: "手で紙を折ることがあります。",
        english: "Sometimes I fold paper with my hands.",
      },
      {
        japanese: "私の母は歌が上手ですが、病院で働いています。",
        english: "My mother is good at singing, but she works at a hospital.",
      },
      {
        japanese: "市に新しい映画館ができたので、映画を見たいです。",
        english: "A new movie theater was built in the city, so I want to watch a movie.",
      },
      {
        japanese: "明るいところで勉強するのが好きです。",
        english: "I like studying in a bright place.",
      },
      {
        japanese: "近くの旅館は強い風のため閉まっています。",
        english: "The nearby inn is closed because of strong winds.",
      },
      {
        japanese: "妹は手作りの絵を描きたがっています。",
        english: "My younger sister wants to draw handmade pictures.",
      },
      {
        japanese: "この店には赤いシャツや青いスカートがあります。",
        english: "This store has red shirts and blue skirts.",
      },
      {
        japanese: "彼は強いチームに入りたがっています。",
        english: "He wants to join a strong team.",
      },
      {
        japanese: "友達は市で有名な場所を探しています。",
        english: "My friend is looking for famous places in the city.",
      },
      {
        japanese: "勉強しすぎたので、映画や音楽でリラックスしたいです。",
        english: "I studied too much, so I want to relax with movies or music.",
      },
      {
        japanese: "手紙を書いたり、写真を撮ったりしました。",
        english: "I wrote letters and took photos.",
      },
      {
        japanese: "旅行する前に新しい地図を買いたいです。",
        english: "I want to buy a new map before traveling.",
      },
      {
        japanese: "近所の所は静かですが、たまに犬の声が聞こえます。",
        english: "The neighborhood is quiet, but you can occasionally hear dogs barking.",
      },
      {
        japanese: "子供たちは紙で作った映画のポスターを見たがっています。",
        english: "The children want to see the movie poster made of paper.",
      },
      {
        japanese: "病気のため学校を休むことがあります。",
        english: "Sometimes I take a day off school because of illness.",
      },
    ],
  };

  const chapter10Lesson: Lesson = {
    name: "Genki Book 1 Chapter 10",
    kanjiList: [
      {
        character: "住",
        meaning: "to live",
        strokeOrder: "https://example.com/stroke-order/住",
        readings: ["じゅう", "す"]
      },
      {
        character: "正",
        meaning: "correct; new year",
        strokeOrder: "https://example.com/stroke-order/正",
        readings: ["しょう", "ただ"]
      },
      {
        character: "年",
        meaning: "year",
        strokeOrder: "https://example.com/stroke-order/年",
        readings: ["ねん", "とし"]
      },
      {
        character: "売",
        meaning: "to sell",
        strokeOrder: "https://example.com/stroke-order/売",
        readings: ["ばい", "う"]
      },
      {
        character: "買",
        meaning: "to buy",
        strokeOrder: "https://example.com/stroke-order/買",
        readings: ["ばい", "か"]
      },
      {
        character: "町",
        meaning: "town",
        strokeOrder: "https://example.com/stroke-order/町",
        readings: ["ちょう", "まち"]
      },
      {
        character: "長",
        meaning: "long; chief",
        strokeOrder: "https://example.com/stroke-order/長",
        readings: ["ちょう", "なが"]
      },
      {
        character: "道",
        meaning: "road; way",
        strokeOrder: "https://example.com/stroke-order/道",
        readings: ["どう", "みち"]
      },
      {
        character: "雪",
        meaning: "snow",
        strokeOrder: "https://example.com/stroke-order/雪",
        readings: ["せつ", "ゆき"]
      },
      {
        character: "立",
        meaning: "to stand",
        strokeOrder: "https://example.com/stroke-order/立",
        readings: ["りつ", "た"]
      },
      {
        character: "自",
        meaning: "self",
        strokeOrder: "https://example.com/stroke-order/自",
        readings: ["じ"]
      },
      {
        character: "夜",
        meaning: "night",
        strokeOrder: "https://example.com/stroke-order/夜",
        readings: ["や", "よる", "よ"]
      },
      {
        character: "朝",
        meaning: "morning",
        strokeOrder: "https://example.com/stroke-order/朝",
        readings: ["ちょう", "あさ"]
      },
      {
        character: "持",
        meaning: "to hold; to carry",
        strokeOrder: "https://example.com/stroke-order/持",
        readings: ["じ", "も"]
      }
    ],
    practiceSentences: [
      { japanese: "お父さんとお母さんは、今どこに住んでいる？", english: "Where are your father and mother living now?" },
      { japanese: "来年はどこに住むつもりですか。", english: "Where do you plan to live next year?" },
      { japanese: "友だちは、お正月におもちを二つ食べたと言っていました。", english: "My friend said they ate two rice cakes on New Year's." },
      { japanese: "今年の四月に大学の三年生になりました。", english: "I became a third-year university student this April." },
      { japanese: "新しい年がはじまって、三日になるけど、まだ何もしていない。", english: "Three days into the new year, and I haven't done anything yet." },
      { japanese: "来年の教科書は、まだ売っていないと思うよ。", english: "I think next year's textbooks aren't being sold yet." },
      { japanese: "たけしさんにおみやげを何も買ってこなかった。", english: "I didn't buy any souvenirs for Takeshi." },
      { japanese: "買い物をたくさんしたから、お金がなくなった。", english: "I ran out of money because I shopped a lot." },
      { japanese: "この町は、前はしずかだったけど、大きい大学ができたから、にぎやかな町になりました。", english: "This town used to be quiet, but it became lively because a big university was built." },
      { japanese: "クラスが長くなったから、ミーティングにおそくなった。", english: "I was late to the meeting because the class was extended." },
      { japanese: "道が分からなかったから、知っている人に聞いた。", english: "I didn't know the way, so I asked someone who knew." },
      { japanese: "来年、書道をはじめるつもりだ。", english: "I plan to start calligraphy next year." },
      { japanese: "北海道へは、まだ行っていない。", english: "I haven't been to Hokkaido yet." },
      { japanese: "天気よほうでは、今日は雪がふらないと言っていた。", english: "The weather forecast said it wouldn't snow today." },
      { japanese: "すみませんが、そこに立たないでください。", english: "Excuse me, but please don’t stand there." },
      { japanese: "ドアの前に立っている人を知っていますか。", english: "Do you know the person standing in front of the door?" },
      { japanese: "自分の車は、まだ買っていない。", english: "I haven't bought my own car yet." },
      { japanese: "自転車とバスと、どちらのほうが速いですか。", english: "Which is faster, a bicycle or a bus?" },
      { japanese: "きのうの夜は、どこかへ行った？", english: "Did you go somewhere last night?" },
      { japanese: "今朝は、だれが一番早く大学に来ましたか。", english: "Who came to the university the earliest this morning?" },
      { japanese: "毎朝ジョギングをする人は、いますか。", english: "Is there anyone who jogs every morning?" },
      { japanese: "朝は、一人で食べるけど、夜は、たいていだれかといっしょに食べる。", english: "I usually eat alone in the morning, but at night, I eat with someone." },
      { japanese: "白いシャツは持っているけど、黒いのは持っていない。", english: "I have a white shirt, but I don’t have a black one." },
      { japanese: "ゲームを大学に持ってこないでください。", english: "Please don’t bring games to the university." },
      { japanese: "かさは、持っていかないつもりだ。", english: "I don’t plan to bring an umbrella." }
    ]
  };

  const chapter9Lesson: Lesson = {
    name: "Genki Book 1 Chapter 9",
    kanjiList: [
      { character: "午", meaning: "noon", strokeOrder: "https://example.com/stroke-order/午", readings: ["ご"] },
      { character: "後", meaning: "after; behind", strokeOrder: "https://example.com/stroke-order/後", readings: ["ご", "あと", "うし"] },
      { character: "前", meaning: "before; front", strokeOrder: "https://example.com/stroke-order/前", readings: ["ぜん", "まえ"] },
      { character: "名", meaning: "name", strokeOrder: "https://example.com/stroke-order/名", readings: ["めい", "な"] },
      { character: "白", meaning: "white", strokeOrder: "https://example.com/stroke-order/白", readings: ["はく", "しろ"] },
      { character: "雨", meaning: "rain", strokeOrder: "https://example.com/stroke-order/雨", readings: ["う", "あめ"] },
      { character: "書", meaning: "to write", strokeOrder: "https://example.com/stroke-order/書", readings: ["しょ", "か"] },
      { character: "友", meaning: "friend", strokeOrder: "https://example.com/stroke-order/友", readings: ["ゆう", "とも"] },
      { character: "間", meaning: "interval; between", strokeOrder: "https://example.com/stroke-order/間", readings: ["かん", "あいだ", "ま"] },
      { character: "家", meaning: "house", strokeOrder: "https://example.com/stroke-order/家", readings: ["か", "いえ", "うち"] },
      { character: "話", meaning: "to talk", strokeOrder: "https://example.com/stroke-order/話", readings: ["わ", "はな", "はなし"] },
      { character: "少", meaning: "few; little", strokeOrder: "https://example.com/stroke-order/少", readings: ["しょう", "すく", "すこ"] },
      { character: "古", meaning: "old", strokeOrder: "https://example.com/stroke-order/古", readings: ["こ", "ふる"] },
      { character: "知", meaning: "to know", strokeOrder: "https://example.com/stroke-order/知", readings: ["ち", "し"] },
      { character: "来", meaning: "to come", strokeOrder: "https://example.com/stroke-order/来", readings: ["らい", "く", "き", "こ"] }
    ],
    practiceSentences: [
      { japanese: "あしたの午後四時ごろ、何をしていると思いますか。", english: "What do you think you will be doing around 4 PM tomorrow?" },
      { japanese: "仕事の後で、会社の人とカラオケに行った。", english: "I went to karaoke with my coworkers after work." },
      { japanese: "京子さんは、あの大きい男の人の後ろにいるよ。", english: "Kyoko is behind that big man." },
      { japanese: "マクドナルドは、ホテルの前にあります。", english: "McDonald’s is in front of the hotel." },
      { japanese: "午前中は、コンピュータプログラムを作っていると言っていました。", english: "They said they were writing computer programs in the morning." },
      { japanese: "私の新しいボーイフレンドの名前は、田中さんに言わないでください。", english: "Please don’t tell Mr. Tanaka the name of my new boyfriend." },
      { japanese: "日本では、白い車が人気があります。", english: "White cars are popular in Japan." },
      { japanese: "あの女の人は、髪が白くなかった？", english: "Didn’t that woman have white hair?" },
      { japanese: "山下先生は、日本の有名な大学の先生だ。", english: "Professor Yamashita is a teacher at a famous university in Japan." },
      { japanese: "午前中は、雨がふっていたけど、午後は天気がよかったよ。", english: "It rained in the morning, but the weather was nice in the afternoon." },
      { japanese: "この本は、だれが書いた？", english: "Who wrote this book?" },
      { japanese: "教科書をわすれないでくださいね。", english: "Don’t forget your textbook, okay?" },
      { japanese: "テストの時は、辞書を見ちゃいけないよ。", english: "You can’t look at a dictionary during the test." },
      { japanese: "図書館で新聞を読むのが好きだった。", english: "I liked reading newspapers in the library." },
      { japanese: "メアリーさんは、子どもの時もすごくかわいかった。", english: "Mary was very cute as a child too." },
      { japanese: "日曜日には、友だちに会わなかった。", english: "I didn’t meet my friends on Sunday." },
      { japanese: "病院は、大学とあの白いビルの間にあります。", english: "The hospital is between the university and that white building." },
      { japanese: "かぶきは、十二時から四時半までだから、四時間半ぐらいだと思います。", english: "Kabuki lasts from 12:00 to 4:30, so I think it’s about four and a half hours." },
      { japanese: "山川さんは、小さくて、かわいい家に住んでいる。", english: "Mr. Yamakawa lives in a small and cute house." },
      { japanese: "お休みは、家族に会いに帰ったと言っていました。", english: "They said they went back home to visit their family during the holiday." },
      { japanese: "アルバイトの後で、メアリーさんに会ったけど、何も話さなかった。", english: "I met Mary after my part-time job, but I didn’t say anything." },
      { japanese: "母にかっこいいセーターをもらったが、少し小さかった。", english: "I got a nice sweater from my mother, but it was a little small." },
      { japanese: "こわい話を友だちに話すのが大好きです。", english: "I love telling scary stories to my friends." },
      { japanese: "日本語のクラスでは、毎日会話を覚えなくちゃいけません。", english: "In Japanese class, we have to memorize dialogues every day." },
      { japanese: "この週末、京都へ古くて大きいお寺を見に行かない？", english: "Shall we go see old, big temples in Kyoto this weekend?" },
      { japanese: "白いぼうしをかぶっている女の人を知っていますか。", english: "Do you know the woman wearing the white hat?" },
      { japanese: "歌舞伎に出ている人はみんな男の人だよ。ほんとう？知らなかった！", english: "All the actors in Kabuki are men. Really? I didn’t know that!" },
      { japanese: "アルバイトがあるから、少しおそく来ると言っていました。", english: "They said they’ll come a little late because they have a part-time job." },
      { japanese: "おどるのがあまり上手じゃないから、来ないと思う。", english: "I don’t think they’ll come because they’re not good at dancing." },
      { japanese: "金曜日に高校で会った友だちがイサカへあそびに来ます。", english: "A friend I met in high school on Friday is coming to visit Ithaca." }
    ]
  };

  const chapter8Lesson: Lesson = {
    name: "Genki Book 1 Chapter 8",
    kanjiList: [
      { character: "員", meaning: "member", strokeOrder: "https://example.com/stroke-order/員", readings: ["いん"] },
      { character: "新", meaning: "new", strokeOrder: "https://example.com/stroke-order/新", readings: ["しん", "あたら"] },
      { character: "聞", meaning: "to listen; to ask", strokeOrder: "https://example.com/stroke-order/聞", readings: ["ぶん", "き"] },
      { character: "作", meaning: "to make", strokeOrder: "https://example.com/stroke-order/作", readings: ["さく", "つく"] },
      { character: "仕", meaning: "to serve", strokeOrder: "https://example.com/stroke-order/仕", readings: ["し"] },
      { character: "事", meaning: "thing; matter", strokeOrder: "https://example.com/stroke-order/事", readings: ["じ", "こと"] },
      { character: "電", meaning: "electricity", strokeOrder: "https://example.com/stroke-order/電", readings: ["でん"] },
      { character: "車", meaning: "car", strokeOrder: "https://example.com/stroke-order/車", readings: ["しゃ", "くるま"] },
      { character: "休", meaning: "to rest", strokeOrder: "https://example.com/stroke-order/休", readings: ["きゅう", "やす"] },
      { character: "言", meaning: "to say", strokeOrder: "https://example.com/stroke-order/言", readings: ["げん", "い", "こと"] },
      { character: "読", meaning: "to read", strokeOrder: "https://example.com/stroke-order/読", readings: ["どく", "よ"] },
      { character: "思", meaning: "to think", strokeOrder: "https://example.com/stroke-order/思", readings: ["し", "おも"] },
      { character: "次", meaning: "next", strokeOrder: "https://example.com/stroke-order/次", readings: ["じ", "つぎ"] },
      { character: "何", meaning: "what", strokeOrder: "https://example.com/stroke-order/何", readings: ["か", "なに", "なん"] }
    ],
    practiceSentences: [
      { japanese: "日本の会社員は、よく会社の人とビールを飲みに行きます。", english: "Japanese company employees often go drinking beer with their coworkers." },
      { japanese: "J.K.ローリングの新しい本は、みじかくて、おもしろかったです。", english: "J.K. Rowling's new book was short and interesting." },
      { japanese: "クラッシックは、あまり聞かない。", english: "I don't listen to classical music much." },
      { japanese: "そのニュースは、今日の新聞に出ていましたよ。", english: "That news was in today's newspaper." },
      { japanese: "土曜日にいっしょにケーキを作らない？いいねえ。どんなケーキを作る？", english: "Shall we make a cake together on Saturday? Sounds good! What kind of cake will we make?" },
      { japanese: "お父さんは、どんな仕事をしている？", english: "What kind of work does your father do?" },
      { japanese: "今日は、仕事がたくさんあって、たいへんだね。", english: "You have a lot of work today; it must be tough." },
      { japanese: "となりのへやの電気をつけましょうか。", english: "Shall I turn on the light in the next room?" },
      { japanese: "日曜日に、小さくてかわいい車を見に行くよ。", english: "I’m going to look at a small, cute car on Sunday." },
      { japanese: "電車の中でハンバーガーを食べちゃいけないよ。", english: "You can’t eat hamburgers on the train." },
      { japanese: "金曜日は、だれがアルバイトを休む？私は休まないけど. . .。", english: "Who’s taking Friday off from work? Not me, though..." },
      { japanese: "四月のお休みに、いっしょに何かしない？", english: "Shall we do something together during the April holiday?" },
      { japanese: "おふろにはあまり入らないけど、シャワーは毎日あびると言っていました。", english: "They said they don’t take baths often but shower every day." },
      { japanese: "南さんのお父さんは外国の大学の先生だと言っていました。", english: "Minami’s father said he’s a professor at a foreign university." },
      { japanese: "日本人の会社員は、よく電車の中で新聞を読んでいます。", english: "Japanese company employees often read newspapers on the train." },
      { japanese: "東山さんは、あしたもクラスを休まないと思います。", english: "I don’t think Mr. Higashiyama will skip class tomorrow either." },
      { japanese: "コーネル大学についてどう思いますか。", english: "What do you think about Cornell University?" },
      { japanese: "次の電車は、何時だと思いますか。", english: "What time do you think the next train is?" },
      { japanese: "まず、レタスをあらいます。次に、トマトを切ってください。", english: "First, wash the lettuce. Next, cut the tomato." },
      { japanese: "北山さんに会いましたが、何も話しませんでした。", english: "I met Mr. Kitayama, but we didn’t talk about anything." },
      { japanese: "何をするのがじょうずですか。", english: "What are you good at doing?" },
      { japanese: "コーネル大学に、外国人の学生は、何人ぐらいいますか。", english: "How many foreign students are there at Cornell University?" }
    ]
  };

  const chapter7Lesson: Lesson = {
    name: "Genki Book 1 Chapter 7",
    kanjiList: [
      { character: "京", meaning: "capital", strokeOrder: "https://example.com/stroke-order/京", readings: ["きょう", "けい"] },
      { character: "子", meaning: "child", strokeOrder: "https://example.com/stroke-order/子", readings: ["し", "こ"] },
      { character: "小", meaning: "small", strokeOrder: "https://example.com/stroke-order/小", readings: ["しょう", "ちい"] },
      { character: "会", meaning: "to meet", strokeOrder: "https://example.com/stroke-order/会", readings: ["かい", "あ"] },
      { character: "社", meaning: "company; shrine", strokeOrder: "https://example.com/stroke-order/社", readings: ["しゃ", "じゃ"] },
      { character: "父", meaning: "father", strokeOrder: "https://example.com/stroke-order/父", readings: ["ふ", "ちち", "とう"] },
      { character: "母", meaning: "mother", strokeOrder: "https://example.com/stroke-order/母", readings: ["ぼ", "はは", "かあ"] },
      { character: "高", meaning: "tall; high", strokeOrder: "https://example.com/stroke-order/高", readings: ["こう", "たか"] },
      { character: "校", meaning: "school", strokeOrder: "https://example.com/stroke-order/校", readings: ["こう"] },
      { character: "毎", meaning: "every", strokeOrder: "https://example.com/stroke-order/毎", readings: ["まい"] },
      { character: "語", meaning: "language; word", strokeOrder: "https://example.com/stroke-order/語", readings: ["ご", "かた"] },
      { character: "文", meaning: "sentence; literature", strokeOrder: "https://example.com/stroke-order/文", readings: ["ぶん", "もん"] },
      { character: "帰", meaning: "to return", strokeOrder: "https://example.com/stroke-order/帰", readings: ["き", "かえ"] },
      { character: "入", meaning: "to enter", strokeOrder: "https://example.com/stroke-order/入", readings: ["にゅう", "い", "はい"] }
    ],
    practiceSentences: [
      { japanese: "東京に行って、おいしいラーメンを食べましょう。", english: "Let's go to Tokyo and eat some delicious ramen." },
      { japanese: "私を京都につれていってください。", english: "Please take me to Kyoto." },
      { japanese: "子どもの時には、何をしてはいけませんでしたか。", english: "What were you not allowed to do as a child?" },
      { japanese: "京子さんは、今カフェでコーヒーを飲んでいます。", english: "Kyoko is drinking coffee at a café now." },
      { japanese: "女の子は、たくさんいましたが、男の子は、あまりいませんでした。", english: "There were many girls, but not many boys." },
      { japanese: "ホテルのへやは、きれいでしたが、すごく小さかったです。", english: "The hotel room was clean but very small." },
      { japanese: "メアリーさんは、小さくてかわいいです。", english: "Mary is small and cute." },
      { japanese: "兄は、今ヨーロッパの大学に行っていますから、あまり会いません。", english: "My older brother is at a university in Europe now, so I don’t see him much." },
      { japanese: "ロバートさんの弟さんは、アメリカの会社でサラリーマンをしています。", english: "Robert’s younger brother works as a salaryman at an American company." },
      { japanese: "父は、日本の会社につとめています。", english: "My father works at a Japanese company." },
      { japanese: "お父さんは、めがねをかけていますか。", english: "Does your father wear glasses?" },
      { japanese: "祖父は八十歳ですが、とても元気です。", english: "My grandfather is 80 years old but very energetic." },
      { japanese: "父は、会社に行っていますが、母は、うちにいます。", english: "My father is at work, but my mother is at home." },
      { japanese: "お母さんは、今、どこに住んでいますか。", english: "Where does your mother live now?" },
      { japanese: "祖母に電話をかけて、ちょっと話してもいいですか。", english: "Can I call my grandmother and talk to her for a bit?" },
      { japanese: "スーさんのお父さんは、せが高くて、かっこいいです。", english: "Sue's father is tall and cool." },
      { japanese: "きのうは、学校がありませんでした。日曜日でしたから。", english: "There was no school yesterday because it was Sunday." },
      { japanese: "私は、ニューヨークの高校に行っていました。", english: "I went to high school in New York." },
      { japanese: "高校生の時は、よくジーンズをはいていました。", english: "When I was a high school student, I often wore jeans." },
      { japanese: "毎日、ジョギングをしています。", english: "I jog every day." },
      { japanese: "毎晩うちに帰って、何をしますか。", english: "What do you do when you get home every evening?" },
      { japanese: "日本語は、ちょっとむずかしいですが、すごくおもしろいです。", english: "Japanese is a bit difficult, but very interesting." },
      { japanese: "みち子さんのお母さんは、しんせつで、とてもおもしろい人です。", english: "Michiko’s mother is kind and very interesting." },
      { japanese: "きょねん、日本の大学で、日本文学のクラスをとっていました。", english: "Last year, I took a Japanese literature class at a Japanese university." },
      { japanese: "父は、会社につとめていますが、いそがしいから、毎日、おそく帰ります。", english: "My father works at a company, but he is busy and comes home late every day." },
      { japanese: "高校の時のサークルには、どんな人が入っていましたか。", english: "What kind of people were in your high school club?" },
      { japanese: "お休みは、母のおいしいりょうりを食べに帰ります。", english: "On holidays, I go home to eat my mother’s delicious cooking." }
    ]
  };

  const chapter6Lesson: Lesson = {
    name: "Genki Book 1 Chapter 6",
    kanjiList: [
      { character: "東", meaning: "east", strokeOrder: "https://example.com/stroke-order/東", readings: ["とう", "ひがし"] },
      { character: "西", meaning: "west", strokeOrder: "https://example.com/stroke-order/西", readings: ["せい", "にし"] },
      { character: "南", meaning: "south", strokeOrder: "https://example.com/stroke-order/南", readings: ["なん", "みなみ"] },
      { character: "北", meaning: "north", strokeOrder: "https://example.com/stroke-order/北", readings: ["ほく", "きた"] },
      { character: "口", meaning: "mouth; entrance", strokeOrder: "https://example.com/stroke-order/口", readings: ["こう", "くち"] },
      { character: "出", meaning: "to exit", strokeOrder: "https://example.com/stroke-order/出", readings: ["しゅつ", "で", "だ"] },
      { character: "右", meaning: "right", strokeOrder: "https://example.com/stroke-order/右", readings: ["う", "みぎ"] },
      { character: "左", meaning: "left", strokeOrder: "https://example.com/stroke-order/左", readings: ["さ", "ひだり"] },
      { character: "分", meaning: "minute; to divide", strokeOrder: "https://example.com/stroke-order/分", readings: ["ふん", "ぶん", "ぷん", "わ"] },
      { character: "先", meaning: "ahead", strokeOrder: "https://example.com/stroke-order/先", readings: ["せん", "さき"] },
      { character: "生", meaning: "life; birth", strokeOrder: "https://example.com/stroke-order/生", readings: ["せい", "しょう", "い", "う"] },
      { character: "大", meaning: "big", strokeOrder: "https://example.com/stroke-order/大", readings: ["だい", "たい", "おお"] },
      { character: "学", meaning: "learning", strokeOrder: "https://example.com/stroke-order/学", readings: ["がく", "まな"] },
      { character: "外", meaning: "outside", strokeOrder: "https://example.com/stroke-order/外", readings: ["がい", "そと"] },
      { character: "国", meaning: "country", strokeOrder: "https://example.com/stroke-order/国", readings: ["こく", "くに"] }
    ],
    practiceSentences: [
      { japanese: "アメリカの東には、古い大学がたくさんあります。", english: "In the east of America, there are many old universities." },
      { japanese: "東京は、すごくにぎやかですよ。", english: "Tokyo is very lively!" },
      { japanese: "ロサンゼルスは、東じゃありません。アメリカの西にありますよ。", english: "Los Angeles is not in the east. It's in the west of America." },
      { japanese: "休みは、南の海でおよぎませんか。", english: "Shall we swim in the southern sea during the holiday?" },
      { japanese: "コーネル大学は北にあります。だから、とてもさむいです。", english: "Cornell University is in the north. That’s why it’s very cold." },
      { japanese: "私は南口のレストランのケーキが大好きです。", english: "I love the cakes at the restaurant by the south exit." },
      { japanese: "東口でバスに乗ってください。", english: "Please take the bus at the east exit." },
      { japanese: "南の出口を出てください。", english: "Please exit through the south exit." },
      { japanese: "今日は、右のレストランで食べましょう。", english: "Let’s eat at the restaurant on the right today." },
      { japanese: "すみませんが、左に行ってください。", english: "Excuse me, but please go to the left." },
      { japanese: "映画は九時十分ごろ見ませんか。", english: "Shall we watch the movie around 9:10?" },
      { japanese: "すみません。分かりませんでした。ちょっとゆっくり話してください。", english: "I’m sorry, I didn’t understand. Could you speak a little slower?" },
      { japanese: "先週、東京で友だちとピザを食べました。", english: "Last week, I ate pizza with my friend in Tokyo." },
      { japanese: "山田先生、このジュース、今飲んでもいいですか。", english: "Professor Yamada, may I drink this juice now?" },
      { japanese: "ホテルのへやは、あまり大きくなかったです。", english: "The hotel room wasn’t very big." },
      { japanese: "私は、サーフィンが大きらいです。", english: "I hate surfing." },
      { japanese: "コーネル大学は、すごく大きい大学です。", english: "Cornell University is a very large university." },
      { japanese: "土曜日に、パーティーで、元気な学生に会いました。", english: "On Saturday, I met a lively student at the party." },
      { japanese: "学校にゲームを持ってきてはいけません。", english: "You must not bring games to school." },
      { japanese: "外に行きません。お金がありませんから。", english: "I won’t go outside because I have no money." },
      { japanese: "コーネル大学に外国人の学生はいますか。", english: "Are there any international students at Cornell University?" },
      { japanese: "中国は、どんな食べ物がおいしいですか。", english: "What kind of food is delicious in China?" },
      { japanese: "今晩、韓国語の映画を見てもいいですか。", english: "May I watch a Korean movie tonight?" }
    ]
  };

  const chapter5Lesson: Lesson = {
    name: "Genki Book 1 Chapter 5",
    kanjiList: [
      { character: "山", meaning: "mountain", strokeOrder: "https://example.com/stroke-order/山", readings: ["さん", "やま"] },
      { character: "川", meaning: "river", strokeOrder: "https://example.com/stroke-order/川", readings: ["せん", "かわ"] },
      { character: "元", meaning: "origin", strokeOrder: "https://example.com/stroke-order/元", readings: ["げん", "がん", "もと"] },
      { character: "気", meaning: "spirit; energy", strokeOrder: "https://example.com/stroke-order/気", readings: ["き", "け"] },
      { character: "天", meaning: "heaven", strokeOrder: "https://example.com/stroke-order/天", readings: ["てん"] },
      { character: "私", meaning: "I; private", strokeOrder: "https://example.com/stroke-order/私", readings: ["わたし", "し"] },
      { character: "今", meaning: "now", strokeOrder: "https://example.com/stroke-order/今", readings: ["こん", "いま"] },
      { character: "田", meaning: "rice field", strokeOrder: "https://example.com/stroke-order/田", readings: ["でん", "た"] },
      { character: "女", meaning: "woman", strokeOrder: "https://example.com/stroke-order/女", readings: ["じょ", "おんな"] },
      { character: "男", meaning: "man", strokeOrder: "https://example.com/stroke-order/男", readings: ["だん", "おとこ"] },
      { character: "見", meaning: "to see", strokeOrder: "https://example.com/stroke-order/見", readings: ["けん", "み"] },
      { character: "行", meaning: "to go", strokeOrder: "https://example.com/stroke-order/行", readings: ["こう", "ぎょう", "い"] },
      { character: "食", meaning: "to eat", strokeOrder: "https://example.com/stroke-order/食", readings: ["しょく", "た"] },
      { character: "飲", meaning: "to drink", strokeOrder: "https://example.com/stroke-order/飲", readings: ["いん", "の"] }
    ],
    practiceSentences: [
      { japanese: "山へは、四日に行きましょう。", english: "Let's go to the mountain on the 4th." },
      { japanese: "この川は、水がきれいです。だから魚がたくさんいます。", english: "This river has clean water, so there are many fish." },
      { japanese: "山川さんは、土曜日にもアルバイトをしました。", english: "Yamakawa-san worked part-time on Saturday as well." },
      { japanese: "今日は元気ですね。何時間ぐらいねましたか？", english: "You’re energetic today. How many hours did you sleep?" },
      { japanese: "月曜日は、あまり元気じゃないです。", english: "I’m not very energetic on Mondays." },
      { japanese: "あさっては、天気がいいですか。", english: "Will the weather be good the day after tomorrow?" },
      { japanese: "私はジャズが大好きです。", english: "I love jazz." },
      { japanese: "今、日本は何時ですか。", english: "What time is it in Japan right now?" },
      { japanese: "今日、六時におもしろい映画がありますよ。見ませんか。", english: "There’s an interesting movie at 6 o’clock today. Shall we watch it?" },
      { japanese: "私は、今あまりいそがしくないです。田中さんは？", english: "I’m not very busy right now. How about you, Tanaka-san?" },
      { japanese: "山田さんは、どんなスポーツが好きですか。", english: "Yamada-san, what sports do you like?" },
      { japanese: "高校の先生は、きれいな女の先生でした。", english: "The high school teacher was a beautiful woman." },
      { japanese: "私のボーイフレンドは、かっこいい男の人じゃなかったです。", english: "My boyfriend wasn’t a cool man." },
      { japanese: "その新しい映画は、五日に見ました。", english: "I watched that new movie on the 5th." },
      { japanese: "たのしい旅行でしたか。", english: "Was it an enjoyable trip?" },
      { japanese: "銀行は、モスバーガーのちかくにあります。", english: "The bank is near the Mos Burger." },
      { japanese: "ロバートさんは、日曜日にも、にぎやかなパーティーに行きました。", english: "Robert-san went to a lively party on Sunday as well." },
      { japanese: "パンケーキを三枚食べました。", english: "I ate three pancakes." },
      { japanese: "どんな食べ物がきらいですか。", english: "What kind of food do you dislike?" },
      { japanese: "今日はさむいですねえ。お茶を飲みませんか。", english: "It’s cold today, isn’t it? Would you like some tea?" },
      { japanese: "食べ物はあまり高くなかったですが、飲み物は高かったです。", english: "The food wasn’t very expensive, but the drinks were." }
    ]
  };

  const chapter4Lesson: Lesson = {
    name: "Genki Book 1 Chapter 4",
    kanjiList: [
      { 'character': '日', 'meaning': 'day, sun', 'strokeOrder': '4 strokes', 'readings': ['にち', 'じつ', 'ひ'] },
      { 'character': '本', 'meaning': 'book, origin', 'strokeOrder': '5 strokes', 'readings': ['ほん', 'もと'] },
      { 'character': '人', 'meaning': 'person', 'strokeOrder': '2 strokes', 'readings': ['じん', 'にん', 'ひと'] },
      { 'character': '月', 'meaning': 'month, moon', 'strokeOrder': '4 strokes', 'readings': ['げつ', 'がつ', 'つき'] },
      { 'character': '火', 'meaning': 'fire', 'strokeOrder': '4 strokes', 'readings': ['か', 'ひ'] },
      { 'character': '水', 'meaning': 'water', 'strokeOrder': '4 strokes', 'readings': ['すい', 'みず'] },
      { 'character': '木', 'meaning': 'tree, wood', 'strokeOrder': '4 strokes', 'readings': ['もく', 'ぼく', 'き'] },
      { 'character': '金', 'meaning': 'gold, money', 'strokeOrder': '8 strokes', 'readings': ['きん', 'こん', 'かね'] },
      { 'character': '土', 'meaning': 'earth, soil', 'strokeOrder': '3 strokes', 'readings': ['ど', 'と', 'つち'] },
      { 'character': '曜', 'meaning': 'day of the week', 'strokeOrder': '18 strokes', 'readings': ['よう'] },
      { 'character': '上', 'meaning': 'above, up', 'strokeOrder': '3 strokes', 'readings': ['じょう', 'うえ', 'あがる'] },
      { 'character': '下', 'meaning': 'below, down', 'strokeOrder': '3 strokes', 'readings': ['か', 'げ', 'した', 'さがる'] },
      { 'character': '中', 'meaning': 'middle, inside', 'strokeOrder': '4 strokes', 'readings': ['ちゅう', 'なか'] },
      { 'character': '半', 'meaning': 'half', 'strokeOrder': '5 strokes', 'readings': ['はん', 'なかば'] }
    ],
    practiceSentences: [
      { japanese: "日曜日にアルバイトがあります。", english: "I have a part-time job on Sunday." },
      { japanese: "毎日何時ごろねますか。", english: "What time do you go to bed every day?" },
      { japanese: "この本は一万八千円です。", english: "This book costs 18,000 yen." },
      { japanese: "イサカに日本のレストランはありますか。", english: "Are there any Japanese restaurants in Ithaca?" },
      { japanese: "日本人の友だちはいますか。", english: "Do you have any Japanese friends?" },
      { japanese: "ひるごはんは、たいていうちで一人で食べます。", english: "I usually eat lunch alone at home." },
      { japanese: "コンピューターのクラスは月曜日にありますね？", english: "The computer class is on Monday, right?" },
      { japanese: "火曜日にどこに行きましたか。", english: "Where did you go on Tuesday?" },
      { japanese: "すみません。水をください。", english: "Excuse me. Can I have some water, please?" },
      { japanese: "水曜日には、フランス語のクラスとコンピューターのクラスがありますね。", english: "On Wednesday, you have French class and computer class, right?" },
      { japanese: "火曜日と木曜日に、スーパーへ行きました。", english: "I went to the supermarket on Tuesday and Thursday." },
      { japanese: "金曜日の午後九時ごろ、どこにいましたか。", english: "Where were you around 9 PM on Friday?" },
      { japanese: "オリンピックで金メダルをとりました。", english: "I won a gold medal at the Olympics." },
      { japanese: "土日はたいてい何をしますか。", english: "What do you usually do on weekends?" },
      { japanese: "土曜日にデパートで本とくつを買いました。", english: "I bought a book and shoes at the department store on Saturday." },
      { japanese: "たけしさんは、日曜日にマクドナルドへ来ませんでした。", english: "Takeshi didn't come to McDonald's on Sunday." },
      { japanese: "その本は、あのつくえの上にありますよ。", english: "That book is on top of that desk." },
      { japanese: "ねこは、テーブルの下にいませんか。", english: "Isn't the cat under the table?" },
      { japanese: "八百円のパンを下さい。", english: "Please give me the 800-yen bread." },
      { japanese: "さいふは、いすの下のかばんの中にあります。", english: "The wallet is inside the bag under the chair." },
      { japanese: "プレゼントは中国の T シャツでしたね。", english: "The gift was a Chinese T-shirt, right?" },
      { japanese: "おとといのミーティングは三時半じゃなかったです。", english: "The meeting the day before yesterday wasn't at 3:30." },
      { japanese: "たけしさんをマクドナルドで一時間半ぐらい待ちました。", english: "I waited for Takeshi at McDonald's for about an hour and a half." }
    ]
  };

  const chapter3Lesson: Lesson = {
    name: "Genki Book 1 Chapter 3",
    kanjiList: [
      { character: "一", meaning: "one", strokeOrder: "1 stroke", readings: ["いち", "ひと"] },
      { character: "二", meaning: "two", strokeOrder: "2 strokes", readings: ["に", "ふた"] },
      { character: "三", meaning: "three", strokeOrder: "3 strokes", readings: ["さん", "み"] },
      { character: "四", meaning: "four", strokeOrder: "5 strokes", readings: ["し", "よん"] },
      { character: "五", meaning: "five", strokeOrder: "4 strokes", readings: ["ご", "いつ"] },
      { character: "六", meaning: "six", strokeOrder: "4 strokes", readings: ["ろく", "む"] },
      { character: "七", meaning: "seven", strokeOrder: "2 strokes", readings: ["しち", "なな"] },
      { character: "八", meaning: "eight", strokeOrder: "2 strokes", readings: ["はち", "や"] },
      { character: "九", meaning: "nine", strokeOrder: "2 strokes", readings: ["きゅう", "く", "ここの"] },
      { character: "十", meaning: "ten", strokeOrder: "2 strokes", readings: ["じゅう", "とお"] },
      { character: "百", meaning: "hundred", strokeOrder: "6 strokes", readings: ["ひゃく"] },
      { character: "千", meaning: "thousand", strokeOrder: "3 strokes", readings: ["せん"] },
      { character: "万", meaning: "ten thousand", strokeOrder: "3 strokes", readings: ["まん"] },
      { character: "円", meaning: "yen, circle", strokeOrder: "4 strokes", readings: ["えん"] },
      { character: "時", meaning: "time, hour", strokeOrder: "10 strokes", readings: ["じ", "とき"] }
    ],
    practiceSentences: [
      { japanese: "メアリーさんは、一年生じゃないです。", english: "Mary is not a first-year student." },
      { japanese: "まいばん一分話します。", english: "I talk for one minute every night." },
      { japanese: "シドニーは、いま午前二時です。", english: "It's 2 AM in Sydney now." },
      { japanese: "あした、三時にコーヒーを飲みませんか。", english: "Shall we drink coffee at 3 o'clock tomorrow?" },
      { japanese: "ロバートさんは四年生じゃありませんか。", english: "Isn't Robert a fourth-year student?" },
      { japanese: "きょうは、午後四時半にうちへ帰ります。", english: "Today, I'll go home at 4:30 PM." },
      { japanese: "カルロスさんの妹さんは五さいです。", english: "Carlos's younger sister is five years old." },
      { japanese: "あしたは、あさ六時におきますね。", english: "You'll wake up at 6 AM tomorrow, right?" },
      { japanese: "おとうとさんは七さいですか。", english: "Is your younger brother seven years old?" },
      { japanese: "まいにち午前七時にあさごはんを食べます。", english: "I eat breakfast at 7 AM every day." },
      { japanese: "このイギリスのペンは八百円です。", english: "This British pen is 800 yen." },
      { japanese: "土曜日のあさ九時にテニスをしませんか。", english: "Shall we play tennis at 9 AM on Saturday?" },
      { japanese: "あのえんぴつは、いくらですか。五十円です。", english: "How much is that pencil? It's 50 yen." }
    ]
  };

  const allLessons: Array<Lesson> = [chapter3Lesson, chapter4Lesson, chapter5Lesson, chapter6Lesson, chapter7Lesson, chapter8Lesson, chapter9Lesson, chapter10Lesson, chapter11Lesson, chapter12Lesson];


  const displayLoading = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <h1 className="text-white"> Adding lesson
          <TbTruckLoading className="animate-spin" /> ... </h1>
      </div>
    );
  };

  const handleSuccess = () => {
    setAddedLesson(false);
    setSuccessMessage(null);
  };


  const postRequest = async (lessonToAdd: Lesson) => {
    setLoading(true);
    setAddedLesson(true);
    setSuccessMessage(null);

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
      const response = await fetch('/api/create-lesson', {
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
      setSuccessMessage('Lesson successfully added!');
    } catch (error) {
      console.error('Error sending lesson to backend:', error);
      setSuccessMessage('Failed to add lesson :(');
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar></Navbar>
      <h1 className="my-4 font-bold text-xl text-center"> Add Kanji Lessons from Genki Book 1 to My Lessons</h1>
      {loading && displayLoading()}
      {successMessage ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md text-center">
            <h2 className="text-xl text-customBrownDark">{successMessage}</h2>
            <button
              onClick={handleSuccess}
              className="mt-4 py-2 px-4 bg-customBrownDark text-white rounded-md hover:bg-customBrownLight"
            >
              OK
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 sm:gird-cols-2 gird-cols-1 gap-x-4 gap-y-4 md:gap-y-2 items-center justify-center min-h-screen mx-auto md:w-2/3">
            {allLessons.map((lesson, index) => (
              <div className="border rounded-sm p-4 relative" key={index}>

                <h1 className="font-semibold mr-2">{`Genki Lesson ${index + 3}:`}</h1>
                <p className="pt-1 md:pb-10 md:w-full w-3/4">{lesson.kanjiList.map((kanji) => kanji.character).join(", ")}</p>
                <button
                  key={index}
                  className="bg-customCream rounded-sm p-2 my-2 flex justify-center hover:opacity-50 hover:scale-105 absolute bottom-2 right-2"
                  onClick={() => {
                    setConfirmAdd(index);
                  }}
                  disabled={addedLesson}
                >
                  <MdAddShoppingCart size={24} />
                </button>
              </div>
            ))}
          </div>
          <AlertDialog open={confirmAdd != null}>
            <AlertDialogContent className="bg-customBrownLight">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Are you sure you want to add Genki Lesson {confirmAdd! + 3}?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white" onClick={() => {
                  setConfirmAdd(null);
                }}>Cancel</AlertDialogCancel>
                <AlertDialogAction className="hover:opacity-50" onClick={() => {
                  postRequest(allLessons[confirmAdd!]);
                  setConfirmAdd(null);
                }}>Add</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
