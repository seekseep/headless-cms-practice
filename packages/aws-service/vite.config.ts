import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "aws-service",
      fileName: "aws-service",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "core",
        /^@aws-sdk\//,
        /^@smithy\//,
        "aws-jwt-verify",
      ],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
