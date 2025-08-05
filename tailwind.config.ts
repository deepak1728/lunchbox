// import type { Config } from "tailwindcss";

// const config: Config = {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   darkMode: false, // explicitly disable dark mode
//   theme: {
//     extend: {
//       animation: {
//         bounceOnce: "bounce 0.5s ease",
//         fadeIn: "fadeIn 0.8s ease-out",
//       },
//       keyframes: {
//         fadeIn: {
//           "0%": { opacity: "0", transform: "translateY(10px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//       },
//     },
//   },
//   plugins: [require("tailwind-scrollbar-hide")],
// };

// export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // explicitly disable dark mode
  theme: {
    extend: {
      animation: {
        bounceOnce: "bounce 0.5s ease",
        fadeIn: "fadeIn 0.8s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/line-clamp"), // ✅ Added line-clamp plugin
  ],
};

export default config;
