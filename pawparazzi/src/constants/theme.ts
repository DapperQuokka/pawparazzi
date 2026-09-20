/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';
import { Color } from 'expo-router';

import { Platform, StyleSheet } from 'react-native';

export const Colors = {
  light: {
    primary: '#E76F51',       // Playful Terracotta Orange
    secondary: '#264653',     // Deep Trustworthy Teal
    background: '#FDFBF7',    // Warm Cream Biscuit
    surface: '#FFFFFF',       // Crisp White Cards
    text: '#2B2D42',          // Dark Charcoal Slate
    textMuted: '#6C757D'      // Soft Gray Info Tags
  },
  dark: {
    primary: '#F4A261',       // Soft Golden Amber
    secondary: '#4EA8DE',     // Friendly Sky Blue
    background: '#1A1816',    // Deep Chocolate Charcoal
    surface: '#262220',       // Lighter Cocoa Card Background
    text: '#F6F4F2',          // Soft Warm White
    textMuted: '#A69F99'      // Desaturated Taupe Metadata
  }
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
