/////////////////////////////////////////////////////////////
// ===== ROUTE: /config - expose safe runtime config ===== //
/////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const getPublicConfig = require('../helpers/getPublicConfig');

///////////////////////////////////////////////////////////////////////
// ========================= ROUTE HANDLERS ========================= //
///////////////////////////////////////////////////////////////////////

// GET /config
// Returns a small JSON object with safe runtime config values
router.get('/', (req, res) => {
	try {
		const cfg = getPublicConfig();
		return res.json(cfg);
	} catch (err) {
		console.error('Error serving /config:', err);
		return res.status(500).json({ error: 'Failed to read public config' });
	}
});

///////////////////////////////////////////////////////////////////////
// ========================= EXPORT ROUTER ========================= //
///////////////////////////////////////////////////////////////////////

module.exports = router;
