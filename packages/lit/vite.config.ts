import { compileLitTemplates } from "@lit-labs/compiler";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript, { TransformerFactory } from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: "./src/omnidenticon.ts",
      name: "Omnidenticon",
      fileName: (format, file) => `${file}.${format === "es" ? "js" : format}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      plugins: [
        replace({
          "Reflect.decorate": "undefined",
          preventAssignment: true,
        }),
        resolve(),
        typescript({
          transformers: {
            before: [compileLitTemplates() as TransformerFactory<"before">],
          },
        }),
        /**
         * This minification setup serves the static site generation.
         * For bundling and minification, check the README.md file.
         */
        terser({
          ecma: 2020,
          module: true,
          mangle: {
            properties: {
              regex: /^__/,
            },
          },
        }),
      ],
    },
    cssMinify: true,
  },
  resolve: {
    alias: {
      "~": new URL("./src", import.meta.url).pathname,
    },
  },
});
