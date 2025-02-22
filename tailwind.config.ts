import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        // 기본 pulse는 2s인데, 여기서는 0.5s로 설정 (원하는 속도로 조절 가능)
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        main: {
          lilac50: "#C5D1FF",
          beige50: "#F2EACC",
        },
        system: {
          success: "#0DBE61",
          info: "#127CFA",
          warning: "#EE9209",
          error: "#F01F1F",
        },
        dark: "#101212",
        grayscale: {
          "50": "#F2F2F3",
          "100": "#E6E6EA",
          "200": "#D1D1D6",
          "300": "#BABAC0",
          "400": "#9F9FA5",
          "500": "#80808A",
          "600": "#505059",
          "700": "#383842",
          "800": "#28282F",
          "900": "#1A1B1E",
          black: "#0E0E0E",
          white: "#FDFDFD",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      backgroundImage: {
        gd: "linear-gradient(90deg, #C5D1FF 0%, #F2EACC 100%)",
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
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
      fontSize: {
        head0: [
          "26px",
          {
            lineHeight: "44px",
            fontWeight: "600",
          },
        ],
        head1: [
          "24px",
          {
            lineHeight: "38px",
            fontWeight: "600",
          },
        ],
        head2: [
          "20px",
          {
            lineHeight: "28px",
            fontWeight: "600",
          },
        ],
        head3: [
          "18px",
          {
            lineHeight: "28px",
            fontWeight: "600",
          },
        ],
        head4: [
          "16px",
          {
            lineHeight: "26px",
            fontWeight: "600",
          },
        ],
        body1: [
          "18px",
          {
            lineHeight: "30px",
            fontWeight: "500",
          },
        ],
        body2: [
          "16px",
          {
            lineHeight: "26px",
            fontWeight: "500",
          },
        ],
        body3: [
          "14px",
          {
            lineHeight: "22px",
            fontWeight: "600",
          },
        ],
        caption1: [
          "12px",
          {
            lineHeight: "22px",
            fontWeight: "500",
          },
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
