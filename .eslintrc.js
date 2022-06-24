module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [ "airbnb-base", 'prettier', "plugin:@typescript-eslint/recommended", 'airbnb-typescript/base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "no-console": "off",
    "no-restricted-syntax": "off",
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/indent': 'off',
    'prettier/prettier': ['error', { singleQuote: true, arrowParens: 'avoid', printWidth: 140 }],
    "no-underscore-dangle": "off"
  },
};
