import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { KeyboardAvoidingWrapper } from '@/components/layout/KeyboardAvoidingWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { Typography, Layout } from '@/constants';
import {
  signInWithEmail,
  createAccountWithEmail,
  signInWithGoogle,
} from '@/services/firebase/auth';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignIn = async () => {
    if (!email.includes('@') || password.length < 6) {
      Alert.alert('Error', 'Please enter a valid email and password (min 6 characters)');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmail(email, password);
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'Please check your credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email.includes('@') || password.length < 6 || displayName.length < 2) {
      Alert.alert(
        'Error',
        'Please enter a valid email, password (min 6 characters), and display name'
      );
      return;
    }

    try {
      setLoading(true);
      await createAccountWithEmail(email, password, displayName);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      if (error.message !== 'Sign in cancelled') {
        Alert.alert('Google Sign In Failed', error.message || 'Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingWrapper>
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
              I-漢字
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                  fontFamily: Typography.fontFamily.regular,
                },
              ]}
            >
              Master Japanese Kanji
            </Text>
          </View>

          <Card variant="cream" style={styles.card}>
            <Text
              style={[
                styles.cardTitle,
                {
                  color: colors.foreground,
                  fontFamily: Typography.fontFamily.semiBold,
                },
              ]}
            >
              {isSignUp ? 'Create Account' : 'Login'}
            </Text>

            {isSignUp && (
              <Input
                label="Display Name"
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name"
                autoCapitalize="words"
              />
            )}

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />

            <Button
              title={isSignUp ? 'Create Account' : 'Sign In'}
              onPress={isSignUp ? handleSignUp : handleSignIn}
              loading={loading}
              fullWidth
              style={styles.button}
            />

            <Button
              title={isSignUp ? 'Already have an account? Sign In' : 'New to I-Kanji? Create Account'}
              variant="outline"
              onPress={() => setIsSignUp(!isSignUp)}
              fullWidth
            />

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text
                style={[
                  styles.dividerText,
                  {
                    color: colors.textSecondary,
                    fontFamily: Typography.fontFamily.regular,
                  },
                ]}
              >
                OR
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <Button
              title="Continue with Google"
              variant="outline"
              onPress={handleGoogleSignIn}
              loading={loading}
              fullWidth
            />
          </Card>
        </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Layout.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize['5xl'],
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
  },
  card: {
    width: '100%',
  },
  cardTitle: {
    fontSize: Typography.fontSize['2xl'],
    marginBottom: Layout.spacing.lg,
  },
  button: {
    marginBottom: Layout.spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Layout.spacing.md,
    fontSize: Typography.fontSize.sm,
  },
});
