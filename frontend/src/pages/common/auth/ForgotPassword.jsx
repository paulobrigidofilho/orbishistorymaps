///////////////////////////////////////////////////////////////////////
// =================== FORGOT PASSWORD COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// This component handles the forgot password request
// where users can enter their email to receive a reset link

//  ========== Module imports  ========== //
import styles from "./Auth.module.css";
import { useState } from "react";

//  ========== Button imports  ========== //
import { SubmitBtn, LinkBtn } from "./btn";

// ========================= FORGOT PASSWORD COMPONENT ======================== //

function ForgotPassword() {
  /////////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ========================= //
  /////////////////////////////////////////////////////////////////////////

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");

  /////////////////////////////////////////////////////////////////////////
  // ========================= HANDLER FUNCTIONS ======================= //
  /////////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setResetLink("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setSuccessMessage(data.message);

      // For development: show the reset link
      if (data.data && data.data.resetLink) {
        setResetLink(data.data.resetLink);
      }

      // Clear email field
      setEmail("");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /////////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW =============================== //
  /////////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.registerForm}>
      <h1 className={styles.registerTitle}>Forgot Password</h1>

      <form onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}
        {successMessage && (
          <div className={styles.success}>
            {successMessage}
            {resetLink && (
              <div className={styles.devInfo}>
                <p>
                  <strong>Development Link:</strong>
                </p>
                <a href={resetLink} className={styles.resetLink}>
                  Click here to reset your password
                </a>
              </div>
            )}
          </div>
        )}

        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>Email Address:</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
            required
            disabled={isLoading}
          />

          <SubmitBtn
            variant="register"
            disabled={isLoading}
            loading={isLoading}
            loadingText="Sending..."
          >
            Send Reset Link
          </SubmitBtn>
        </div>
      </form>

      <LinkBtn variant="login" />
    </div>
  );
}

export default ForgotPassword;
