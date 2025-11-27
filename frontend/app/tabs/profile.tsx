import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Typography, Layout } from '@/constants';

export default function ProfileScreen() {
  const { colors, colorScheme, toggleColorScheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
          }
        },
      },
    ]);
  };

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
            Profile
          </Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.profileInfo}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.customBrownLight },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  {
                    color: colors.customCream,
                    fontFamily: Typography.fontFamily.bold,
                  },
                ]}
              >
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text
                style={[
                  styles.displayName,
                  {
                    color: colors.foreground,
                    fontFamily: Typography.fontFamily.semiBold,
                  },
                ]}
              >
                {user?.displayName || 'User'}
              </Text>
              <Text
                style={[
                  styles.email,
                  {
                    color: colors.textSecondary,
                    fontFamily: Typography.fontFamily.regular,
                  },
                ]}
              >
                {user?.email}
              </Text>
            </View>
          </View>
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
            Settings
          </Text>

          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Ionicons
                name={colorScheme === 'dark' ? 'moon' : 'sunny'}
                size={Layout.iconSize.md}
                color={colors.customBrownDark}
              />
              <Text
                style={[
                  styles.settingText,
                  {
                    color: colors.foreground,
                    fontFamily: Typography.fontFamily.regular,
                  },
                ]}
              >
                Dark Mode
              </Text>
            </View>
            <Button
              title={colorScheme === 'dark' ? 'On' : 'Off'}
              variant="outline"
              size="sm"
              onPress={toggleColorScheme}
            />
          </View>
        </Card>

        <Button
          title="Sign Out"
          variant="destructive"
          onPress={handleSignOut}
          fullWidth
        />
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
    marginBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
  },
  card: {
    marginBottom: Layout.spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Typography.fontSize['3xl'],
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: Typography.fontSize.xl,
    marginBottom: Layout.spacing.xs,
  },
  email: {
    fontSize: Typography.fontSize.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    marginBottom: Layout.spacing.md,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  settingText: {
    fontSize: Typography.fontSize.base,
  },
});
