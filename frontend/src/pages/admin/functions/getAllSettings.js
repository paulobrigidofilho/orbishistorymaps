///////////////////////////////////////////////////////////////////////
// ================ GET ALL SETTINGS FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

// Fetches all site settings from admin API

/**
 * Fetches all site settings
 * @returns {Promise<Object>} Settings object with key-value pairs
 */
const getAllSettings = async () => {
  try {
    const response = await fetch("/api/admin/settings", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch settings");
    }

    const result = await response.json();
    return result.data || {};
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

export default getAllSettings;
