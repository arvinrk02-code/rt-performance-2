import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Pin the workspace root. A stray package-lock.json in the home dir made
     Turbopack infer the parent as the root ("multiple lockfiles" warning);
     our npm scripts always run from the project dir, so cwd is correct. */
  turbopack: {
    root: process.cwd(),
  },
  /* Overridable so a second dev server (browser previews) can run alongside
     the main one — the dev-server lock lives inside the dist dir. */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
