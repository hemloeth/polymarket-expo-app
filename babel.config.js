module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            crypto: 'crypto-browserify',
            stream: 'stream-browserify',
            buffer: '@craftzdog/react-native-buffer',
            events: 'events',
          },
        },
      ],
    ],
  };
};