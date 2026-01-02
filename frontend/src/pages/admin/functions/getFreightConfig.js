///////////////////////////////////////////////////////////////////////
// ================ GET FREIGHT CONFIG ============================= //
///////////////////////////////////////////////////////////////////////

// Fetches freight configuration from the admin API

/**
 * Get current freight configuration
 * @returns {Promise<Object>} The freight configuration data
 */
const getFreightConfig = async () => {
  try {
    const response = await fetch("/api/admin/freight", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch freight configuration");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching freight config:", error);
    throw error;
  }
};

export default getFreightConfig;
