import React from "react";
import ReactDOM from "react-dom/client";
import App from "pages/App";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
