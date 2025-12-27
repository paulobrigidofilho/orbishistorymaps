////////////////////////////////////////
// ===== SET NEW PASSWORD PAGE ====== //
////////////////////////////////////////

// This component handles the password reset process
// using a token from the reset link

//  ========== Module imports  ========== //
import styles from "./Auth.module.css";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// ========================= SET NEW PASSWORD COMPONENT ======================== //

function SetNewPassword() {
  /////////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ========================= //
  /////////////////////////////////////////////////////////////////////////

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  /////////////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECTS ================================= //
  /////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // Get token from URL parameters
    const urlToken = searchParams.get("token");
    
    if (!urlToken) {
      setError("Invalid or missing reset token");
      setTokenValid(false);
    } else {
      setToken(urlToken);
    }
  }, [searchParams]);

  /////////////////////////////////////////////////////////////////////////
  // ========================= HANDLER FUNCTIONS ======================= //
  /////////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must include uppercase, lowercase, and numbers");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            token, 
            password,
            confirmPassword 
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccessMessage(data.message);
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /////////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW =============================== //
  /////////////////////////////////////////////////////////////////////////

  if (!tokenValid) {
    return (
      <div className={styles.registerForm}>
        <h1 className={styles.registerTitle}>Invalid Reset Link</h1>
        <div className={styles.error}>
          {error || "This password reset link is invalid or has expired."}
        </div>
        <div className={styles.registerLink}>
          <a href="/forgot-password">Request a new reset link</a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.registerForm}>
      <h1 className={styles.registerTitle}>Set New Password</h1>

      {successMessage ? (
        <div className={styles.success}>
          {successMessage}
          <p>Redirecting to home page...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>New Password:</p>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              required
              disabled={isLoading}
            />

            <p className={styles.inputLabel}>Confirm Password:</p>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.inputField}
              required
              disabled={isLoading}
            />

            <div className={styles.passwordRequirements}>
              <p className={styles.requirementsTitle}>Password must contain:</p>
              <ul>
                <li>At least 8 characters</li>
                <li>Uppercase letter (A-Z)</li>
                <li>Lowercase letter (a-z)</li>
                <li>Number (0-9)</li>
              </ul>
            </div>

            <button
              type="submit"
              className={styles.registerButton}
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default SetNewPassword;
