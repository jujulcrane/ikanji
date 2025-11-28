# IKanji: A Customizable Kanji Study App

IKanji is a multi-platform application designed to make learning Japanese kanji interactive and efficient. Users can create personalized kanji lessons, specifying the meanings, readings, and practice sentences for the characters they wish to study. The app provides engaging study tools like flashcards and multiple-choice quizzes to reinforce learning.

## Project Structure

This is a monorepo containing both web and mobile applications:

```
ikanji/
├── web/              Next.js web application
├── mobile/           React Native/Expo iOS & Android app
├── data/             Shared data files
└── README.md         This file
```

### Web App (`/web`)
- **Tech Stack**: Next.js, React, TypeScript, Tailwind CSS, Firebase
- **Deployed at**: https://ikanji.vercel.app/
- **Development**: `cd web && npm run dev`

### Mobile App (`/mobile`)
- **Tech Stack**: React Native, Expo, TypeScript, Firebase
- **Platforms**: iOS & Android
- **Development**: `cd mobile && npm start`
- **iOS**: `cd mobile && npm run ios`
- **Android**: `cd mobile && npm run android`

## Key Features

- **Personalized Lessons**: Create custom lessons tailored to your learning needs.
- **Flashcards and Quizzes**: Study your lessons with interactive tools.
- **AI Integration**:
  - **AI-Generated Multiple-Choice Questions**: Dynamically created to test understanding.
  - **AI-Generated Practice Sentences**: Generate tailored sentences for selected kanji, enhancing contextual learning.
- **Pre-Made Lessons**: Users can opt to use existing kanji lessons from _Genki Book 1_ if they prefer not to create their own custom lessons.
- **Cross-Platform**: Available on web, iOS, and Android.

This combination of customization and intelligent features helps users achieve their language-learning goals more effectively, with flexibility to suit their preferred study approach.
