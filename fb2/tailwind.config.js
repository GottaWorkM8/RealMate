const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      // Based on color palettes from https://www.material-tailwind.com/docs/react/colors
      primary: {
        1: "rgb(var(--color-primary1) / <alpha-value>)", // teal 500
        2: "rgb(var(--color-primary2) / <alpha-value>)", // teal 200 d: teal 700
        3: "rgb(var(--color-primary3) / <alpha-value>)", // teal 100 d: teal 800
        4: "rgb(var(--color-primary4) / <alpha-value>)", // teal 50 d: teal 900
      },
      secondary: {
        1: "rgb(var(--color-secondary1) / <alpha-value>)", // blue gray 300 d: blue gray 500
        2: "rgb(var(--color-secondary2) / <alpha-value>)", // blue gray 200 d: blue gray 700
        3: "rgb(var(--color-secondary3) / <alpha-value>)", // blue gray 100 d: blue gray 800
        4: "rgb(var(--color-secondary4) / <alpha-value>)", // blue gray 50 d: blue gray 900
      },
      text: {
        1: "rgb(var(--color-text1) / <alpha-value>)", // blue gray 900 d: blue gray 50
        2: "rgb(var(--color-text2) / <alpha-value>)", // blue gray 700 d: blue gray 100
        3: "rgb(var(--color-text3) / <alpha-value>)", // blue gray 500 d: blue gray 200
        4: "rgb(var(--color-text4) / <alpha-value>)", // blue gray 400
      },
      background: "rgb(var(--color-background) / <alpha-value>)", // white d: gray 900
      tooltip: "rgb(var(--color-tooltip) / <alpha-value>)", // blue gray 900
    },
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui"],
      serif: ["ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
      display: ["Oswald"],
      body: ['"Open Sans"'],
    },
  },
  plugins: [],
});
