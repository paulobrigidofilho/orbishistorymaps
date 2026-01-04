///////////////////////////////////////////////////////////////////////
// ================= ADMIN CATEGORY CONTROLLER ======================= //
///////////////////////////////////////////////////////////////////////

// This controller handles admin category operations using Sequelize

// ======= Model Imports ======= //
const { ProductCategory } = require("../models");

///////////////////////////////////////////////////////////////////////
// ======================= GET ALL CATEGORIES ======================== //
///////////////////////////////////////////////////////////////////////

const getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.findAll({
      where: { is_active: true },
      attributes: [
        "category_id",
        "category_name",
        "category_description",
        "parent_category_id",
        "is_active",
      ],
      order: [["category_name", "ASC"]],
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("[adminCategoryController] Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

///////////////////////////////////////////////////////////////////////
// ======================= MODULE EXPORTS ============================ //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getAllCategories,
};
