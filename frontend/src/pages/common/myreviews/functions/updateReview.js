///////////////////////////////////////////////////////////////////////
// =================== UPDATE REVIEW ================================ //
///////////////////////////////////////////////////////////////////////

export default async function updateReview(reviewId, rating, comment) {
  const res = await fetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating, comment }),
  });
  return res.json();
}
