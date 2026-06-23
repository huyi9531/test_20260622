import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0066cc",
          focus: "#0071e3",
          "on-dark": "#2997FF",
        },
        canvas: {
          DEFAULT: "#ffffff",
          parchment: "#f5f5f7",
        },
        surface: {
          pearl: "#fafafc",
          "tile-1": "#272729",
          "tile-2": "#2a2a2c",
          "tile-3": "#252527",
          black: "#000000",
          "chip-translucent": "rgba(210, 210, 215, 0.64)",
        },
        ink: {
          DEFAULT: "#1d1d1f",
          "muted-80": "#333333",
          "muted-48": "#7a7a7a",
        },
        body: {
          DEFAULT: "#1d1d1f",
          "on-dark": "#ffffff",
          muted: "#cccccc",
        },
        divider: {
          soft: "#f0f0f0",
        },
        hairline: "#e0e0e0",
      },
      fontFamily: {
        display: [
          "SF Pro Display",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "var(--font-inter)",
          "sans-serif",
        ],
        body: [
          "SF Pro Text",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "var(--font-inter)",
          "sans-serif",
        ],
      },
      fontSize: {
        "hero-display": [
          "56px",
          { lineHeight: "1.07", letterSpacing: "-0.28px", fontWeight: "600" },
        ],
        "display-lg": [
          "40px",
          { lineHeight: "1.10", letterSpacing: "0px", fontWeight: "600" },
        ],
        "display-md": [
          "34px",
          { lineHeight: "1.47", letterSpacing: "-0.374px", fontWeight: "600" },
        ],
        lead: [
          "28px",
          { lineHeight: "1.14", letterSpacing: "0.196px", fontWeight: "400" },
        ],
        tagline: [
          "21px",
          { lineHeight: "1.19", letterSpacing: "0.231px", fontWeight: "600" },
        ],
        "body-apple": [
          "17px",
          {
            lineHeight: "1.47",
            letterSpacing: "-0.374px",
            fontWeight: "400",
          },
        ],
        caption: [
          "14px",
          {
            lineHeight: "1.43",
            letterSpacing: "-0.224px",
            fontWeight: "400",
          },
        ],
        "caption-strong": [
          "14px",
          {
            lineHeight: "1.29",
            letterSpacing: "-0.224px",
            fontWeight: "600",
          },
        ],
        fine: [
          "12px",
          { lineHeight: "1.0", letterSpacing: "-0.12px", fontWeight: "400" },
        ],
        "button-large": [
          "18px",
          { lineHeight: "1.0", letterSpacing: "0px", fontWeight: "300" },
        ],
        "nav-link": [
          "12px",
          { lineHeight: "1.0", letterSpacing: "-0.12px", fontWeight: "400" },
        ],
        "micro-legal": [
          "10px",
          { lineHeight: "1.3", letterSpacing: "-0.08px", fontWeight: "400" },
        ],
      },
      spacing: {
        section: "80px",
      },
      borderRadius: {
        xs: "5px",
        sm: "8px",
        md: "11px",
        lg: "18px",
        pill: "9999px",
      },
      boxShadow: {
        product:
          "rgba(0, 0, 0, 0.22) 3px 5px 30px 0",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
