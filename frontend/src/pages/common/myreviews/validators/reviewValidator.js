///////////////////////////////////////////////////////////////////////
// =================== REVIEW VALIDATOR (SIMPLE) =================== //
///////////////////////////////////////////////////////////////////////

export function validateReview(rating, comment) {
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5.";
  }
  if (!comment || typeof comment !== 'string' || comment.trim().length < 3 || comment.length > 1000) {
    return "Comment must be between 3 and 1000 characters.";
  }
  return null;
}
