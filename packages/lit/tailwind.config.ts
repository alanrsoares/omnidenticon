import daisyui from "daisyui";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,ts}", "./index.html"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
} satisfies Config;
