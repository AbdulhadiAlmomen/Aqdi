import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // The embedded Postgres used for local development loads its own WebAssembly files.
  serverExternalPackages: ["@electric-sql/pglite"],
  // Contract PDFs are uploaded one per request; Vercel caps a request body at 4.5 MB.
  experimental: { serverActions: { bodySizeLimit: "4.4mb" } },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
