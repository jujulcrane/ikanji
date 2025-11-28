import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { KeyboardAvoidingWrapper } from '@/components/layout/KeyboardAvoidingWrapper';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLessons } from '@/hooks/useLessons';
import { Typography, Layout } from '@/constants';
import { Kanji } from '@/types';

export default function CreateLessonScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { createLesson } = useLessons();

  const [lessonName, setLessonName] = useState('');
  const [character, setCharacter] = useState('');
  const [meaning, setMeaning] = useState('');
  const [reading, setReading] = useState('');
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddKanji = () => {
    if (!character || !meaning || !reading) {
      Alert.alert('Error', 'Please fill in all kanji fields');
      return;
    }

    const newKanji: Kanji = {
      character,
      meaning,
      readings: [{ value: reading, type: 'kun' }],
    };

    setKanjiList(prev => [...prev, newKanji]);
    setCharacter('');
    setMeaning('');
    setReading('');
    Alert.alert('Success', 'Kanji added!');
  };

  const handleCreateLesson = async () => {
    if (!lessonName.trim()) {
      Alert.alert('Error', 'Please enter a lesson name');
      return;
    }

    if (kanjiList.length === 0) {
      Alert.alert('Error', 'Please add at least one kanji');
      return;
    }

    try {
      setLoading(true);
      const lessonId = await createLesson({
        name: lessonName,
        kanjiList,
        practiceSentences: [],
        publishStatus: 'private',
      });

      if (lessonId) {
        Alert.alert('Success', 'Lesson created!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingWrapper>
        <ScrollView style={{ backgroundColor: colors.background }}>
          <View style={styles.container}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.foreground,
                  fontFamily: Typography.fontFamily.bold,
                },
              ]}
            >
              Create New Lesson
            </Text>

            <Card style={styles.card}>
              <Input
                label="Lesson Name"
                value={lessonName}
                onChangeText={setLessonName}
                placeholder="My Kanji Lesson"
              />

              <Text
                style={[
                  styles.kanjiCount,
                  {
                    color: colors.textSecondary,
                    fontFamily: Typography.fontFamily.regular,
                  },
                ]}
              >
                {kanjiList.length} kanji added
              </Text>
            </Card>

            <Card style={styles.card}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.foreground,
                    fontFamily: Typography.fontFamily.semiBold,
                  },
                ]}
              >
                Add Kanji
              </Text>

              <Input
                label="Kanji Character"
                value={character}
                onChangeText={setCharacter}
                placeholder="漢"
                maxLength={1}
              />

              <Input
                label="Meaning"
                value={meaning}
                onChangeText={setMeaning}
                placeholder="Chinese character"
              />

              <Input
                label="Reading"
                value={reading}
                onChangeText={setReading}
                placeholder="かん"
              />

              <Button
                title="Add Kanji"
                variant="secondary"
                onPress={handleAddKanji}
                fullWidth
              />
            </Card>

            <Button
              title="Create Lesson"
              onPress={handleCreateLesson}
              loading={loading}
              fullWidth
              style={styles.createButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    marginBottom: Layout.spacing.lg,
  },
  card: {
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    marginBottom: Layout.spacing.md,
  },
  kanjiCount: {
    fontSize: Typography.fontSize.sm,
  },
  createButton: {
    marginBottom: Layout.spacing.xl,
  },
});
