import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Typography, Layout } from '@/constants';
import { MainStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
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
            I-漢字へようこそ
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                fontFamily: Typography.fontFamily.semiBold,
              },
            ]}
          >
            Welcome to I-Kanji!
          </Text>
        </View>

        <Card variant="cream" style={styles.infoCard}>
          <Text
            style={[
              styles.infoText,
              {
                color: colors.foreground,
                fontFamily: Typography.fontFamily.regular,
              },
            ]}
          >
            Master kanji and elevate your studies by creating custom lessons
            tailored to your learning needs.
          </Text>

          <View style={styles.studyOptions}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate('Tabs', { screen: 'Lessons' })}
            >
              <Ionicons
                name="brain"
                size={Layout.iconSize.md}
                color={colors.customBrownDark}
              />
              <Text
                style={[
                  styles.optionText,
                  {
                    color: colors.foreground,
                    fontFamily: Typography.fontFamily.medium,
                  },
                ]}
              >
                Study With Flash Cards
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate('Tabs', { screen: 'Lessons' })}
            >
              <Ionicons
                name="game-controller"
                size={Layout.iconSize.md}
                color={colors.customBrownDark}
              />
              <Text
                style={[
                  styles.optionText,
                  {
                    color: colors.foreground,
                    fontFamily: Typography.fontFamily.medium,
                  },
                ]}
              >
                Practice With Multiple Choice
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.actionCard}>
          <TouchableOpacity
            style={[
              styles.createButton,
              { backgroundColor: colors.customBrownLight },
            ]}
            onPress={() => navigation.navigate('CreateLesson')}
          >
            <Ionicons
              name="add-circle"
              size={Layout.iconSize.lg}
              color={colors.customCream}
            />
            <Text
              style={[
                styles.createButtonText,
                {
                  color: colors.customCream,
                  fontFamily: Typography.fontFamily.semiBold,
                },
              ]}
            >
              Create New Lesson
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
    marginTop: Layout.spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['4xl'],
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.xl,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: Layout.spacing.lg,
  },
  infoText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  studyOptions: {
    gap: Layout.spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  optionText: {
    fontSize: Typography.fontSize.base,
  },
  actionCard: {
    marginBottom: Layout.spacing.lg,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    gap: Layout.spacing.sm,
  },
  createButtonText: {
    fontSize: Typography.fontSize.lg,
  },
});
