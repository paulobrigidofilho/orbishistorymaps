//  ========== Component imports  ========== //

import React, { useState, useContext } from "react";
import axios from "axios";
import styles from "./RegisterForm.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

// ========================= REGISTER FORM COMPONENT ======================== //

function RegisterForm() {
  // ========================= STATE VARIABLES ========================= //

  // --- Form State ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  // --- Registration State ---
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // State for successful registration
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // --- Error and Success Messages ---
  const [error, setError] = useState(""); // State for error message on registration
  const [successMessage, setSuccessMessage] = useState(""); // State for success message on registration
  const [avatarError, setAvatarError] = useState(""); // State for avatar error message

  ///////////////////////////////////////////////////////////////////////
  // ==================== EVENT HANDLERS SECTION ===================== //
  ///////////////////////////////////////////////////////////////////////

  // ==================== AVATAR CHANGE HANDLER ==================== //

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    setAvatar(file); // Always set the avatar

    // Reset error message
    setAvatarError("");
    setAvatarPreview(null); // Clear previous preview

    //////////////////////////////////////////////////////////////////
    // ====================  AVATAR VALIDATION ==================== //
    //////////////////////////////////////////////////////////////////

    // =================== File Size Validation ==================== //

    if (file) {
      if (file.size > 1024 * 1024) {
        //// 1MB limit

        setAvatarError("File must be less than 1MB.");
        setAvatar(null); // Reset the selected file
        e.target.value = ""; // Clear the file input
        return;
      }

      // =================== File Type Validation ==================== //

      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(
        file.name.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/)
      );

      if (!extname) {
        setAvatarError(
          "Invalid file type. Only .jpeg, .jpg, .png and .gif files are allowed!"
        );
        setAvatar(null); // Reset the selected file
        e.target.value = ""; // Clear the file input
        return;
      }

      // ============== File Successfully Validated ============= //

      setAvatarPreview(URL.createObjectURL(file));
    } else {
      // No file selected
      setAvatarPreview(null);
    }
  };

  ////////////////////////////////////////////////////////////////////////
  // ========================== DELETE AVATAR ========================= //
  ////////////////////////////////////////////////////////////////////////

  const handleDeleteAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);

    // Reset the file input value programmatically
    const avatarInput = document.getElementById("avatar-upload");
    if (avatarInput) {
      avatarInput.value = "";
    }
  };

  /////////////////////////////////////////////////////////////////////////
  // ========================= FORM SUBMISSION ========================= //
  /////////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // ========================= FORM VALIDATION ========================= //

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("nickname", nickname);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("zipCode", zipCode);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    // Check if all required fields are filled

    try {
      const response = await axios.post("/api/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        console.log("Full registration response:", response);

        if (
          !response.data ||
          !response.data.user ||
          !response.data.user.USER_ID
        ) {
          setError(
            "Registration successful, but invalid user data received. Check backend response."
          );
          console.error("Invalid response format:", response.data);
          return;
        }

        // ========================= SET USER CONTEXT ========================= //

        const newUser = {
          USER_ID: response.data.user.USER_ID,
          USER_FIRSTNAME: firstName,
          USER_LASTNAME: lastName,
          USER_EMAIL: email,
          USER_NICKNAME: nickname,
          USER_AVATAR: "http://localhost:4000" + response.data.user.USER_AVATAR,
          USER_ADDRESS: address,
          USER_CITY: city,
          USER_ZIPCODE: zipCode,
        };
        setUser(newUser); // Set user in context

        setRegistrationSuccess(true); // Set registration success state

        // ========================= ERROR HANDLING ========================= //
      } else {
        setError(response.data?.message || "Registration failed");
      }
    } catch (registerError) {
      console.error("Full registration error:", registerError);
      console.error("Response data:", registerError.response?.data);
      setError(
        registerError.response?.data?.message ||
          registerError.message ||
          "Registration failed"
      );
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // ========================= REDIRECT USE EFFECT ========================= //
  /////////////////////////////////////////////////////////////////////////////

  React.useEffect(() => {
    if (registrationSuccess) {
      setSuccessMessage("Registration successful! Directing back to home...");

      const timeoutId = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [registrationSuccess, navigate]);

  ///////////////////////////////////////////////////////////////////////
  // ================================================================= //
  // ========================= JSX BELOW ============================= //
  // ================================================================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      {/* ============ Section Header =========== */}
      <h1 className={styles.RegisterTitle}>Register</h1>

      {/* ============ PERSONAL DETAILS SECTION ============  */}

      <div className={styles.inputContainer}>
        <h2 className={styles.inputHeader}>Personal Details</h2>

        <p className={styles.inputLabel}>First Name: *</p>
        <input
          type="text"
          placeholder="First Name (Required)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={styles.inputField}
        />

        <p className={styles.inputLabel}>Last Name: *</p>
        <input
          type="text"
          placeholder="Last Name (Required)"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={styles.inputField}
        />

        <p className={styles.inputLabel}>Email: *</p>
        <input
          type="email"
          placeholder="Email (Required)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField}
        />

        <p className={styles.inputLabel}>Password: *</p>
        <input
          type="password"
          placeholder="Password (Required)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
        />

        <p className={styles.inputLabel}>Confirm Password: *</p>
        <input
          type="password"
          placeholder="Confirm Password (Required)"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.inputField}
        />
      </div>

      {/* ============ PROFILE & AVATAR SECTION ============  */}

      <div className={styles.inputContainer}>
        <h2 className={styles.inputHeader}>Profile</h2>

        <label htmlFor="avatar-upload" className={styles.avatarLabel}>
          Upload Avatar:
        </label>
        <div className={styles.avatarInputContainer}>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleAvatarChange}
            className={styles.inputField}
          />
        </div>
        {avatarError && (
          <div className={styles.avatarErrorMessage}>{avatarError}</div>
        )}

        {avatarPreview && (
          <div className={styles.avatarPreviewContainer}>
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className={styles.avatarPreview}
            />
            <button
              type="button"
              onClick={handleDeleteAvatar}
              className={styles.deleteButton}
            >
              X
            </button>
          </div>
        )}

        <p className={styles.inputLabel}>Nickname: *</p>
        <input
          type="text"
          placeholder="Nickname (Required)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className={styles.inputField}
        />
      </div>

      {/* ============ FULL ADDRESS SECTION ============  */}

      <div className={styles.inputContainer}>
        <h2 className={styles.inputHeader}>Full Address</h2>

        <p className={styles.inputLabel}>Address:</p>
        <input
          type="text"
          placeholder="Address (Optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={styles.inputField}
        />

        <p className={styles.inputLabel}>City:</p>
        <input
          type="text"
          placeholder="City (Optional)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={styles.inputField}
        />

        <p className={styles.inputLabel}>Zip Code:</p>
        <input
          type="text"
          placeholder="Zip Code (Optional)"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className={styles.inputField}
        />
      </div>

      {/* Tag for Required Fields */}
      <p className={styles.requiredNote}>* Required Fields</p>

      {/* Submit Button */}

      <button type="submit" className={styles.registerButton}>
        Register
      </button>

      {/* Messages to be displayed */}
      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}
    </form>
  );
}

export default RegisterForm;
