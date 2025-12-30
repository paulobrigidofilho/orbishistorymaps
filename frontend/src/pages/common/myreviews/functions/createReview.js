///////////////////////////////////////////////////////////////////////
// =================== CREATE REVIEW ================================ //
///////////////////////////////////////////////////////////////////////

export default async function createReview(productId, rating, comment) {
  const res = await fetch(`/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Ensure session cookies are sent
    body: JSON.stringify({
      product_id: productId,
      rating,
      review_title: "Review", // You can update this to use a real title if needed
      review_text: comment
    }),
  });
  return res.json();
}
