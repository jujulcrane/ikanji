import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { useTheme } from '@/contexts/ThemeContext';
import { useFlashcards } from '@/hooks/useFlashcards';
import { Typography, Layout } from '@/constants';
import { MainStackParamList } from '@/types';

type FlashcardsRouteProp = RouteProp<MainStackParamList, 'Flashcards'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

export default function FlashcardsScreen() {
  const { colors } = useTheme();
  const route = useRoute<FlashcardsRouteProp>();
  const navigation = useNavigation();
  const { lesson } = route.params;

  const {
    front,
    back,
    isFlipped,
    isReversed,
    isPracticeMode,
    isMeaningChecked,
    isReadingsChecked,
    progress,
    hasPracticeSentences,
    goToNext,
    goToPrevious,
    flipCard,
    shuffle,
    togglePracticeMode,
    toggleMeaningChecked,
    toggleReadingsChecked,
    toggleReversed,
  } = useFlashcards(lesson);

  const rotation = useSharedValue(0);

  const handleFlip = () => {
    rotation.value = withTiming(isFlipped ? 0 : 180, { duration: 400 });
    flipCard();
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
    };
  });

  return (
    <SafeAreaWrapper>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color={colors.foreground} />
          </TouchableOpacity>
          <Text
            style={[
              styles.progress,
              {
                color: colors.foreground,
                fontFamily: Typography.fontFamily.medium,
              },
            ]}
          >
            {progress.current} / {progress.total}
          </Text>
          <TouchableOpacity onPress={shuffle}>
            <Ionicons name="shuffle" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.controls}>
            <View style={styles.checkboxRow}>
              <Checkbox
                checked={isMeaningChecked}
                onCheckedChange={toggleMeaningChecked}
              />
              <Text
                style={[
                  styles.checkboxLabel,
                  {
                    color: colors.foreground,
                    fontFamily: Typography.fontFamily.regular,
                  },
                ]}
              >
                Meaning
              </Text>
            </View>

            <View style={styles.checkboxRow}>
              <Checkbox
                checked={isReadingsChecked}
                onCheckedChange={toggleReadingsChecked}
              />
              <Text
                style={[
                  styles.checkboxLabel,
                  {
                    color: colors.foreground,
                    fontFamily: Typography.fontFamily.regular,
                  },
                ]}
              >
                Readings
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.practiceModeButton,
                {
                  backgroundColor: isPracticeMode
                    ? colors.customBrownLight
                    : colors.customCream,
                  opacity: !hasPracticeSentences ? 0.5 : 1,
                },
              ]}
              onPress={togglePracticeMode}
              disabled={!hasPracticeSentences}
            >
              <Text
                style={[
                  styles.practiceModeText,
                  {
                    color: isPracticeMode
                      ? colors.customCream
                      : colors.customBrownDark,
                    fontFamily: Typography.fontFamily.medium,
                  },
                ]}
              >
                Practice Sentences
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.switchButton,
              { backgroundColor: colors.customBrownLight },
            ]}
            onPress={toggleReversed}
          >
            <MaterialIcons name="swap-vert" size={20} color={colors.customCream} />
            <Text
              style={[
                styles.switchButtonText,
                {
                  color: colors.customCream,
                  fontFamily: Typography.fontFamily.medium,
                },
              ]}
            >
              Switch Term and Definition
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.9}
            onPress={handleFlip}
          >
            <Animated.View
              style={[
                styles.card,
                styles.cardFront,
                { backgroundColor: colors.customCream },
                frontAnimatedStyle,
              ]}
            >
              <Text
                style={[
                  isPracticeMode ? styles.practiceSentence : styles.kanji,
                  {
                    color: colors.customBrownDark,
                    fontFamily: Typography.fontFamily.bold,
                  },
                ]}
              >
                {front}
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.card,
                styles.cardBack,
                { backgroundColor: colors.customBrownLight },
                backAnimatedStyle,
              ]}
            >
              {isPracticeMode ? (
                <Text
                  style={[
                    styles.practiceEnglish,
                    {
                      color: colors.customCream,
                      fontFamily: Typography.fontFamily.semiBold,
                    },
                  ]}
                >
                  {back.english}
                </Text>
              ) : (
                <>
                  {back.meaning && (
                    <Text
                      style={[
                        styles.meaning,
                        {
                          color: colors.customCream,
                          fontFamily: Typography.fontFamily.semiBold,
                        },
                      ]}
                    >
                      {back.meaning}
                    </Text>
                  )}
                  {back.readings && back.readings.length > 0 && (
                    <Text
                      style={[
                        styles.reading,
                        {
                          color: colors.customCream,
                          fontFamily: Typography.fontFamily.regular,
                        },
                      ]}
                    >
                      {back.readings.join(', ')}
                    </Text>
                  )}
                </>
              )}
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.navigationControls}>
            <Button
              title="Previous"
              variant="outline"
              onPress={goToPrevious}
              style={styles.controlButton}
            />
            <Button
              title="Next"
              onPress={goToNext}
              style={styles.controlButton}
            />
          </View>
        </ScrollView>
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
    marginBottom: Layout.spacing.md,
  },
  progress: {
    fontSize: Typography.fontSize.xl,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Layout.spacing.lg,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    flexWrap: 'wrap',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  checkboxLabel: {
    fontSize: Typography.fontSize.sm,
  },
  practiceModeButton: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
  },
  practiceModeText: {
    fontSize: Typography.fontSize.sm,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    alignSelf: 'center',
    marginBottom: Layout.spacing.lg,
  },
  switchButtonText: {
    fontSize: Typography.fontSize.sm,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: CARD_HEIGHT,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: Layout.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    position: 'absolute',
  },
  cardBack: {
    position: 'absolute',
  },
  kanji: {
    fontSize: 120,
  },
  practiceSentence: {
    fontSize: Typography.fontSize['4xl'],
    textAlign: 'center',
    lineHeight: 48,
  },
  practiceEnglish: {
    fontSize: Typography.fontSize['2xl'],
    textAlign: 'center',
  },
  meaning: {
    fontSize: Typography.fontSize['3xl'],
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  reading: {
    fontSize: Typography.fontSize.xl,
    textAlign: 'center',
  },
  navigationControls: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
  },
  controlButton: {
    flex: 1,
  },
});
