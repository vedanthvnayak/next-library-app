import { loadEnvConfig } from "@next/env";
const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Ensure this code only runs on the server side
if (typeof window === "undefined") {
  const fs = require("fs");
  // ... rest of your server-side code using fs
}
