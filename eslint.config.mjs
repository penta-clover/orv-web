import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*"], // 프로젝트 전체에 적용할 기본 규칙
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // 사용하지 않는 변수 검사 무시
      "@typescript-eslint/no-explicit-any": "off", // any 타입 사용 허용
      "@typescript-eslint/no-empty-object-type": "off", // 빈 객체 타입 사용 허용
      "react-hooks/exhaustive-deps": "off", // effect 의존성 관련 경고 무시
      "react/no-unescaped-entities": "off", // JSX 내 unescaped 문자 관련 오류 무시
      "react/display-name": "off", // 컴포넌트 display name 누락 경고 무시
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off", // 옵셔널 체이닝 후 non-null assertion 관련 경고 무시
      "react/jsx-no-comment-textnodes": "off", // JSX 내부 주석 관련 경고 무시
      "@next/next/no-img-element": "off", // img 태그 사용 관련 경고 무시
    },
  },
];

export default eslintConfig;
