///////////////////////////////////////////////////////////////////////
// ======================= PRODUCT SERVICE =========================== //
///////////////////////////////////////////////////////////////////////

// This service handles all product-related API requests

//  ========== Module imports  ========== //
import axios from "axios";
import { SHOP_ENDPOINTS } from "../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// ======================= GET ALL PRODUCTS ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Fetches all products with optional filters
 * @param {Object} filters - Query parameters for filtering products
 * @param {string} filters.category - Filter by category slug
 * @param {number} filters.minPrice - Minimum price filter
 * @param {number} filters.maxPrice - Maximum price filter
 * @param {string} filters.search - Search term
 * @param {boolean} filters.featured - Filter featured products only
 * @param {number} filters.limit - Number of products to return
 * @param {number} filters.offset - Offset for pagination
 * @returns {Promise<Object>} Products array and metadata
 */
export const getAllProducts = async (filters = {}) => {
  try {
    const response = await axios.get(SHOP_ENDPOINTS.GET_PRODUCTS, {
      params: filters,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

///////////////////////////////////////////////////////////////////////
// ======================= GET PRODUCT DETAILS ======================= //
///////////////////////////////////////////////////////////////////////

/**
 * Fetches a single product by ID or slug
 * @param {string} identifier - Product ID (UUID) or slug
 * @returns {Promise<Object>} Product details with images
 */
export const getProductDetails = async (identifier) => {
  try {
    const response = await axios.get(SHOP_ENDPOINTS.GET_PRODUCT(identifier), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch product details"
    );
  }
};
