///////////////////////////////////////////////////////////////////////
// =================== GET ALL WISHLISTS FUNCTION =================== //
///////////////////////////////////////////////////////////////////////

// Fetches paginated list of products with wishlist counts from admin API

/**
 * Fetches all products with wishlist counts for admin management
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.search - Search term
 * @param {string} options.sortBy - Sort field (default: wishlist_count)
 * @param {string} options.sortOrder - Sort order (default: desc)
 * @returns {Promise<Object>} { data: [], pagination: {} }
 */
const getAllWishlists = async (options = {}) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    sortBy = "wishlist_count",
    sortOrder = "desc",
  } = options;

  // Build query string
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
  });

  if (search) {
    params.append("search", search);
  }

  try {
    const response = await fetch(`/api/admin/wishlists?${params.toString()}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch wishlists";
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        // Response body is not JSON or empty
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    throw error;
  }
};

export default getAllWishlists;
