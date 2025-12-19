import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env": JSON.stringify(env),
    },
    server: {
      host: true,
      port: 3000,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      minify: "esbuild",
      esbuild: {
        drop: ["console", "debugger"],
      },
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: "[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "react-vendor";
            }
            if (id.includes("framer-motion")) {
              return "framer-motion";
            }
            if (
              id.includes("@radix-ui") ||
              id.includes("vaul") ||
              id.includes("sonner") ||
              id.includes("lucide-react") ||
              id.includes("class-variance-authority") ||
              id.includes("clsx")
            ) {
              return "ui-vendor";
            }
            if (id.includes("axios") || id.includes("zustand")) {
              return "utils-vendor";
            }
            return "vendor";
          },
        },
      },
    },
  };
});