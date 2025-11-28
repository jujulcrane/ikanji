# iKanji - iOS App

A native iOS application for studying Japanese kanji, built with React Native and Expo.

## Features

- **User Authentication**: Sign up and log in with email/password
- **Lesson Management**: Create, view, and delete custom kanji lessons
- **Flashcards**: Study kanji with interactive 3D flip animations
- **Multiple Choice Quiz**: Test your knowledge with quiz mode
- **Offline Support**: Lessons are cached locally for offline access
- **Dark Mode**: Full dark mode support
- **Japanese Typography**: Proper Noto Sans JP font rendering

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **npm**: v9 or higher (comes with Node.js)
- **Xcode**: Latest version (for iOS development on Mac)
- **iOS Simulator**: Installed via Xcode
- **Expo CLI**: Will be installed with dependencies

## Installation

### 1. Clone the Repository

```bash
cd /Users/jujucrane/dev/ikanji
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

#### a. Create a `.env` file

Copy the `.env.example` file and create a new `.env` file:

```bash
cp .env.example .env
```

#### b. Add Firebase Configuration

Open `.env` and add your Firebase project credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**To get your Firebase credentials:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on the gear icon → Project settings
4. Scroll down to "Your apps" section
5. Click on the web app icon `</>`
6. Copy the config values into your `.env` file

#### c. Enable Firebase Services

In the Firebase Console:

1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - (Optional) Enable "Google" for Google Sign-In

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in **test mode** (or set up security rules)
   - Choose a location closest to your users

## Running the App

### Start the Development Server

```bash
npm start
```

This will start the Expo development server and show a QR code.

### Run on iOS Simulator

```bash
npm run ios
```

Or press `i` in the terminal after running `npm start`.

**Note**: The iOS Simulator must be installed via Xcode.

### Run on Android Emulator

```bash
npm run android
```

Or press `a` in the terminal after running `npm start`.

### Run on Web

```bash
npm run web
```

Or press `w` in the terminal after running `npm start`.

## Project Structure

```
frontend/
├── app/                      # App screens
│   ├── auth/                # Authentication screens
│   │   └── login.tsx
│   ├── tabs/                # Tab navigation screens
│   │   ├── index.tsx       # Home/Dashboard
│   │   ├── lessons.tsx     # My Lessons
│   │   └── profile.tsx     # User Profile
│   └── lesson/             # Lesson-related screens
│       ├── create-lesson.tsx
│       ├── flashcards.tsx
│       ├── multiple-choice.tsx
│       └── lesson-detail.tsx
├── components/              # Reusable components
│   ├── ui/                 # UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   ├── layout/            # Layout components
│   │   ├── SafeAreaWrapper.tsx
│   │   └── KeyboardAvoidingWrapper.tsx
│   ├── auth/              # Auth components
│   └── lesson/            # Lesson components
├── navigation/            # Navigation setup
│   ├── RootNavigator.tsx
│   ├── AuthStack.tsx
│   ├── MainStack.tsx
│   └── TabNavigator.tsx
├── services/              # Backend services
│   ├── firebase/
│   │   ├── config.ts     # Firebase initialization
│   │   ├── auth.ts       # Authentication methods
│   │   └── firestore.ts  # Database operations
│   └── storage/
│       └── asyncStorage.ts # Local caching
├── contexts/              # React Context providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/                 # Custom hooks
│   ├── useLessons.ts
│   └── useFlashcards.ts
├── constants/             # App constants
│   ├── Colors.ts
│   ├── Typography.ts
│   └── Layout.ts
├── types/                 # TypeScript types
│   ├── lesson.ts
│   ├── user.ts
│   └── navigation.ts
├── utils/                 # Utility functions
│   └── fonts.ts
├── App.tsx               # Root component
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── .eslintrc.js          # ESLint config
└── .prettierrc           # Prettier config
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS Simulator
- `npm run android` - Run on Android Emulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run lint:fix` - Fix linting issues and format code

## Technologies Used

### Core
- **React Native**: 0.81.5
- **Expo**: ~54.0
- **TypeScript**: ~5.9

### Navigation
- **React Navigation**: ^7.1
  - Native Stack Navigator
  - Bottom Tabs Navigator

### Backend & Data
- **Firebase**: ^12.6
  - Authentication
  - Firestore Database
- **AsyncStorage**: ^1.24 (offline caching)

### UI & Styling
- **React Native Reanimated**: ^4.1 (animations)
- **Expo Google Fonts**: Noto Sans JP
- **Expo Vector Icons**: ^15.0

### Development Tools
- **ESLint**: ^9.39
- **Prettier**: ^3.6
- **TypeScript ESLint**: ^8.48

## Key Features Implementation

### 1. Authentication
- Email/password authentication
- Automatic user document creation in Firestore
- Persistent login state with AsyncStorage

### 2. Lesson Management
- Create lessons with kanji characters
- Each kanji includes: character, meaning, readings (kun/on)
- Delete lessons with confirmation
- Offline caching for all lessons

### 3. Flashcards
- 3D flip animation using React Native Reanimated
- Front: Kanji character
- Back: Meaning and readings
- Previous/Next navigation
- Shuffle functionality
- Progress tracking

### 4. Multiple Choice Quiz
- Dynamic question generation from lesson kanji
- Real-time score tracking
- Immediate feedback (correct/incorrect)
- Color-coded answers (green for correct, red for incorrect)

### 5. Theme System
- Light and dark mode support
- Custom color palette matching web app:
  - Gold: #E0C28C
  - Cream: #EFE5C8
  - Brown Light: #9B8967
  - Brown Dark: #564E40
- Theme preference persisted in AsyncStorage

## Troubleshooting

### Common Issues

#### 1. "Metro bundler error" or "Unable to resolve module"

```bash
# Clear Expo cache
npx expo start -c

