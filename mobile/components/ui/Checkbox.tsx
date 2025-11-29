import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Layout } from '@/constants';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ checked, onCheckedChange, disabled = false }: CheckboxProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
      style={[
        styles.checkbox,
        {
          borderColor: colors.foreground,
          backgroundColor: checked ? colors.foreground : 'transparent',
        },
        disabled && styles.disabled,
      ]}
      activeOpacity={0.7}
    >
      {checked && (
        <Ionicons
          name="checkmark"
          size={16}
          color={colors.background}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: Layout.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
