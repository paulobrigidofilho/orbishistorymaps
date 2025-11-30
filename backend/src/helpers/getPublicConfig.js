//////////////////////////////////////////////////////////
// ===== RETURN PUBLIC CONFIG (SAFE FOR FRONTEND) ===== //
//////////////////////////////////////////////////////////
// Return only a minimal, safe subset of config values that can be
// exposed to the frontend at runtime. Add more keys here only if
// they're safe to publish (no secrets, no DB credentials).

// ======= Module Imports ======= //
const config = require("../config/config");

const normalize = (v) => (v || "").replace(/\/+$/, "");

function getPublicConfig() {
  const root = normalize(config.apiUrl || process.env.VITE_BACKEND_URL || "");
  const apiBase = root
    ? `${root}${root.endsWith("/api") ? "" : "/api"}`
    : "/api";
  return {
    apiRoot: root, // e.g., http://localhost:4000
    apiBase, // e.g., http://localhost:4000/api
  };
}

module.exports = getPublicConfig;
