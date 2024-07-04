module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json']
      }
    }
  ],
  root: true,
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    eqeqeq: 2, // error
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'newline-per-chained-call': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@eslint-disable-next-line': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/ban-types': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'eslint-disable-next-line no-continue': 'off',
    'no-continue': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/camelcase': 'off',
    'import/no-import-module-exports': 'off',
    'no-constructor-return': 'off',
    'no-console': 'off',
    'import/no-cycle': 'off',
    'class-methods-use-this': 'off',
    'prefer-promise-reject-errors': 'off',
    'import/prefer-default-export': 'off',
    'typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' // https://github.com/typescript-eslint/typescript-eslint/issues/1054
      }
    ],
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true }],
    '@typescript-eslint/no-shadow': ['warn'],
    'no-throw-literal': 'off',
    '@typescript-eslint/no-throw-literal': ['error'],
    // prefer es2015 import/export over namespaces and modules
    // only allow declare module for external modules in .d.ts files
    '@typescript-eslint/no-namespace': ['error'],
    // prefer foo as string type assertion to <string>foo
    // and
    // prefer `const foo:someType = bar` over `const foo = bar as someType`
    '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' }]
  }
};
