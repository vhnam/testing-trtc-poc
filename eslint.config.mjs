import { FlatCompat } from '@eslint/eslintrc';
import nextConfig from 'eslint-config-next/core-web-vitals';
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
];

export default eslintConfig;
