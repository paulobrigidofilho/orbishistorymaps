////////////////////////////////////////////////////////////////
// ===== FRONTEND HELPER: RESOLVE API BASE URL (cached) ===== //
////////////////////////////////////////////////////////////////

/**
 * Resolve API base URL for frontend at runtime.
 * Order:
 *  1) window.__API_URL__ (server injected)
 *  2) process.env.REACT_APP_API_URL (CRA / build-time)
 *  3) fetch('/config') -> { apiUrl } (backend endpoint)
 *     - If /config returns HTML (dev server), try http://localhost:4000/config
 *  4) fallback to '' (use relative paths)
 *
 * Returns an absolute base URL (no trailing slash) or empty string.
 */

let __cachedApiBase = null;

const tryFetchConfig = async (url) => {
  try {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) return { ok: false };
    // ensure it's JSON (avoid parsing HTML)
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      return { ok: false };
    }
    const json = await res.json();
    return { ok: true, json };
  } catch (err) {
    return { ok: false };
  }
};

const getPublicConfig = async () => {
  if (__cachedApiBase !== null) return __cachedApiBase;

  // 1) window-injected value (server-side injection)
  if (typeof window !== 'undefined' && window.__API_URL__) {
    __cachedApiBase = String(window.__API_URL__).replace(/\/$/, '');
    return __cachedApiBase;
  }

  // 2) build-time env (CRA / many bundlers) - safe guarded
  if (typeof process !== 'undefined' && process && process.env && process.env.REACT_APP_API_URL) {
    __cachedApiBase = String(process.env.REACT_APP_API_URL).replace(/\/$/, '');
    return __cachedApiBase;
  }

  // 3) runtime fetch from backend /config endpoint (same origin)
  // Try '/config' first (works if dev server proxies or backend served at same origin)
  let attempt = await tryFetchConfig('/config');
  if (attempt.ok && attempt.json) {
    __cachedApiBase = attempt.json.apiUrl ? String(attempt.json.apiUrl).replace(/\/$/, '') : '';
    return __cachedApiBase;
  }

  // If dev server served HTML for /config, try backend default localhost:4000
  const fallbackUrl = `${window.location.protocol}//${window.location.hostname}:4000/config`;
  attempt = await tryFetchConfig(fallbackUrl);
  if (attempt.ok && attempt.json) {
    __cachedApiBase = attempt.json.apiUrl ? String(attempt.json.apiUrl).replace(/\/$/, '') : '';
    return __cachedApiBase;
  }

  // 4) fallback: relative paths
  __cachedApiBase = '';
  return __cachedApiBase;
};

export default getPublicConfig;
