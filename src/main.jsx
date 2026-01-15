/**
 * File: main.jsx
 * Purpose:
 * - Application entry point
 * - Bootstraps React and mounts the app to the DOM
 *
 * Flow:
 * - Creates React root
 * - Wraps App with essential global providers:
 *   - Redux store (state management)
 *   - React Router (routing)
 *   - Theme context (dark/light mode)
 *   - Toast provider (global notifications)
 *
 * Why this file exists:
 * - Centralized place for all global providers
 * - Keeps App.jsx focused only on application logic
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastProvider } from "@/components";
import App from "./App";
import { store, ThemeProvider } from "@/core";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);