import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLessons } from '@/hooks/useLessons';
import { Typography, Layout } from '@/constants';
import { Lesson, MainStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function LessonsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { lessons, loading, deleteLesson } = useLessons();

  const handleDeleteLesson = (lessonId: string, lessonName: string) => {
    Alert.alert(
      'Delete Lesson',
      `Are you sure you want to delete "${lessonName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteLesson(lessonId);
            if (success) {
              Alert.alert('Success', 'Lesson deleted successfully');
            }
          },
        },
      ]
    );
  };

  const renderLesson = ({ item }: { item: Lesson }) => (
    <Card style={styles.lessonCard}>
      <View style={styles.lessonHeader}>
        <Text
          style={[
            styles.lessonName,
            {
              color: colors.foreground,
              fontFamily: Typography.fontFamily.semiBold,
            },
          ]}
        >
          {item.name}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteLesson(item.id!, item.name)}
        >
          <Ionicons name="trash" size={20} color={colors.destructive} />
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.kanjiCount,
          {
            color: colors.textSecondary,
            fontFamily: Typography.fontFamily.regular,
          },
        ]}
      >
        {item.kanjiList.length} kanji
      </Text>

      <View style={styles.actions}>
        <Button
          title="Flashcards"
          variant="secondary"
          size="sm"
          onPress={() =>
            navigation.navigate('Flashcards', {
              lessonId: item.id!,
              lesson: item,
            })
          }
          style={styles.actionButton}
        />
        <Button
          title="Quiz"
          variant="secondary"
          size="sm"
          onPress={() =>
            navigation.navigate('MultipleChoice', {
              lessonId: item.id!,
              lesson: item,
            })
          }
          style={styles.actionButton}
        />
      </View>
    </Card>
  );

  if (loading) {
    return <LoadingSpinner message="Loading lessons..." />;
  }

  return (
    <SafeAreaWrapper>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: colors.foreground,
                fontFamily: Typography.fontFamily.bold,
              },
            ]}
          >
            My Lessons
          </Text>
          <Button
            title="Create New"
            size="sm"
            onPress={() => navigation.navigate('CreateLesson')}
          />
        </View>

        {lessons.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="book-outline"
              size={64}
              color={colors.textMuted}
            />
            <Text
              style={[
                styles.emptyText,
                {
                  color: colors.textSecondary,
                  fontFamily: Typography.fontFamily.regular,
                },
              ]}
            >
              No lessons yet
            </Text>
            <Button
              title="Create Your First Lesson"
              onPress={() => navigation.navigate('CreateLesson')}
              style={styles.emptyButton}
            />
          </View>
        ) : (
          <FlatList
            data={lessons}
            renderItem={renderLesson}
            keyExtractor={item => item.id || ''}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
  },
  list: {
    padding: Layout.spacing.lg,
    paddingTop: 0,
  },
  lessonCard: {
    marginBottom: Layout.spacing.md,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  lessonName: {
    fontSize: Typography.fontSize.lg,
    flex: 1,
  },
  kanjiCount: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Layout.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  emptyText: {
    fontSize: Typography.fontSize.lg,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  emptyButton: {
    minWidth: 200,
  },
});
