///////////////////////////////////////////////////////////////////////
// ================ UPDATE LOCAL ZONE CONFIG ======================= //
///////////////////////////////////////////////////////////////////////

// Updates local zone configuration via the admin API

/**
 * Update local zone configuration
 * @param {Object} data - The local zone configuration data
 * @param {string} data.city - City name for local zone
 * @param {string} data.region - Region/state name
 * @param {string} data.postalPrefixes - Comma-separated postal prefixes
 * @param {string} data.suburbs - Comma-separated suburb names
 * @returns {Promise<Object>} The updated local zone configuration data
 */
const updateLocalZoneConfig = async (data) => {
  try {
    const response = await fetch("/api/admin/freight/local-zone", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update local zone configuration");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error updating local zone config:", error);
    throw error;
  }
};

export default updateLocalZoneConfig;
