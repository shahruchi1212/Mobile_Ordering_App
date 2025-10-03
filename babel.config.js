module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        // Required for some packages that use reanimated features
        'react-native-reanimated/plugin', 
        
        // 💡 NEW: This plugin is crucial for transpiling modules that use 
        // the `import/export` syntax but live in `node_modules`.
        [
          '@babel/plugin-transform-modules-commonjs',
          {
            // Add any package that gives an 'Unexpected token export' or 
            // 'Unexpected token import' error.
            allowList: [
              'expo-notifications',
              'expo-modules-core', // Often needed for Expo SDK 
              'expo-router' // Often needed
            ],
          },
        ],
      ],
    };
  };