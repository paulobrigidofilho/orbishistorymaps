///////////////////////////////////////////////////////////////////////
// ============== GET WISHLIST STATS FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

// Fetches overall wishlist statistics for admin dashboard

/**
 * Fetches wishlist statistics
 * @returns {Promise<Object>} { data: { total_wishlist_items, products_wishlisted, users_with_wishlists } }
 */
const getWishlistStats = async () => {
  try {
    const response = await fetch("/api/admin/wishlists/stats", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch wishlist stats");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching wishlist stats:", error);
    throw error;
  }
};

export default getWishlistStats;
