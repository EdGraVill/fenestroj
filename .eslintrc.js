module.exports = {
  extends: 'airbnb',
  parser: 'typescript-eslint-parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
      jsx: true
    }
  },
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
    'react/jsx-boolean-value': 'off',
    'react/no-multi-comp': 'off',
    'react/prefer-stateless-function': 'off',
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