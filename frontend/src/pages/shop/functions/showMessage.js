///////////////////////////////////////////////////////////////////////
// ====================== SHOW MESSAGE HELPER ======================== //
///////////////////////////////////////////////////////////////////////

// This helper function displays temporary messages

///////////////////////////////////////////////////////////////////////
// ====================== SHOW MESSAGE FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

/**
 * Display a temporary message
 * @param {string} text - Message text
 * @param {string} type - Message type ('success' or 'error')
 * @param {Function} setMessage - Message state setter
 * @param {number} duration - Display duration in ms (default: 3000)
 */
export default function showMessage(text, type, setMessage, duration = 3000) {
  setMessage({ text, type });
  setTimeout(() => setMessage(null), duration);
}
