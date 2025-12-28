///////////////////////////////////////////////////////////////////////
// ================= ADMIN CATEGORY CONTROLLER ======================= //
///////////////////////////////////////////////////////////////////////

// This controller handles admin category operations

///////////////////////////////////////////////////////////////////////
// ======================= GET ALL CATEGORIES ======================== //
///////////////////////////////////////////////////////////////////////

const getAllCategories = (req, res) => {
  const db = require("../config/config").db;
  
  const query = `
    SELECT 
      category_id, 
      category_name, 
      category_description,
      parent_category_id,
      is_active
    FROM product_categories
    WHERE is_active = TRUE
    ORDER BY category_name ASC
  `;

  db.query(query, (err, categories) => {
    if (err) {
      console.error("[adminCategoryController] Error fetching categories:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch categories" 
      });
    }

    res.json({
      success: true,
      data: categories,
    });
  });
};

///////////////////////////////////////////////////////////////////////
// ======================= MODULE EXPORTS ============================ //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getAllCategories,
};
