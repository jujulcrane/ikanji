import { NavigatorScreenParams } from '@react-navigation/native';
import { Lesson } from './lesson';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
  CreateLesson: undefined;
  Flashcards: { lessonId: string; lesson: Lesson };
  MultipleChoice: { lessonId: string; lesson: Lesson };
  LessonDetail: { lessonId: string };
};

export type TabsParamList = {
  Home: undefined;
  Lessons: undefined;
  Profile: undefined;
};
