import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/types';
import { TabNavigator } from './TabNavigator';
import CreateLessonScreen from '@/app/lesson/create-lesson';
import FlashcardsScreen from '@/app/lesson/flashcards';
import MultipleChoiceScreen from '@/app/lesson/multiple-choice';
import LessonDetailScreen from '@/app/lesson/lesson-detail';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateLesson"
        component={CreateLessonScreen}
        options={{ title: 'Create Lesson', presentation: 'modal' }}
      />
      <Stack.Screen
        name="Flashcards"
        component={FlashcardsScreen}
        options={{ title: 'Flashcards', presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="MultipleChoice"
        component={MultipleChoiceScreen}
        options={{ title: 'Quiz', presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="LessonDetail"
        component={LessonDetailScreen}
        options={{ title: 'Lesson Details' }}
      />
    </Stack.Navigator>
  );
}
