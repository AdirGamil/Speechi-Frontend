import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  
  // Development server
  server: { 
    port: 5173,
    // No proxy needed - API URL comes from environment
  },
  
  // Preview server (for testing production builds locally)
  preview: {
    port: 5175,
  },
  
  // Production build
  build: {
    // Output directory
    outDir: "dist",
    // Generate source maps for debugging
    sourcemap: false,
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          gsap: ["gsap"],
        },
      },
    },
  },
  
  // Base URL for assets (relative for flexibility)
  base: "/",
});
