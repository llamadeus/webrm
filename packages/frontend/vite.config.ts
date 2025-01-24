import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import { fileURLToPath, URL } from "node:url";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  build: {
    target: "esnext",
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
