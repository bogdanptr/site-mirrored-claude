import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import { loadEnv } from "vite";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV || "development",
  process.cwd(),
  ""
);

export default defineConfig({
  output: "static",
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || "production",
      // Pull the latest content at build time rather than the cached CDN copy.
      useCdn: false,
      // Mounts the embedded Sanity Studio at /studio.
      studioBasePath: "/studio",
    }),
    react(),
  ],
});
