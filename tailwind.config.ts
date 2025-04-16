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
      screens: {
        "w-450": "450px",
        h1000: { raw: "(max-height: 1000px)" },
        h900: { raw: "(max-height: 900px)" },
        h800: { raw: "(max-height: 800px)" },
        h750: { raw: "(max-height: 750px)" },
        h700: { raw: "(max-height: 700px)" },
        h650: { raw: "(max-height: 650px)" },
        h600: { raw: "(max-height: 600px)" },
        h500: { raw: "(max-height: 500px)" },

        w800: { raw: "(max-width: 800px)" },
        w750: { raw: "(max-width: 750px)" },
        w700: { raw: "(max-width: 700px)" },
        w650: { raw: "(max-width: 650px)" },
        w600: { raw: "(max-width: 600px)" },
        w500: { raw: "(max-width: 500px)" },

        xs: { raw: "(min-width: 30rem)" },
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shake-0.2": "shake 0.2s ease-in-out",
        "shake-0.3": "shake 0.3s ease-in-out",
        "shake-0.4": "shake 0.4s ease-in-out",
        "shake-0.5": "shake 0.5s ease-in-out",
        "shake-0.6": "shake 0.6s ease-in-out",
        "shake-0.7": "shake 0.7s ease-in-out",
        "shake-0.8": "shake 0.8s ease-in-out",
        "shake-0.9": "shake 0.9s ease-in-out",
        "shake-1": "shake 1s ease-in-out",
        "shake-1.2": "shake 1.2s ease-in-out",
        "shake-2": "shake 2s ease-in-out",
        updown: "updown 2s ease-in-out infinite",
        "skeleton-wave": 'skeleton-wave 1.5s infinite',
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
        pretendard: ["Pretendard Variable", "sans-serif"],
        onglyph: ["온글잎 콘콘체", "sans-serif"],
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
        body0: [
          "20px",
          {
            lineHeight: "150%",
            fontWeight: "500",
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
            lineHeight: "24px",
            fontWeight: "600",
          },
        ],
        body4: [
          "14px",
          {
            lineHeight: "22px",
            fontWeight: "500",
          },
        ],
        caption1: [
          "12px",
          {
            lineHeight: "22px",
            fontWeight: "600",
          },
        ],
        caption2: [
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
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        shake: {
          "0%, 50%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "12.5%, 62.5%": { transform: "translateX(-6px) rotate(3deg)" },
          "25%, 75%": { transform: "translateX(6px) rotate(-3deg)" },
          "37.5%, 87.5%": { transform: "translateX(-6px) rotate(3deg)" },
        },
        updown: {
          "50%": { transform: "translateY(-3px)" },
        },
        "skeleton-wave": {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
