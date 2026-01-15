// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//     },
//   },
// });












import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ✅ Testing Configuration Added
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.js", // Ensure this file exists for Jest-DOM matchers
    css: true,
  },
});