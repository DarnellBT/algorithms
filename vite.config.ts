import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  plugins: [reactRefresh()],
  server: {
    host: "0.0.0.0",
    hmr: {
      port: 443,
    },
  },
});
