module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@/components': './components',
            '@/services': './services',
            '@/hooks': './hooks',
            '@/contexts': './contexts',
            '@/constants': './constants',
            '@/types': './types',
            '@/utils': './utils',
            '@/navigation': './navigation',
            '@/app': './app',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
