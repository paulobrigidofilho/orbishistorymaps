///////////////////////////////////////////////////////////////////////
// ================== GET POST VISUAL STATUS HELPER ================== //
///////////////////////////////////////////////////////////////////////

// This helper determines the visual status of a post for UI display
// Distinguishes between Draft, Scheduled (future published), and Published

/**
 * Determines the visual status of a post for UI rendering
 * 
 * @param {Object} post - The post object
 * @param {string} post.post_status - The post's database status ("draft" | "published")
 * @param {string|Date} post.post_publish_date - The scheduled publish date
 * @returns {string} The visual status: "draft", "scheduled", or "published"
 * 
 * @example
 * // Draft post
 * getPostVisualStatus({ post_status: "draft", post_publish_date: null })
 * // Returns: "draft"
 * 
 * @example
 * // Scheduled post (published status but future date)
 * getPostVisualStatus({ post_status: "published", post_publish_date: "2026-12-25" })
 * // Returns: "scheduled"
 * 
 * @example
 * // Published post (published status and past/current date)
 * getPostVisualStatus({ post_status: "published", post_publish_date: "2026-01-01" })
 * // Returns: "published"
 */
export const getPostVisualStatus = (post) => {
  // If status is draft, always return draft
  if (post.post_status === "draft") {
    return "draft";
  }

  // If status is published, check the date
  if (post.post_status === "published") {
    // If no publish date set, treat as published
    if (!post.post_publish_date) {
      return "published";
    }

    // Compare publish date with current date
    const publishDate = new Date(post.post_publish_date);
    const now = new Date();

    // If publish date is in the future, it's scheduled
    if (publishDate > now) {
      return "scheduled";
    }

    // Otherwise it's published
    return "published";
  }

  // Fallback to draft for any unexpected status
  return "draft";
};

export default getPostVisualStatus;
