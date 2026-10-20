import eslintJs from '@eslint/js'
import stylisticPlugin from '@stylistic/eslint-plugin'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importNewlinesPlugin from 'eslint-plugin-import-newlines'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

/** Shared with @flesler/open-canvas eslint.config.ts (stylistic + TS base). */
const openCanvasStyleRules = {
	'stylistic/semi': ['error', 'never'],
	'stylistic/indent': ['error', 'tab'],
	'stylistic/quotes': ['error', 'single', { avoidEscape: true }],
	'stylistic/comma-dangle': ['error', 'always-multiline'],
	'stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
	'stylistic/brace-style': 'off',
	'stylistic/space-before-function-paren': ['error', { anonymous: 'always', named: 'never' }],
	'stylistic/member-delimiter-style': ['error', {
		multiline: { delimiter: 'semi', requireLast: false },
		singleline: { delimiter: 'semi', requireLast: false },
	}],
	'@typescript-eslint/consistent-type-imports': 'error',
	'@typescript-eslint/no-explicit-any': 'off',
	'@typescript-eslint/no-require-imports': 'off',
	'@typescript-eslint/no-unused-vars': ['error', {
		argsIgnorePattern: '^_',
		varsIgnorePattern: '^_',
		ignoreRestSiblings: true,
	}],
	'unused-imports/no-unused-imports': 'warn',
	'import-newlines/enforce': ['error', { items: Infinity, semi: false }],
	'object-curly-newline': ['error', { consistent: true }],
	'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
	'no-undef': 'off',
	'no-redeclare': 'off',
	'no-unused-vars': 'off',
	'no-empty': 'off',
	'no-console': 'off',
} as const

export default defineConfig([
	{
		ignores: ['node_modules', 'dist', '**/*.tsbuildinfo', 'src/vendor', 'scripts/vendor-stubs', '.cursor/canvases'],
	},
	eslintJs.configs.recommended,
	{
		files: [
			'src/**/*.ts',
			'src/**/*.tsx',
			'scripts/**/*.ts',
			'vite.config.ts',
			'vite.lib.config.ts',
		],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				ecmaFeatures: { jsx: true },
			},
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: globals.browser,
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			'stylistic': stylisticPlugin,
			'import-newlines': importNewlinesPlugin,
			'unused-imports': unusedImportsPlugin,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			...openCanvasStyleRules,
		},
	},
	{
		files: ['scripts/**/*.ts', 'vite.config.ts', 'vite.lib.config.ts'],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
			},
		},
	},
	{
		files: ['src/shim/**/*.{ts,tsx}', 'src/runtime/**/*.{ts,tsx}'],
		rules: {
			'react-refresh/only-export-components': 'off',
		},
	},
	{
		files: ['src/**/*.test.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},
])
