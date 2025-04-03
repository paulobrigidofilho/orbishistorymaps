//  ========== Component imports  ========== //

import React, { useState, useContext } from "react";
import axios from "axios";
import styles from "./RegisterForm.module.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";

// ========================= REGISTER FORM COMPONENT ======================== //

function RegisterForm() {

  // ========================= STATE VARIABLES ========================= //
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUploaded, setAvatarUploaded] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // New state
  const navigate = useNavigate(); // Initialize useNavigate
  const { setUser } = useContext(AuthContext); // Get setUser from context


  ///////////////////////////////////////////////////////////////////////
  // ==================== EVENT HANDLERS SECTION ===================== //
  ///////////////////////////////////////////////////////////////////////

  // ==================== AVATAR CHANGE HANDLER ==================== //

  const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      setAvatar(file);

      if (file) {
          setAvatarPreview(URL.createObjectURL(file));
      } else {
          setAvatarPreview(null);
      }
  };

  // ========================= UPLOAD AVATAR ========================= //

  const handleUploadAvatar = async () => {
    if (!avatar) {
      setError("Please select an avatar to upload.");
      return;
    }

    setUploadingAvatar(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("avatar", avatar);

      const response = await axios.post("/api/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("Avatar uploaded successfully");
        setAvatarUploaded(true);
        setAvatarPreview(response.data.avatarUrl);
        setAvatar(response.data.avatarUrl);
      } else {
        setError("Avatar upload failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      setError("Avatar upload failed: " + error.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ========================== DELETE AVATAR ========================= //

  const handleDeleteAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    setAvatarUploaded(false);
  };

  // ========================= FORM SUBMISSION ========================= //

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccessMessage("");

      let avatarUrl = avatar; // Default to the file object if avatar is not uploaded

      if (!avatarUrl && avatar) { // If avatar is uploaded, use the URL from the preview
        setAvatar(null);
        setAvatarPreview(null);
        setAvatarUploaded(false);
      }

      try {
          const response = await axios.post("/api/register", {
              firstName, lastName, email, password, confirmPassword, nickname,
              avatar: avatarUrl, address, city, zipCode,
          });

          if (response.status === 201) {
              console.log("Full registration response:", response); // Log the entire response object

              // Ensure response.data.user exists and has USER_ID
              if (!response.data || !response.data.user || !response.data.user.USER_ID) {
                  setError("Registration successful, but invalid user data received. Check backend response.");
                  console.error("Invalid response format:", response.data);
                  return;
              }

              // ========== Set new user object ========== //
              // Create a new user object with the data from the response

              const newUser = {
                  USER_ID: response.data.user.USER_ID, // Get USER_ID from response
                  USER_FIRSTNAME: firstName,
                  USER_LASTNAME: lastName,
                  USER_EMAIL: email,
                  USER_NICKNAME: nickname,
                  USER_AVATAR: response.data.user.USER_AVATAR || avatarUrl, // Use the uploaded avatar URL or the default one
                  USER_ADDRESS: address,
                  USER_CITY: city,
                  USER_ZIPCODE: zipCode,
              };
              setUser(newUser);

              setRegistrationSuccess(true); // Redirect after setting user
          } else {
              setError(response.data?.message || "Registration failed");
          }
      } catch (registerError) {
        console.error("Full registration error:", registerError);
        console.error("Response data:", registerError.response?.data);
        setError(registerError.response?.data?.message || registerError.message || "Registration failed");
      }
  };

  // ========================= REDIRECT USE EFFECT ========================= //
  React.useEffect(() => {
      if (registrationSuccess) {
          setSuccessMessage("Registration successful! Directing back to home...");

          const timeoutId = setTimeout(() => {
              navigate('/');
          }, 3000);

          return () => clearTimeout(timeoutId);
      }
  }, [registrationSuccess, navigate]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>

      {/* ============ Section Header =========== */}
      <h1 className={styles.RegisterTitle}>Register</h1>

      {/* ============ PERSONAL DETAILS SECTION ============  */}

      <div className={styles.inputContainer}>
        <h2 className={styles.inputHeader}>Personal Details</h2>

        <p className={styles.inputLabel}>First Name:</p>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={styles.inputField}
        />

        <p className={styles.inputLabel}>Last Name:</p>
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={styles.inputField}
        />

        <p className={styles.inputLabel}>Email: *</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField}
        />

        <p className={styles.inputLabel}>Password: *</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
        />

        <p className={styles.inputLabel}>Confirm Password: *</p>
        <input
          type="password"
          placeholder="Confirm Password"
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
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleAvatarChange}
          disabled={uploadingAvatar || avatarUploaded} // Disable while uploading or after successful upload
          className={styles.inputField}
        />

        {avatarPreview && (
          <div className={styles.avatarPreviewContainer}>
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className={styles.avatarPreview}
            />
            {!avatarUploaded && (
              <button
                type="button"
                onClick={handleUploadAvatar}
                disabled={uploadingAvatar}
                className={styles.uploadButton}
              >
                {uploadingAvatar ? "Uploading..." : "Upload"}
              </button>
            )}
            {avatarUploaded && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                className={styles.deleteButton}
              >
                X
              </button>
            )}
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
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={styles.inputField}
        />

        <p className={styles.inputLabel}>Zip Code:</p>
        <input
          type="text"
          placeholder="Zip Code"
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