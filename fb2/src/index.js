import React from "react";
import ReactDOM from "react-dom/client";
import Register from "./pages/Register";
import Login from "pages/Login";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const root = ReactDOM.createRoot(document.getElementById("root"));
const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981", // emerald 500
    },
    secondary: {
      main: "#64748b", // slate 500
    },
    info: {
      main: "#94a3b8", // slate 400
    },
  },
  shape: {
    borderRadius: 7,
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <script
        src="https://kit.fontawesome.com/c3d727e3de.js"
      ></script>
      <div className="app w-full h-full">
        <Register />
      </div>
    </ThemeProvider>
  </React.StrictMode>
);
