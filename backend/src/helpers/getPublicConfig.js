//////////////////////////////////////////////////////////////////
// ===== HELPER: RETURN PUBLIC CONFIG (SAFE FOR FRONTEND) ===== //
//////////////////////////////////////////////////////////////////

const config = require('../config/config');

///////////////////////////////////////////////////////////////////////
// ========================= PUBLIC CONFIG ========================= //
// Return only a minimal, safe subset of config values that can be
// exposed to the frontend at runtime. Add more keys here only if
// they're safe to publish (no secrets, no DB credentials).
///////////////////////////////////////////////////////////////////////

function getPublicConfig() {
	return {
		apiUrl: config.apiUrl || '',
	};
}

module.exports = getPublicConfig;
