const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary1: "#10b981", // emerald 500
      primary2: "#a7f3d0", // emerald 200
      primary3: "#ecfdf5", // emerald 50
      secondary1: "#64748b", // slate 500
      secondary2: "#94a3b8", // slate 400
      secondary3: "#e2e8f0", // slate 200
      secondary4: "#f1f5f9", // slate 100
      text1: "#4b5563", // gray 600
      text2: "#9ca3af", // gray 400
    },
    fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      'display': ['Oswald'],
      'body': ['"Open Sans"'],
    },
    extend: {},
  },
  plugins: [],
});
