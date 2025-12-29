///////////////////////////////////////////////////////////////////////
// ============= NOTIFICATION SYSTEM DOCUMENTATION =================== //
///////////////////////////////////////////////////////////////////////

/**
 * DOCUMENT PURPOSE:
 * Complete guide to the FadeNotification component - a reusable notification
 * system used throughout the application for user feedback.
 * 
 * COMPONENT: FadeNotification.jsx
 * LAST UPDATED: December 29, 2025
 * VERSION: 1.0
 */

---

## 📋 Overview

The **FadeNotification** component is a reusable, animated notification popup that provides instant user feedback. It automatically appears, displays a message, and fades away after a configurable duration.

**Key Features:**
- 🎨 Three type variants: `success`, `error`, `info`
- 📍 Three position variants: `right`, `top`, `bottom`
- ⏱️ Auto-dismiss with fade animation
- 🎭 Material Icons support
- 🔧 Fully customizable duration
- ♻️ Reusable across the application

---

## 📁 File Location

```
frontend/src/pages/common/components/
├── FadeNotification.jsx
└── FadeNotification.module.css
```

---

## 🎯 Component API

### Props

```typescript
interface FadeNotificationProps {
  type?: 'success' | 'error' | 'info';  // Default: 'success'
  text: string;                          // Required - Message to display
  icon?: string;                         // Optional - Material icon name
  duration?: number;                     // Default: 2000ms (2 seconds)
  fadeDuration?: number;                 // Default: 500ms
  position?: 'right' | 'top' | 'bottom'; // Default: 'right'
  onComplete?: () => void;               // Callback when notification removed
}
```

### Default Icon Mapping

If no `icon` prop is provided, defaults are:
- `type="success"` → `check_circle` icon
- `type="error"` → `error` icon
- `type="info"` → `info` icon

---

## 🎨 Visual Styles

### Type Variants

**Success (Green):**
```css
background: linear-gradient(135deg, #4caf50, #388e3c);
color: white;
```

**Error (Red):**
```css
background: linear-gradient(135deg, #f44336, #d32f2f);
color: white;
```

**Info (Blue):**
```css
background: linear-gradient(135deg, #2196f3, #1976d2);
color: white;
```

### Position Variants

**Right (Default):**
- Positioned to the right of parent
- Slides in from right
- Common for buttons and actions

**Top:**
- Positioned above parent
- Slides down from top
- Ideal for cart items and lists

**Bottom:**
- Positioned below parent
- Slides up from bottom
- Good for form submissions

---

## 💻 Usage Examples

### Example 1: ProductDetail.jsx (Right Position)

```jsx
import FadeNotification from "../common/components/FadeNotification";

const [notification, setNotification] = useState(null);

// Trigger notification
const addProductToCart = async () => {
  try {
    await addToCart(product.product_id, quantity);
    setNotification({ 
      type: "success", 
      text: "Added to Cart!", 
      icon: "shopping_cart" 
    });
  } catch (err) {
    setNotification({ 
      type: "error", 
      text: err.message, 
      icon: "error" 
    });
  }
};

// Clear notification callback
const clearNotification = () => {
  setNotification(null);
};

// Render
return (
  <div className={styles.purchaseSection}>
    <AddToCartBtn onClick={addProductToCart} />
    
    {notification && (
      <FadeNotification
        type={notification.type}
        text={notification.text}
        icon={notification.icon}
        position="right"
        onComplete={clearNotification}
      />
    )}
  </div>
);
```

### Example 2: WishlistItem.jsx (Top Position)

```jsx
const [notification, setNotification] = useState(null);

const handleAddToCart = async () => {
  try {
    await addToCart(item.product_id, 1);
    setNotification({ 
      text: "Added to Cart!", 
      type: "success", 
      icon: "shopping_cart" 
    });
  } catch (err) {
    setNotification({ 
      text: err.message, 
      type: "error", 
      icon: "error" 
    });
  }
};

return (
  <div className={styles.wishlistItem}>
    <AddToCartBtn onClick={handleAddToCart} />
    
    {notification && (
      <FadeNotification
        type={notification.type}
        text={notification.text}
        icon={notification.icon}
        position="top"
        onComplete={() => setNotification(null)}
      />
    )}
  </div>
);
```