# Or delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### 2. "Firebase not initialized"

- Check that your `.env` file exists and has all required variables
- Restart the Expo server after adding environment variables
- Verify Firebase credentials in the Firebase Console

#### 3. "iOS Simulator not opening"

- Open Xcode and go to Xcode → Settings → Locations
- Ensure Command Line Tools is set
- Open Simulator app manually before running `npm run ios`

#### 4. "Fonts not loading"

```bash
# Clear Expo cache
npx expo start -c
```

#### 5. "Type errors in Firebase"

Make sure you have the correct Firebase version installed:

```bash
npm install firebase@^12.6.0
```

### Firestore Security Rules

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Lessons collection - users can only read/write their own lessons
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Development Workflow

### 1. Create a New Feature

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Format and lint your code
npm run lint:fix

# Commit your changes
git commit -m "Add your feature"
```

### 2. Test on iOS Simulator

```bash
npm run ios
```

### 3. Debug

- Use React Native Debugger
- Enable Debug Mode in Expo by pressing `j` in the terminal
- Check logs with `console.log()` statements

## Future Enhancements

- [ ] Google Sign-In integration
- [ ] Vocabulary flashcards
- [ ] Study statistics and analytics
- [ ] Genki lessons integration
- [ ] Public lesson exploration
- [ ] Spaced repetition algorithm
- [ ] Audio pronunciation support
- [ ] Push notifications for study reminders
- [ ] Social features (share lessons)
- [ ] iPad optimization

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is part of the iKanji application suite.

## Support

For issues and questions:
- Check the Troubleshooting section above
- Review the [Expo documentation](https://docs.expo.dev/)
- Check [React Navigation docs](https://reactnavigation.org/)
- Review [Firebase documentation](https://firebase.google.com/docs)

## Credits

- **Japanese Font**: Noto Sans JP by Google Fonts
- **Icons**: Expo Vector Icons (Ionicons)
- **Design**: Based on the iKanji web application

---

Built with ❤️ using React Native and Expo
