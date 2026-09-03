import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "deep-navy": "#0E3E34",
        "forest-dark": "#0A2A23",
        "emerald-growth": "#0EA87E",
        "border-subtle": "#E1ECE8",
        "surface": "#F3F8F6",
        "on-surface": "#1C2B27",
        "on-surface-variant": "#40544F",
        "surface-container": "#FFFFFF",
        "surface-container-low": "#EAF1EE",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-highest": "#D6E3DF",
        "primary-container": "#0B2F27",
        "on-primary-container": "#8BA59E",
        "on-primary-fixed-variant": "#304E47",
        "on-primary-fixed": "#0E3E34",
        "data-soft": "#88BEA3",
        "data-muted": "#568B71",
        "secondary-container": "#D4EFE6",
        "on-secondary-container": "#0A4F3D",
      },
      spacing: {
        "container-max": "1280px",
        "stack-lg": "32px",
        "margin-mobile": "16px",
        "gutter": "24px",
        "stack-md": "16px",
        "base": "4px",
        "stack-sm": "8px",
        "margin-desktop": "40px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
