///////////////////////////////////////////////////////////////////////
// ================ GET LOCAL ZONE CONFIG ========================== //
///////////////////////////////////////////////////////////////////////

// Fetches local zone configuration from the admin API

/**
 * Get current local zone configuration
 * @returns {Promise<Object>} The local zone configuration data
 */
const getLocalZoneConfig = async () => {
  try {
    const response = await fetch("/api/admin/freight/local-zone", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch local zone configuration");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching local zone config:", error);
    throw error;
  }
};

export default getLocalZoneConfig;