### Example 3: WishlistToggleBtn.jsx (Right Position)

```jsx
const [notification, setNotification] = useState(null);

const showNotification = (type, text, icon) => {
  setNotification({ type, text, icon });
};

const handleToggleWishlist = async () => {
  try {
    if (isInWishlist) {
      await removeFromWishlist(productId);
      showNotification("success", "Removed from Wishlist", "favorite_border");
    } else {
      await addToWishlist(productId);
      showNotification("success", "Added to Wishlist", "favorite");
    }
  } catch (error) {
    showNotification("error", error.message, "error");
  }
};

return (
  <div className={styles.wishlistToggleBtnContainer}>
    <button onClick={handleToggleWishlist}>
      <i className="material-icons">favorite</i>
    </button>
    
    {notification && (
      <FadeNotification
        type={notification.type}
        text={notification.text}
        icon={notification.icon}
        position="right"
        onComplete={() => setNotification(null)}
      />
    )}
  </div>
);
```

### Example 4: Custom Duration

```jsx
<FadeNotification
  type="info"
  text="Processing your request..."
  icon="hourglass_empty"
  position="top"
  duration={3000}          // Show for 3 seconds
  fadeDuration={800}       // Fade out over 800ms
  onComplete={handleComplete}
/>
```

---

## 🔧 Component Implementation

### State Management

```jsx
const [isFadingOut, setIsFadingOut] = useState(false);
const [isVisible, setIsVisible] = useState(true);
```

### Effect Hook (Auto-dismiss)

```jsx
useEffect(() => {
  // Start fade out after duration
  const fadeTimer = setTimeout(() => {
    setIsFadingOut(true);
  }, duration);

  // Remove notification after fade completes
  const removeTimer = setTimeout(() => {
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  }, duration + fadeDuration);

  return () => {
    clearTimeout(fadeTimer);
    clearTimeout(removeTimer);
  };
}, [duration, fadeDuration, onComplete]);
```

### Render Logic

```jsx
if (!isVisible) return null;

return (
  <div className={`
    ${styles.notification}
    ${styles[type]}
    ${styles[position]}
    ${isFadingOut ? styles.fadeOut : ""}
  `}>
    {displayIcon && (
      <i className="material-icons">{displayIcon}</i>
    )}
    <span>{text}</span>
  </div>
);
```

---

## 🎭 Animation Details

### Fade In (Initial Appearance)

**Right Position:**
```css
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}
```

**Top Position:**
```css
@keyframes fadeInTop {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
```

**Bottom Position:**
```css
@keyframes fadeInBottom {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
```

### Fade Out (Exit Animation)

```css
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

---

## 📐 Position Layouts

### Right Position (Default)

```css
.notification.right {
  position: absolute;
  top: 50%;
  left: calc(100% + 12px);
  transform: translateY(-50%);
  animation: fadeInRight 0.3s ease;
}
```

**Use Cases:**
- Buttons (Add to Cart, Wishlist Toggle)
- Action confirmations
- Inline feedback

**Parent Container Requirements:**
```css
.parentContainer {
  position: relative;  /* Required for absolute positioning */
}
```

### Top Position

```css
.notification.top {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  animation: fadeInTop 0.3s ease;
}
```

**Use Cases:**
- List items (Cart items, Wishlist items)
- Card actions
- Grid item feedback

### Bottom Position

```css
.notification.bottom {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  animation: fadeInBottom 0.3s ease;
}
```

**Use Cases:**
- Form submissions
- Input field feedback
- Footer actions

---

## 🌐 Usage Throughout Application

### Current Implementations

| Component | Position | Type | Message |
|-----------|----------|------|---------|
| ProductDetail.jsx | `right` | `success` | "Added to Cart!" |
| ProductDetail.jsx | `right` | `error` | Error message |
| WishlistToggleBtn.jsx | `right` | `success` | "Added to Wishlist" |
| WishlistToggleBtn.jsx | `right` | `success` | "Removed from Wishlist" |
| WishlistToggleBtn.jsx | `right` | `error` | "Please login to use wishlist" |
| WishlistItem.jsx | `top` | `success` | "Added to Cart!" |
| WishlistItem.jsx | `top` | `error` | Error message |

---

## ✅ Best Practices

### 1. Parent Container Setup

Always ensure the parent container has `position: relative`:

```css
.buttonContainer {
  position: relative;
  /* FadeNotification will position absolutely relative to this */
}
```

### 2. State Management Pattern

```jsx
// State
const [notification, setNotification] = useState(null);

