import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.jsx";
import StoreContextProvider from "./context/StoreContext.jsx";
import "./index.css";

const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
const hasGoogleClientId = googleClientId.length > 0;

ReactDOM.createRoot(document.getElementById("root")).render(
  hasGoogleClientId ? (
  <GoogleOAuthProvider clientId={googleClientId}>
    <BrowserRouter>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
  ) : (
    <BrowserRouter>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </BrowserRouter>
  )
);
