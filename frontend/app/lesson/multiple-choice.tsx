import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { Typography, Layout } from '@/constants';
import { MainStackParamList } from '@/types';

type MultipleChoiceRouteProp = RouteProp<MainStackParamList, 'MultipleChoice'>;

export default function MultipleChoiceScreen() {
  const { colors } = useTheme();
  const route = useRoute<MultipleChoiceRouteProp>();
  const navigation = useNavigation();
  const { lesson } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentKanji = lesson.kanjiList[currentIndex];

  // Generate simple quiz question
  const correctAnswer = currentKanji.meaning;
  const wrongAnswers = lesson.kanjiList
    .filter((_, i) => i !== currentIndex)
    .slice(0, 3)
    .map(k => k.meaning);

  const allAnswers = [correctAnswer, ...wrongAnswers]
    .sort(() => Math.random() - 0.5);
  const correctIndex = allAnswers.indexOf(correctAnswer);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < lesson.kanjiList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      navigation.goBack();
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color={colors.foreground} />
          </TouchableOpacity>
          <Text
            style={[
              styles.score,
              {
                color: colors.foreground,
                fontFamily: Typography.fontFamily.medium,
              },
            ]}
          >
            Score: {score}/{currentIndex + (showResult ? 1 : 0)}
          </Text>
        </View>

        <Card variant="cream" style={styles.questionCard}>
          <Text
            style={[
              styles.question,
              {
                color: colors.foreground,
                fontFamily: Typography.fontFamily.semiBold,
              },
            ]}
          >
            What does this kanji mean?
          </Text>
          <Text
            style={[
              styles.kanji,
              {
                color: colors.customBrownDark,
                fontFamily: Typography.fontFamily.bold,
              },
            ]}
          >
            {currentKanji.character}
          </Text>
        </Card>

        <View style={styles.answers}>
          {allAnswers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.answerButton,
                {
                  backgroundColor:
                    showResult && index === correctIndex
                      ? colors.success
                      : showResult && index === selectedAnswer
                      ? colors.destructive
                      : colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => !showResult && handleAnswer(index)}
              disabled={showResult}
            >
              <Text
                style={[
                  styles.answerText,
                  {
                    color:
                      showResult && (index === correctIndex || index === selectedAnswer)
                        ? '#ffffff'
                        : colors.foreground,
                    fontFamily: Typography.fontFamily.medium,
                  },
                ]}
              >
                {answer}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {showResult && (
          <Button
            title={
              currentIndex < lesson.kanjiList.length - 1
                ? 'Next Question'
                : 'Finish Quiz'
            }
            onPress={handleNext}
            fullWidth
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  score: {
    fontSize: Typography.fontSize.xl,
  },
  questionCard: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  question: {
    fontSize: Typography.fontSize.lg,
    marginBottom: Layout.spacing.md,
  },
  kanji: {
    fontSize: 100,
  },
  answers: {
    flex: 1,
    gap: Layout.spacing.md,
  },
  answerButton: {
    borderWidth: 2,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    alignItems: 'center',
  },
  answerText: {
    fontSize: Typography.fontSize.lg,
  },
});
