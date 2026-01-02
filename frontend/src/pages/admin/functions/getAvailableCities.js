///////////////////////////////////////////////////////////////////////
// ================ GET AVAILABLE CITIES =========================== //
///////////////////////////////////////////////////////////////////////

// Fetches available North Island cities for local zone from the admin API

/**
 * Get available North Island cities that can be set as local zone
 * @returns {Promise<Object>} The available cities data
 */
const getAvailableCities = async () => {
  try {
    const response = await fetch("/api/admin/freight/available-cities", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch available cities");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching available cities:", error);
    throw error;
  }
};

export default getAvailableCities;
