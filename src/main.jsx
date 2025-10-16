import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/Theme.context.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./styles/Theme.css"

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID_HERE">
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
