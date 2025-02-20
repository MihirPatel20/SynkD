import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  define: {
    "process.env": {},
  },
  plugins: [react()],
  server: {
    host: true, // allows external devices to access the server
    port: 3000,
  },
});
