///////////////////////////////////////////////////////////////////////
// =================== WISHLIST MODAL COMPONENT ==================== //
///////////////////////////////////////////////////////////////////////

// Modal showing users who have a product in their wishlist
// Clicking a user navigates to AdminUsers with that user filtered

//  ========== Module imports  ========== //
import React, { useEffect, useState } from "react";
import styles from "./WishlistModal.module.css";

//  ========== Component imports  ========== //
import { CloseBtn } from "../../../btn";

//  ========== Function imports  ========== //
import getWishlistUsers from "../../../functions/getWishlistUsers";

///////////////////////////////////////////////////////////////////////
// ===================== WISHLIST MODAL COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

export default function WishlistModal({
  product,
  isOpen,
  onClose,
  onUserClick,
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (isOpen && product?.product_id) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product?.product_id]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getWishlistUsers(product.product_id);
      setUsers(result.data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching wishlist users:", err);
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ======================= EVENT HANDLERS ========================== //
  ///////////////////////////////////////////////////////////////////////

  const handleUserClick = (user) => {
    onUserClick(user.user_id, user.user_email);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= RENDER GUARD =========================== //
  ///////////////////////////////////////////////////////////////////////

  if (!isOpen || !product) return null;

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2>Wishlist Users</h2>
            <p className={styles.productName}>
              ❤️ {product.product_name}
            </p>
          </div>
          <CloseBtn onClick={onClose} />
        </div>

        {/* Modal Body */}
        <div className={styles.body}>
          {/* Loading State */}
          {loading && (
            <div className={styles.loading}>Loading users...</div>
          )}

          {/* Error State */}
          {error && (
            <div className={styles.error}>{error}</div>
          )}

          {/* Users List */}
          {!loading && !error && users.length > 0 && (
            <div className={styles.usersList}>
              <p className={styles.usersCount}>
                {users.length} user{users.length !== 1 ? "s" : ""} have this product in their wishlist
              </p>
              {users.map((user) => (
                <div
                  key={user.user_id}
                  className={styles.userCard}
                  onClick={() => handleUserClick(user)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleUserClick(user)}
                >
                  <div className={styles.userAvatar}>
                    {user.user_avatar ? (
                      <img
                        src={user.user_avatar}
                        alt={user.user_nickname}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <span className={styles.avatarPlaceholder}>
                        {user.user_nickname?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <span className={styles.userNickname}>
                      {user.user_nickname || `${user.user_firstname} ${user.user_lastname}`}
                    </span>
                    <span className={styles.userEmail}>{user.user_email}</span>
                  </div>
                  <div className={styles.addedDate}>
                    Added {new Date(user.added_at).toLocaleDateString()}
                  </div>
                  <span className={styles.viewIcon}>→</span>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && (
            <div className={styles.emptyState}>
              <p>No users have this product in their wishlist</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={styles.footer}>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
