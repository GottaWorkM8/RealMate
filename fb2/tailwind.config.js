const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary1: "#009688", // teal 500
      primary2: "#80cbc4", // teal 200
      primary3: "#e0f2f1", // teal 50
      secondary1: "#90a4ae", // blue gray 300
      secondary2: "#eceff1", // blue gray 50
      text1: "#263238", // blue gray 900
      text2: "#455a64", // blue gray 700
      text3: "#607d8b", // blue gray 500
      text4: "#78909c", // blue gray 400
      text5: "#b0bec5", // blue gray 200
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
