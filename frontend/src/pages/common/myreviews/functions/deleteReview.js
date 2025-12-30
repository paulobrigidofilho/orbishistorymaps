///////////////////////////////////////////////////////////////////////
// =================== DELETE REVIEW ================================ //
///////////////////////////////////////////////////////////////////////

export default async function deleteReview(reviewId) {
  const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
  return res.json();
}
