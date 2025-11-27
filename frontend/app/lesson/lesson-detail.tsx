import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { useTheme } from '@/contexts/ThemeContext';
import { Typography, Layout } from '@/constants';

export default function LessonDetailScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaWrapper>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text
          style={[
            styles.text,
            {
              color: colors.foreground,
              fontFamily: Typography.fontFamily.regular,
            },
          ]}
        >
          Lesson Detail Screen (Coming Soon)
        </Text>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  text: {
    fontSize: Typography.fontSize.xl,
  },
});
