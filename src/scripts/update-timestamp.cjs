/* scripts/update-timestamp.js */
const fs = require("fs");
const path = require("path");

const file = process.argv[2];
if (!file) {
  console.error("[update-timestamp] No file passed.");
  process.exit(1);
}

const fullPath = path.resolve(file);
let json;
try {
  const raw = fs.readFileSync(fullPath, "utf8");
  json = JSON.parse(raw);
} catch (e) {
  console.error("[update-timestamp] Failed to read/parse:", fullPath, e.message);
  process.exit(1);
}

// Only touch menu files that have restaurant metadata
if (!json?.restaurant) {
  console.log("[update-timestamp] Skipped (no .restaurant):", fullPath);
  process.exit(0);
}

const now = new Date().toISOString();

// Prevent infinite save loop: only write if changed
if (json.restaurant.updatedAt === now) {
  console.log("[update-timestamp] No change:", fullPath);
  process.exit(0);
}

json.restaurant.updatedAt = now;

try {
  fs.writeFileSync(fullPath, JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log("[update-timestamp] Updated:", fullPath, "→", now);
} catch (e) {
  console.error("[update-timestamp] Failed to write:", fullPath, e.message);
  process.exit(1);
}
