///////////////////////////////////////////////////////////////////////
// ================ UPDATE SETTINGS FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

// Updates multiple site settings at once

/**
 * Updates multiple settings
 * @param {Object} settings - Settings object with key-value pairs
 * @returns {Promise<Object>} Updated settings
 */
const updateSettings = async (settings) => {
  try {
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update settings");
    }

    const result = await response.json();
    return result.data || {};
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

export default updateSettings;
