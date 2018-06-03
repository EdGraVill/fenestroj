module.exports = {
  extends: 'airbnb',
  parser: 'typescript-eslint-parser',
  rules: {
    'react/jsx-filename-extension': [1, {
      'extensions': ['.tsx', '.jsx']
    }],
    'import/extensions': ['error', {
      tsx: 'never',
      ts: 'never',
    }],
    'no-undef': 'off',
    'no-restricted-globals': 'off',
    'no-unused-vars': 'off',
    'react/sort-comp': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
        ]
      }
    }
  },
};