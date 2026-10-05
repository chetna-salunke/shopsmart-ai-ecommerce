import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import "./index.css";
import "./home.css";
import "./flow.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider><CartProvider><App /></CartProvider></AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
