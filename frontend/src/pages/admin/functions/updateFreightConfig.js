///////////////////////////////////////////////////////////////////////
// ================ UPDATE FREIGHT CONFIG ========================== //
///////////////////////////////////////////////////////////////////////

// Updates freight configuration via the admin API

/**
 * Update freight configuration
 * @param {Object} config - The freight configuration to update
 * @returns {Promise<Object>} The updated freight configuration
 */
const updateFreightConfig = async (config) => {
  try {
    const response = await fetch("/api/admin/freight", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update freight configuration");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error updating freight config:", error);
    throw error;
  }
};

export default updateFreightConfig;
