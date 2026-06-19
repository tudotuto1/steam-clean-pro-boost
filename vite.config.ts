import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Standard TanStack Start + Vite config (no Lovable wrapper).
// - tsConfigPaths provides the `@` -> ./src alias from tsconfig.json.
// - tanstackStart keeps src/server.ts as the SSR entry (resolved from src/).
// - nitro targets Vercel and emits the Build Output API (.vercel/output).
export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro({ preset: "vercel" }),
    viteReact(),
  ],
});
