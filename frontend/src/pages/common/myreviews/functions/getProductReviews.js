///////////////////////////////////////////////////////////////////////
// =================== GET PRODUCT REVIEWS ========================== //
///////////////////////////////////////////////////////////////////////

export default async function getProductReviews(productId) {
  const res = await fetch(`/api/reviews/product/${productId}`);
  return res.json();
}
