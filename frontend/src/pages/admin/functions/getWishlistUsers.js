///////////////////////////////////////////////////////////////////////
// ============== GET WISHLIST USERS FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

// Fetches list of users who have a specific product in their wishlist

/**
 * Fetches all users who have a product in their wishlist
 * @param {string} productId - The product's ID
 * @returns {Promise<Object>} { data: [] }
 */
const getWishlistUsers = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  try {
    const response = await fetch(`/api/admin/wishlists/${productId}/users`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch wishlist users");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching wishlist users:", error);
    throw error;
  }
};

export default getWishlistUsers;
