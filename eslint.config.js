const expoConfig = require('eslint-config-expo/flat');
const { defineConfig } = require('eslint/config');

const thirdPartyBans = {
  paths: [
    {
      name: 'zustand',
      message: 'Import state helpers from @/core/state instead of zustand.',
    },
    {
      name: 'react-native-mmkv',
      message: 'Import storage from @/core/storage instead of react-native-mmkv.',
    },
    {
      name: 'expo-location',
      message: 'Import location from @/core/location instead of expo-location.',
    },
    {
      name: 'expo-notifications',
      message: 'Import notifications from @/core/notifications instead of expo-notifications.',
    },
    {
      name: 'expo-linking',
      message: 'Import linking from @/core/linking instead of expo-linking.',
    },
    {
      name: '@/di/container',
      message: 'Use useDependencies() from @/di/DependenciesProvider instead of importing the container.',
    },
  ],
  patterns: [
    {
      group: ['zustand/*'],
      message: 'Import state helpers from @/core/state instead of zustand.',
    },
    {
      group: ['react-native-mmkv/*'],
      message: 'Import storage from @/core/storage instead of react-native-mmkv.',
    },
    {
      group: ['expo-location/*'],
      message: 'Import location from @/core/location instead of expo-location.',
    },
    {
      group: ['expo-notifications/*'],
      message: 'Import notifications from @/core/notifications instead of expo-notifications.',
    },
    {
      group: ['expo-linking/*'],
      message: 'Import linking from @/core/linking instead of expo-linking.',
    },
    {
      group: ['@/features/*/**'],
      message: 'Import a feature only from @/features/<name>.',
    },
  ],
};

const domainBans = {
  paths: [
    ...thirdPartyBans.paths,
    {
      name: 'react',
      message: 'Domain must stay pure TypeScript. Do not import react.',
    },
    {
      name: 'react-native',
      message: 'Domain must stay pure TypeScript. Do not import react-native.',
    },
    {
      name: 'expo',
      message: 'Domain must stay pure TypeScript. Do not import expo.',
    },
    {
      name: '@/core',
      message: 'Domain must not depend on @/core.',
    },
    {
      name: '@/di',
      message: 'Domain must not depend on @/di.',
    },
    {
      name: '@/common',
      message: 'Domain must not depend on @/common.',
    },
  ],
  patterns: [
    ...thirdPartyBans.patterns,
    {
      group: ['expo-*', '@expo/*'],
      message: 'Domain must stay pure TypeScript. Do not import Expo packages.',
    },
    {
      group: ['@/core/**'],
      message: 'Domain must not depend on @/core.',
    },
    {
      group: ['@/di/**'],
      message: 'Domain must not depend on @/di.',
    },
    {
      group: ['@/common/**'],
      message: 'Domain must not depend on @/common.',
    },
  ],
};

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/**'],
  },
  {
    files: [
      'src/features/**/*.{ts,tsx}',
      'src/app/**/*.{ts,tsx}',
      'src/common/**/*.{ts,tsx}',
      'src/utils/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': ['error', thirdPartyBans],
    },
  },
  {
    files: ['src/features/**/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', domainBans],
    },
  },
]);
