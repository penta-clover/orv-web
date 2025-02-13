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
      "no-unused-vars": "warning", // unused-vars 규칙 비활성화
    },
  },
];

export default eslintConfig;
