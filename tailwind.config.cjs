/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    fontFamily: false,
  },
  theme: {
    extend: {
      screens: {},
      spacing: {},
      colors: {
        dark: '#202124',
        darkGray: '#292a2d',
        gray: '#494c50',
        lightGray: '#9aa0a6',
        light: '#eaeaea',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"], // eslint-disable-line @typescript-eslint/no-var-requires
          primary: "#494c50",
          secondary: "#f6d860",
          accent: "#37cdbe",
          neutral: "#3d4451",
          "base-100": "#292a2d",

          "--rounded-box": "0", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "1", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-text-case": "normal-case", // set default text transform for buttons
          "--btn-focus-scale": "1", // scale transform of button when you focus on it
          "--border-btn": "0", // border width of buttons
          "--tab-border": "0", // border width of tabs
          "--tab-radius": "0", // border radius of tabs
        },
      },
    ],
  },
};
