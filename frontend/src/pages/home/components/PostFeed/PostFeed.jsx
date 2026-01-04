///////////////////////////////////////////////////////////////////////
// ================== POST FEED COMPONENT ============================ //
///////////////////////////////////////////////////////////////////////

// This component displays a feed of the latest published posts

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./PostFeed.module.css";

//  ========== Function imports  ========== //
import { fetchPublishedPosts } from "./functions/fetchPublishedPosts";
import { incrementViewCount } from "./functions/incrementViewCount";

//  ========== Helper imports  ========== //
import { formatPostDate } from "./helpers/formatPostDate";
import { truncateText } from "./helpers/truncateText";
import { calculateReadTime } from "./helpers/calculateReadTime";

//  ========== Constants imports  ========== //
import {
  POST_FEED_SETTINGS,
  POST_FEED_LABELS,
  POST_PLACEHOLDER_IMAGE,
} from "./constants/postFeedConstants";

///////////////////////////////////////////////////////////////////////
// ====================== POST FEED COMPONENT ======================== //
///////////////////////////////////////////////////////////////////////

export default function PostFeed() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [expandedPost, setExpandedPost] = useState(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    loadInitialPosts();
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const loadInitialPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPublishedPosts({
        page: 1,
        limit: POST_FEED_SETTINGS.INITIAL_POSTS,
      });
      setPosts(data.posts || []);
      setPagination({
        page: 1,
        totalPages: data.pagination?.totalPages || 1,
        total: data.pagination?.total || 0,
      });
    } catch (err) {
      setError(POST_FEED_LABELS.ERROR_LOADING);
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || pagination.page >= pagination.totalPages) return;

    try {
      setLoadingMore(true);
      const nextPage = pagination.page + 1;
      const data = await fetchPublishedPosts({
        page: nextPage,
        limit: POST_FEED_SETTINGS.POSTS_PER_LOAD,
      });
      setPosts((prev) => [...prev, ...(data.posts || [])]);
      setPagination((prev) => ({
        ...prev,
        page: nextPage,
        totalPages: data.pagination?.totalPages || prev.totalPages,
      }));
    } catch (err) {
      console.error("Error loading more posts:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePostClick = async (post) => {
    // Toggle expanded state
    if (expandedPost === post.post_id) {
      setExpandedPost(null);
    } else {
      setExpandedPost(post.post_id);
      // Increment view count when post is expanded
      try {
        await incrementViewCount(post.post_id);
        // Update local state to reflect the new view count
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.post_id === post.post_id
              ? { ...p, post_view_count: (p.post_view_count || 0) + 1 }
              : p
          )
        );
      } catch (err) {
        console.error("Error incrementing view count:", err);
      }
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return POST_PLACEHOLDER_IMAGE;
    if (imageUrl.startsWith("http")) return imageUrl;
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    return `${baseUrl}${imageUrl}`;
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  // Loading state
  if (loading) {
    return (
      <section className={styles.postFeedSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{POST_FEED_LABELS.SECTION_TITLE}</h2>
          <p className={styles.sectionSubtitle}>{POST_FEED_LABELS.SECTION_SUBTITLE}</p>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>{POST_FEED_LABELS.LOADING}</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className={styles.postFeedSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{POST_FEED_LABELS.SECTION_TITLE}</h2>
        </div>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.retryButton} onClick={loadInitialPosts}>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // No posts state
  if (posts.length === 0) {
    return (
      <section className={styles.postFeedSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{POST_FEED_LABELS.SECTION_TITLE}</h2>
          <p className={styles.sectionSubtitle}>{POST_FEED_LABELS.SECTION_SUBTITLE}</p>
        </div>
        <div className={styles.emptyContainer}>
          <p>{POST_FEED_LABELS.NO_POSTS}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.postFeedSection}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{POST_FEED_LABELS.SECTION_TITLE}</h2>
        <p className={styles.sectionSubtitle}>{POST_FEED_LABELS.SECTION_SUBTITLE}</p>
      </div>

      {/* Posts Grid */}
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <article
            key={post.post_id}
            className={`${styles.postCard} ${
              expandedPost === post.post_id ? styles.expanded : ""
            }`}
            onClick={() => handlePostClick(post)}
          >
            {/* Post Image */}
            {post.post_image_url && (
              <div className={styles.postImageContainer}>
                <img
                  src={getImageUrl(post.post_image_url)}
                  alt={post.post_title}
                  className={styles.postImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = POST_PLACEHOLDER_IMAGE;
                  }}
                />
              </div>
            )}

            {/* Post Content */}
            <div className={styles.postContent}>
              {/* Post Meta */}
              <div className={styles.postMeta}>
                <span className={styles.postDate}>
                  {formatPostDate(post.post_publish_date || post.created_at)}
                </span>
                <span className={styles.metaSeparator}>•</span>
                <span className={styles.readTime}>
                  {calculateReadTime(post.post_content)} {POST_FEED_LABELS.READ_TIME}
                </span>
              </div>

              {/* Post Title */}
              <h3 className={styles.postTitle}>{post.post_title}</h3>

              {/* Post Excerpt / Full Content */}
              <div className={styles.postBody}>
                {expandedPost === post.post_id ? (
                  <div className={styles.fullContent}>
                    <ReactMarkdown>{post.post_content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className={styles.postExcerpt}>
                    {post.post_excerpt || truncateText(post.post_content, 150)}
                  </p>
                )}
              </div>

              {/* Post Footer */}
              <div className={styles.postFooter}>
                <span className={styles.viewCount}>
                  👁️ {post.post_view_count || 0} {POST_FEED_LABELS.VIEWS}
                </span>
                <span className={styles.readMoreLink}>
                  {expandedPost === post.post_id
                    ? "Show Less"
                    : POST_FEED_LABELS.READ_MORE}{" "}
                  {expandedPost === post.post_id ? "↑" : "→"}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      {pagination.page < pagination.totalPages && (
        <div className={styles.loadMoreContainer}>
          <button
            className={styles.loadMoreButton}
            onClick={loadMorePosts}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <span className={styles.smallSpinner}></span>
                Loading...
              </>
            ) : (
              POST_FEED_LABELS.LOAD_MORE
            )}
          </button>
        </div>
      )}
    </section>
  );
}
