import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Optional, only if needed
import App from "./App.jsx";

// Get the root element
const rootElement = document.getElementById("root");


// Check if the element exists before rendering
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("Failed to find the root element. Make sure #root is present in index.html.");
}
