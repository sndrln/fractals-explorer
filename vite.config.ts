import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

// https://vite.dev/config/
export default defineConfig({
  base: "/fractals-explorer",
  plugins: [vue(), glsl()],
  server: {
    port: 3000,
  },
});
