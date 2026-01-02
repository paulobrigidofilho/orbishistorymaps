///////////////////////////////////////////////////////////////////////
// ================ SET MAINTENANCE MODE FUNCTION ================== //
///////////////////////////////////////////////////////////////////////

// Sets the site maintenance mode

/**
 * Sets maintenance mode
 * @param {string} mode - Maintenance mode: 'off', 'site-wide', 'shop-only', 'registration-only'
 * @param {string} message - Optional custom message
 * @returns {Promise<Object>} Updated maintenance status
 */
const setMaintenanceMode = async (mode, message = null) => {
  try {
    const body = { mode };
    if (message !== null) {
      body.message = message;
    }

    const response = await fetch("/api/admin/settings/maintenance", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to set maintenance mode");
    }

    const result = await response.json();
    return result.data || {};
  } catch (error) {
    console.error("Error setting maintenance mode:", error);
    throw error;
  }
};

export default setMaintenanceMode;
