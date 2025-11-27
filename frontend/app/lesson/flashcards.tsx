import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Button } from '@/components/ui/Button';
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
    currentCard,
    isFlipped,
    progress,
    goToNext,
    goToPrevious,
    flipCard,
    shuffle,
  } = useFlashcards(lesson.kanjiList);

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
                styles.kanji,
                {
                  color: colors.customBrownDark,
                  fontFamily: Typography.fontFamily.bold,
                },
              ]}
            >
              {currentCard?.character}
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
            <Text
              style={[
                styles.meaning,
                {
                  color: colors.customCream,
                  fontFamily: Typography.fontFamily.semiBold,
                },
              ]}
            >
              {currentCard?.meaning}
            </Text>
            <Text
              style={[
                styles.reading,
                {
                  color: colors.customCream,
                  fontFamily: Typography.fontFamily.regular,
                },
              ]}
            >
              {currentCard?.readings.map(r => r.value).join(', ')}
            </Text>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.controls}>
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
  progress: {
    fontSize: Typography.fontSize.xl,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  meaning: {
    fontSize: Typography.fontSize['3xl'],
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  reading: {
    fontSize: Typography.fontSize.xl,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginTop: Layout.spacing.xl,
  },
  controlButton: {
    flex: 1,
  },
});
