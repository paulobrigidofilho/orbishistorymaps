////////////////////////////////////////////////////////////////
// ===== FRONTEND HELPER: RESOLVE API BASE URL (cached) ===== //
////////////////////////////////////////////////////////////////

/**
 * Resolve API base URL for frontend at runtime.
 * Order:
 *  1) window.__API_URL__ (server injected)
 *  2) process.env.REACT_APP_API_URL (CRA / build-time)
 *  3) fetch('/config') -> { apiUrl } (backend endpoint)
 *  4) fallback to '' (use relative paths)
 *
 * Returns an absolute base URL (no trailing slash) or empty string.
 */

let __cachedApiBase = null;

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
  try {
    const res = await fetch('/config');
    if (res.ok) {
      const json = await res.json();
      __cachedApiBase = json && json.apiUrl ? String(json.apiUrl).replace(/\/$/, '') : '';
      return __cachedApiBase;
    }
  } catch (err) {
    // ignore and fallback to relative
    // eslint-disable-next-line no-console
    console.warn('getPublicConfig: failed to fetch /config', err);
  }

  // 4) fallback: relative paths
  __cachedApiBase = '';
  return __cachedApiBase;
};

export default getPublicConfig;
