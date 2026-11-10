import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    // Each test file starts its own in-memory Postgres; argon2 hashing is deliberately slow.
    testTimeout: 30_000,
  },
});
