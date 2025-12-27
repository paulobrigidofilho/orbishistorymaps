//////////////////////////////////////////////////
// ======= PRODUCT CONTROLLER ================= //
//////////////////////////////////////////////////

// This controller handles product-related HTTP requests

// ======= Module imports ======= //

const { handleServerError } = require("../helpers/handleServerError");
const { PRODUCT_ERRORS } = require("../constants/errorMessages");
const {
  getAllProducts,
  getProductDetails,
  createProduct,
  updateProduct,
} = require("../services/productService");

// ====== Get All Products Function ====== //

const getProducts = async (req, res) => {
  console.log("Get products request received");

  try {
    const filters = {
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search,
      featured: req.query.featured === 'true',
      limit: parseInt(req.query.limit) || 50,
      offset: parseInt(req.query.offset) || 0,
    };

    const products = await getAllProducts(filters);

    return res.status(200).json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return handleServerError(res, error, "getProducts");
  }
};

// ====== Get Product Details Function ====== //

const getProduct = async (req, res) => {
  console.log("Get product details request received");

  try {
    const { identifier } = req.params; // Can be product_id or slug

    const product = await getProductDetails(identifier);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    if (error.message === PRODUCT_ERRORS.NOT_FOUND) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return handleServerError(res, error, "getProduct");
  }
};

// ====== Create Product Function ====== //
// Admin only

const create = async (req, res) => {
  console.log("Create product request received");

  try {
    const productData = req.body;

    const result = await createProduct(productData);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return handleServerError(res, error, "createProduct");
  }
};

// ====== Update Product Function ====== //
// Admin only

const update = async (req, res) => {
  console.log("Update product request received");

  try {
    const { productId } = req.params;
    const productData = req.body;

    const result = await updateProduct(productId, productData);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Update product error:", error);

    if (error.message === PRODUCT_ERRORS.NOT_FOUND) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return handleServerError(res, error, "updateProduct");
  }
};

module.exports = {
  getProducts,
  getProduct,
  create,
  update,
};
