// --- 1. 플러그인 및 설정 임포트 ---
import globals from 'globals'; // 전역 변수(browser, node 등) 목록을 제공하는 패키지
import tseslint from 'typescript-eslint'; // TypeScript 코드를 위한 ESLint 플러그인 및 파서
import pluginReact from 'eslint-plugin-react'; // React 관련 규칙을 제공
import pluginReactHooks from 'eslint-plugin-react-hooks'; // React Hooks의 규칙을 검사
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'; // JSX의 웹 접근성 규칙을 검사
import pluginImport from 'eslint-plugin-import'; // import/export 문법 관련 규칙(순서 등)을 관리
import eslintConfigPrettier from 'eslint-config-prettier'; // Prettier와 충돌하는 ESLint 규칙을 비활성화
import js from '@eslint/js'; // ESLint의 핵심 추천 규칙을 불러오기 위한 패키지

// --- 2. 'globals' 패키지 버그 수정 로직 ---
const cleanedBrowserGlobals = Object.fromEntries(
  Object.entries(globals.browser).map(([key, value]) => [key.trim(), value]),
);

// --- 3. ESLint 설정 내보내기 ---
export default tseslint.config(
  // 전역적으로 검사에서 제외할 폴더나 파일을 지정
  {
    ignores: ['dist', 'build', 'node_modules', '.prettierrc.cjs'],
  },

  // ESLint가 추천하는 기본적인 JavaScript 규칙 세트를 적용
  js.configs.recommended,

  // TypeScript ESLint가 추천하는 규칙 세트를 적용
  ...tseslint.configs.recommended,

  // React 프로젝트를 위한 상세 설정 (TypeScript 파일에만 적용)
  {
    files: ['**/*.{ts,tsx}'], // 이 설정은 .ts 또는 .tsx 파일에만 적용
    plugins: {
      // 이 설정에서 사용할 플러그인들을 등록
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y,
      import: pluginImport,
    },
    languageOptions: {
      // 사용할 전역 변수를 정의
      globals: {
        ...cleanedBrowserGlobals, // 버그를 수정한 브라우저 전역 변수 목록을 적용
        ...globals.node, // Node.js 환경의 전역 변수 목록을 적용
      },
      // 파서에 대한 추가 옵션을 설정
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // JSX 문법을 파싱할 수 있도록 허용
        },
      },
    },
    // 개별 규칙을 상세하게 설정
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,

      // 프로젝트 정책에 맞게 개별 규칙을 수정
      'react/prop-types': 'off', // TypeScript를 사용하므로 prop-types 검사는 비활성화
      '@typescript-eslint/no-unused-vars': 'warn', // 사용하지 않는 변수는 경고로 표시
      '@typescript-eslint/no-explicit-any': 'warn', // 'any' 타입 사용 시 경고로 표시
      'no-console': ['warn', { allow: ['warn', 'error'] }], // console.log 사용 시 경고를 표시

      // import 순서를 정렬하고 그룹화하는 규칙
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
        },
      ],
    },
    // 플러그인이 공유할 설정을 정의
    settings: {
      react: {
        version: 'detect', // 설치된 React 버전을 자동으로 감지하여 규칙에 활용
      },
    },
  },

  // Prettier와 충돌할 수 있는 모든 스타일 관련 ESLint 규칙을 비활성화
  // **반드시 마지막에 위치**
  eslintConfigPrettier,
);
