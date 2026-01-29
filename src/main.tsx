import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/lib/gsap";
import App from "./App";
import "./index.css";
import "./app/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