// Setter (with all required fields)
const showNotification = (type, text, icon) => {
  setNotification({ type, text, icon });
};

// Clear callback
const clearNotification = () => {
  setNotification(null);
};

// Conditional render
{notification && (
  <FadeNotification
    {...notification}
    position="right"
    onComplete={clearNotification}
  />
)}
```

### 3. Error Handling

Always provide user-friendly error messages:

```jsx
try {
  await apiCall();
  setNotification({ 
    type: "success", 
    text: "Operation successful!", 
    icon: "check_circle" 
  });
} catch (err) {
  setNotification({ 
    type: "error", 
    text: err.message || "Something went wrong", 
    icon: "error" 
  });
}
```

### 4. Avoid Notification Spam

Don't show notifications for every minor action. Reserve for:
- ✅ Significant state changes (add to cart, wishlist)
- ✅ Errors that need user attention
- ✅ Successful completions of async operations
- ❌ NOT for hover states or UI interactions

---

## 🎨 Customization

### Changing Duration

```jsx
<FadeNotification
  duration={3000}      // Display for 3 seconds
  fadeDuration={1000}  // Fade out over 1 second
/>
```

### Custom Icons

Use any Material Icons name:

```jsx
<FadeNotification
  icon="done_all"           // Double checkmark
  icon="check_circle"       // Circle with check
  icon="shopping_cart"      // Shopping cart
  icon="favorite"           // Heart filled
  icon="favorite_border"    // Heart outlined
  icon="error"              // Error icon
  icon="warning"            // Warning icon
  icon="info"               // Info icon
/>
```

### Extending Styles

To customize appearance, add class to parent:

```jsx
<div className={styles.customNotificationContainer}>
  <FadeNotification {...props} />
</div>
```

```css
.customNotificationContainer .notification {
  /* Override styles here */
  font-size: 16px;
  padding: 14px 20px;
}
```

---

## 🔗 Related Components

### Replaced by FadeNotification

Before FadeNotification was created, inline notifications were used:

```jsx
// OLD PATTERN (deprecated)
{message && (
  <div className={`${styles.message} ${styles[message.type]}`}>
    {message.text}
  </div>
)}
```

**Migration Benefits:**
- ✅ Consistent UX across application
- ✅ Centralized animation logic
- ✅ Reduced code duplication
- ✅ Easy to maintain and extend

---

## 📊 Performance Considerations

- **Lightweight:** No external dependencies
- **Efficient:** Uses CSS animations (GPU-accelerated)
- **Clean:** Auto-cleanup with useEffect return
- **Optimized:** Conditional rendering prevents unnecessary renders

---

## 🧪 Testing Checklist

- [ ] Notification appears on trigger
- [ ] Correct icon displays for each type
- [ ] Auto-dismiss after specified duration
- [ ] Fade out animation plays smoothly
- [ ] `onComplete` callback fires
- [ ] Position variants display correctly
- [ ] Stacking notifications (if multiple)
- [ ] Works in different browsers
- [ ] Mobile responsive
- [ ] Accessible (screen readers)

---

## 🔗 Related Documentation

- **[Shop & Cart Flow](../flows/shop-cart-flow.md)** - Cart notification usage
- **[Wishlist System](./wishlist-system.md)** - Wishlist notification usage
- **[Component Structure](../structure/component-structure.md)** - Reusable components

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Fully Implemented and Deployed
