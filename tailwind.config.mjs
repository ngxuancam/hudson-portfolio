/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      // calm introvert palette
      colors: {
        ink: "#0B0F19", // background
        coal: "#111827", // surfaces
        mist: "#94a3b8", // muted text
        accent: "#22d3ee", // cyan-400
        accent2: "#a78bfa", // violet-400
      },
    },
  },
  plugins: [],
};
