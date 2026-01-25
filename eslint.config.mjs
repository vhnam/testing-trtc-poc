// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { FlatCompat } from '@eslint/eslintrc';
import nextConfig from 'eslint-config-next/core-web-vitals';
import storybook from 'eslint-plugin-storybook';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...nextConfig,
  ...compat.extends('plugin:@tanstack/query/recommended'),
  {
    ignores: ['public/assets/**'],
  },
  ...storybook.configs['flat/recommended'],
];

export default eslintConfig;
