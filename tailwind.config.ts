import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1) Colors
      colors: {
        // 필요시 삭제/수정
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Main
        main: {
          lilac50: "#C5D1FF",
          beige50: "#F2EACC",
          // gd는 gradient로 따로 정의
        },

        // System
        system: {
          success: "#0DBE61",
          info: "#127CFA",
          warning: "#EE9209",
          error: "#F01F1F",
        },

        // Background
        dark: "#101212",

        // Grayscale
        grayscale: {
          black: "#0E0E0E",
          900: "#1A182E",
          800: "#181A2E",
          700: "#232337",
          600: "#393A54",
          500: "#5B5B80",
          400: "#9A9ABC",
          300: "#BABADC",
          200: "#E0E0FA",
          100: "#E6E6EA",
          50: "#F2F2F3",
          white: "#FDFDFD",
        },
      },

      // 2) Gradients
      backgroundImage: {
        gd: "linear-gradient(90deg, #C5D1FF 0%, #F2EACC 100%)",
      },

      // 3) Font System
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
      fontSize: {
        head0: ["26px", { lineHeight: "44px" }],
        head1: ["24px", { lineHeight: "38px" }],
        head2: ["20px", { lineHeight: "28px" }],
        head3: ["18px", { lineHeight: "26px" }],
        body1: ["18px", { lineHeight: "30px" }],
        body2: ["16px", { lineHeight: "24px" }],
        body3: ["14px", { lineHeight: "22px" }],
        caption: ["12px", { lineHeight: "22px" }],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
    },
  },
  plugins: [],
} satisfies Config;
