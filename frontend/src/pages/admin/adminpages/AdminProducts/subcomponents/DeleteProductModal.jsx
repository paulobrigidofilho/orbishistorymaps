///////////////////////////////////////////////////////////////////////
// ================= DELETE PRODUCT MODAL COMPONENT ================ //
///////////////////////////////////////////////////////////////////////

// This component displays a confirmation dialog before deleting a product

//  ========== Module imports  ========== //
import React from "react";
import styles from "./DeleteProductModal.module.css";

///////////////////////////////////////////////////////////////////////
// =================== DELETE PRODUCT MODAL ========================== //
///////////////////////////////////////////////////////////////////////

export default function DeleteProductModal({ product, isOpen, onClose, onConfirm, isDeleting }) {
  ///////////////////////////////////////////////////////////////////////
  // ======================= EARLY RETURN ============================= //
  ///////////////////////////////////////////////////////////////////////

  if (!isOpen || !product) return null;

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2>Delete Product</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          <div className={styles.warningIcon}>⚠️</div>
          <p className={styles.warningText}>
            Do you really want to delete this product?
          </p>
          <div className={styles.productInfo}>
            <strong>{product.product_name}</strong>
            <br />
            <span>SKU: {product.sku || "N/A"}</span>
            <br />
            <span>Price: ${product.price}</span>
          </div>
          <p className={styles.warningDetails}>
            This will permanently remove the product and:
          </p>
          <ul className={styles.deletionList}>
            <li>All product images</li>
            <li>Inventory records</li>
            <li>Product from any active carts</li>
          </ul>
          <p className={styles.irreversibleWarning}>
            This action cannot be undone.
          </p>
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => onConfirm(product.product_id)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
