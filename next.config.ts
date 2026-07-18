import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Overridable so a second dev server (browser previews) can run alongside
     the main one — the dev-server lock lives inside the dist dir. */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
