///////////////////////////////////////////////////////////////////////
// =============== HANDLE QUANTITY CHANGE FUNCTION =================== //
///////////////////////////////////////////////////////////////////////

// This function handles quantity changes for product detail page

///////////////////////////////////////////////////////////////////////
// ================= HANDLE QUANTITY CHANGE ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Handle quantity change with stock validation
 * @param {number} currentQuantity - Current quantity value
 * @param {number} change - Change amount (+1 or -1)
 * @param {number} maxAvailable - Maximum available stock
 * @param {Function} setQuantity - State setter function
 */
export default function handleQuantityChange(currentQuantity, change, maxAvailable, setQuantity) {
  const newQuantity = currentQuantity + change;
  if (newQuantity >= 1 && newQuantity <= maxAvailable) {
    setQuantity(newQuantity);
  }
}
