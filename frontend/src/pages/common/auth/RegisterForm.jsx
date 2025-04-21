//  ========== Component imports  ========== //

import React, { useState, useContext, useEffect, useRef, useCallback } from "react"; // Keep imports
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
  const [addressLine2, setAddressLine2] = useState(""); 
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState(""); 
  const [zipCode, setZipCode] = useState("");

  // --- Registration State ---
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // State for successful registration
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // --- Error and Success Messages ---
  const [error, setError] = useState(""); // State for error message on registration
  const [successMessage, setSuccessMessage] = useState(""); // State for success message on registration
  const [avatarError, setAvatarError] = useState(""); // State for avatar error message

  // --- Optional Refs for future Autocomplete ---
  // const addressInputRef = useRef(null); // You would likely bind this to the 'address' input below

  ///////////////////////////////////////////////////////////////////////
  // ==================== EVENT HANDLERS SECTION ===================== //
  ///////////////////////////////////////////////////////////////////////

  // ==================== AVATAR CHANGE HANDLER ==================== //
  // (This function remains unchanged)
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarError("");
    setAvatarPreview(null);
    if (file) {
      if (file.size > 1024 * 1024) {
        setAvatarError("File must be less than 1MB.");
        setAvatar(null);
        e.target.value = "";
        return;
      }
      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(file.name.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/));
      if (!extname) {
        setAvatarError("Invalid file type. Only .jpeg, .jpg, .png and .gif files are allowed!");
        setAvatar(null);
        e.target.value = "";
        return;
      }
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  };

  ////////////////////////////////////////////////////////////////////////
  // ========================== DELETE AVATAR ========================= //
  ////////////////////////////////////////////////////////////////////////
  // (This function remains unchanged)
  const handleDeleteAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    const avatarInput = document.getElementById("avatar-upload");
    if (avatarInput) {
      avatarInput.value = "";
    }
  };

  // ========================= CAPITALIZE WORDS ========================= //
  // Function to capitalize the first letter of each word in a string
  // This function handles both normal and accented characters
  // It also handles spaces, hyphens, and periods as word separators
  // (This function remains unchanged)
  const capitalizeWords = (str) => {
    if (!str) return "";
    let result = "";
    let capitalizeNext = true;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const lowerChar = char.toLowerCase();
      const upperChar = char.toUpperCase();
      const isLetter = lowerChar !== upperChar;
      if (capitalizeNext && isLetter) {
        result += upperChar;
        capitalizeNext = false;
      } else if (isLetter) {
        result += lowerChar;
        capitalizeNext = false;
      } else {
        result += char;
        if (char === ' ' || char === '-' || char === '.') {
          capitalizeNext = true;
        } else {
          capitalizeNext = false;
        }
      }
    }
    return result;
  };


  /////////////////////////////////////////////////////////////////////////
  // ========================= FORM SUBMISSION ========================= //
  /////////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // ========================= FORM DATA PREPARATION ========================= //

    const formData = new FormData();
    // Personal details
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    // Profile details
    formData.append("nickname", nickname);
    formData.append("address", address);          
    formData.append("addressLine2", addressLine2);
    formData.append("city", city);
    formData.append("state", stateName); 
    formData.append("zipCode", zipCode);

    // Append avatar only if selected
    if (avatar) {
      formData.append("avatar", avatar);
    }

    // ========================= API CALL ========================= //
    try {
      const response = await axios.post("/api/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ========================= SUCCESS HANDLING ========================= //
      if (response.status === 201) {
        console.log("Full registration response:", response);

        // Basic validation of response structure
        if (!response.data || !response.data.user || !response.data.user.USER_ID) {
          setError("Registration successful, but invalid user data received. Check backend response.");
          console.error("Invalid response format:", response.data);
          return;
        }

        // ========================= SET USER CONTEXT (REVERTED) ========================= //
        // Construct user object for context using data from response
        const newUser = {
          USER_ID: response.data.user.USER_ID,
          USER_FIRSTNAME: response.data.user.USER_FIRSTNAME || firstName,
          USER_LASTNAME: response.data.user.USER_LASTNAME || lastName,
          USER_EMAIL: response.data.user.USER_EMAIL || email,
          USER_NICKNAME: response.data.user.USER_NICKNAME || nickname,
          USER_AVATAR: response.data.user.USER_AVATAR.startsWith('http')
                       ? response.data.user.USER_AVATAR
                       : "http://localhost:4000" + response.data.user.USER_AVATAR,
          USER_ADDRESS: response.data.user.USER_ADDRESS || "", 
          USER_ADDRESS_LINE_2: response.data.user.USER_ADDRESS_LINE_2 || "",
          USER_CITY: response.data.user.USER_CITY || "",
          USER_STATE: response.data.user.USER_STATE || "",
          USER_ZIPCODE: response.data.user.USER_ZIPCODE || "",
        };
        setUser(newUser); // Set user in context

        setRegistrationSuccess(true); // Set registration success state

        // ========================= ERROR HANDLING (API Level) ========================= //
      } else {
        setError(response.data?.message || `Registration attempt returned status ${response.status}`);
      }
       // ========================= ERROR HANDLING (Catch Block) ========================= //
    } catch (registerError) {
      console.error("Full registration error:", registerError);
      console.error("Response data:", registerError.response?.data);
      setError(
        registerError.response?.data?.message ||
          registerError.message ||
          "Registration failed due to a network or server issue."
      );
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // ========================= REDIRECT USE EFFECT ========================= //
  /////////////////////////////////////////////////////////////////////////////
  // (This effect remains unchanged)
  useEffect(() => {
    if (registrationSuccess) {
      setSuccessMessage("Registration successful! Directing back to home...");
      const timeoutId = setTimeout(() => { navigate("/"); }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [registrationSuccess, navigate]);

  ///////////////////////////////////////////////////////////////////////
  // ================================================================= //
  // ========================= JSX BELOW ============================= //
  // ================================================================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm} autoComplete="off">
      {/* ============ Section Header =========== */}
      <h1 className={styles.RegisterTitle}>Register</h1>

      {/* ============ PERSONAL DETAILS SECTION ============  */}
      {/* (This section remains unchanged) */}
      <div className={styles.inputContainer}>
        <h2 className={styles.inputHeader}>Personal Details</h2>
        {/* Inputs for firstName, lastName, email, password, confirmPassword */}
         <p className={styles.inputLabel}>First Name: *</p>
        <input
          type="text"
          placeholder="First Name (Required)"
          value={firstName}
          onChange={(e) => setFirstName(capitalizeWords(e.target.value))}
          className={styles.inputField}
        />

        <p className={styles.inputLabel}>Last Name: *</p>
        <input
          type="text"
          placeholder="Last Name (Required)"
          value={lastName}
          onChange={(e) => setLastName(capitalizeWords(e.target.value))}
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
      {/* (This section remains unchanged) */}
      <div className={styles.inputContainer}>
          <h2 className={styles.inputHeader}>Profile</h2>
          {/* Avatar upload inputs/preview */}
          <div className={styles.uploadAvatarSection}>
              <label htmlFor="avatar-upload" className={styles.avatarLabel}>Avatar:</label>
              <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} className={styles.inputField} />
              {avatarPreview && (<button type="button" onClick={handleDeleteAvatar} className={styles.deleteButton}>X</button>)}
          </div>
          {avatarError && (<div className={styles.avatarErrorMessage}>{avatarError}</div>)}
          {avatarPreview && (<div className={styles.avatarPreviewContainer}><img src={avatarPreview} alt="Avatar Preview" className={styles.avatarPreview} /></div>)}
          {/* Nickname Input */}
          <p className={styles.inputLabelNick}>Nickname:</p>
          <input type="text" placeholder="Nickname (Required)" value={nickname} onChange={(e) => setNickname(e.target.value)} className={styles.inputField} />
      </div>

      {/* ============ FULL ADDRESS SECTION ============  */}
      <div className={styles.inputContainer}>
        <h2 className={styles.inputHeader}>Full Address</h2>

        {/* Combined Address Input (Street Number + Name) */}
        <p className={styles.inputLabel}>Address:</p>
        <input
          // ref={addressInputRef} // Assign ref here if using Autocomplete
          type="text"
          placeholder="Street Number & Name" 
          value={address} 
          onChange={(e) => setAddress(capitalizeWords(e.target.value))} 
          className={styles.inputField}
          />

        {/* Unit/Apartment Input (Address Line 2) */}
        <p className={styles.inputLabel}>Apartment / Unit: (Optional)</p>
        <input
          type="text"
          placeholder="Unit, Apt, Suite Number" 
          value={addressLine2} 
          onChange={(e) => setAddressLine2(e.target.value)} 
          className={styles.inputField}
          />

        {/* City Input */}
        <p className={styles.inputLabel}>City / Suburb:</p>
        <input
          type="text"
          placeholder="City or Suburb"
          value={city} 
          onChange={(e) => setCity(capitalizeWords(e.target.value))} 
          className={styles.inputField}
          />

        {/* State/Region Input */}
        <p className={styles.inputLabel}>State / Region:</p>
        <input
          type="text"
          placeholder="State or Region"
          value={stateName} 
          onChange={(e) => setStateName(capitalizeWords(e.target.value))} 
          className={styles.inputField}
          />

        {/* Postcode Input */}
        <p className={styles.inputLabel}>Zip Code:</p>
        <input
          type="text"
          placeholder="Zip Code or Postcode"
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