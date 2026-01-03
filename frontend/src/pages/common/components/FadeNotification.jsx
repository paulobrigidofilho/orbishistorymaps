///////////////////////////////////////////////////////////////////////
// ================ FADE NOTIFICATION COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

// This reusable component displays a notification message that fades away
// Used for feedback on wishlist actions, add to cart, etc.

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./FadeNotification.module.css";

//  ========== Constants imports  ========== //
import {
  FADE_NOTIFICATION_DEFAULTS,
  NOTIFICATION_TYPES,
  DEFAULT_ICONS,
} from "../constants/fadeNotificationConstants";

///////////////////////////////////////////////////////////////////////
// =================== FADE NOTIFICATION ============================= //
///////////////////////////////////////////////////////////////////////

/**
 * Reusable fade notification component
 * @param {string} type - Notification type: 'success' | 'error' | 'info'
 * @param {string} text - Notification message text
 * @param {string} icon - Material icon name (optional)
 * @param {number} duration - Duration before fade starts in ms (default: 2000)
 * @param {number} fadeDuration - Fade animation duration in ms (default: 500)
 * @param {string} position - Position: 'right' | 'top' | 'bottom' (default: 'right')
 * @param {Function} onComplete - Callback when notification is removed
 */
const FadeNotification = ({
  type = FADE_NOTIFICATION_DEFAULTS.type,
  text,
  icon,
  duration = FADE_NOTIFICATION_DEFAULTS.duration,
  fadeDuration = FADE_NOTIFICATION_DEFAULTS.fadeDuration,
  position = FADE_NOTIFICATION_DEFAULTS.position,
  onComplete,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

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

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Get default icon based on type
  const getDefaultIcon = () => {
    return DEFAULT_ICONS[type] || DEFAULT_ICONS[NOTIFICATION_TYPES.SUCCESS];
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  if (!isVisible) return null;

  return (
    <div
      className={`
        ${styles.notification} 
        ${styles[type]} 
        ${styles[position]}
        ${isFadingOut ? styles.fadeOut : ""}
      `.trim()}
    >
      <i className="material-icons">{icon || getDefaultIcon()}</i>
      <span>{text}</span>
    </div>
  );
};

///////////////////////////////////////////////////////////////////////
// ========================= PROP TYPES ============================ //
///////////////////////////////////////////////////////////////////////

FadeNotification.propTypes = {
  type: PropTypes.oneOf(["success", "error", "info"]),
  text: PropTypes.string.isRequired,
  icon: PropTypes.string,
  duration: PropTypes.number,
  fadeDuration: PropTypes.number,
  position: PropTypes.oneOf(["right", "top", "bottom"]),
  onComplete: PropTypes.func,
};

export default FadeNotification;
