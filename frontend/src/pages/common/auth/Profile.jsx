//  ========== Component imports  ========== //

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./Profile.module.css"; 

///////////////////////////////////////////////////////////////////////
// ========================= PROFILE COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

function Profile() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(null); 
  const [avatarPreview, setAvatarPreview] = useState(null); 
  const [address, setAddress] = useState("");         
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");  
  const [zipCode, setZipCode] = useState("");

  // --- Component State ---
  const [error, setError] = useState("");
  const [avatarError, setAvatarError] = useState(""); // State for avatar error message
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(""); // Store the ID of the profile being viewed

  // --- Context and Routing ---
  const { user, setUser } = useContext(AuthContext); // Logged-in user from context
  const { userId: profileId } = useParams();        // User ID from the URL parameter
  const navigate = useNavigate();

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  // Fetch profile data when the component mounts or profileId changes
  ///////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchUserData = async () => {
      setError(""); // Clear previous errors
      try {
        // Use the profileId from URL params to fetch data
        const response = await axios.get(`/api/profile/${profileId}`);

        if (response.status === 200 && response.data.user) {
          const userData = response.data.user;
          setFirstName(userData.USER_FIRSTNAME || "");
          setLastName(userData.USER_LASTNAME || "");
          setEmail(userData.USER_EMAIL || "");
          setNickname(userData.USER_NICKNAME || "");
          setAddress(userData.USER_ADDRESS || "");         
          setAddressLine2(userData.USER_ADDRESS_LINE_2 || "");
          setCity(userData.USER_CITY || "");
          setStateName(userData.USER_STATE || "");
          setZipCode(userData.USER_ZIPCODE || "");
          setCurrentUserId(userData.USER_ID || ""); 

          // Handle avatar display logic
          const currentAvatarPath = userData.USER_AVATAR || null;
          setAvatar(currentAvatarPath); // Store the path/URL from DB initially
          if (currentAvatarPath) {
            // Ensure preview URL is correctly formed (assuming backend serves from root)
            setAvatarPreview(currentAvatarPath.startsWith('http')
                             ? currentAvatarPath
                             : `http://localhost:4000${currentAvatarPath}`);
          } else {
            setAvatarPreview(null); // No avatar
          }

        } else {
          // Handle cases where user is found but data is missing, or other non-404 errors
          setError(response.data?.message || "Failed to load profile data");
          console.error("Fetch profile failed:", response);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Profile not found.");
        } else {
          setError("Failed to fetch profile data. Please try again later.");
        }
        console.error("Fetch profile error", err);
        // Optionally clear form fields on error
        // setFirstName(''); setLastName(''); ... etc.
      }
    };

    if (profileId) {
      fetchUserData();
    } else {
      setError("Profile ID is missing from the URL.");
      // Redirect or show an error message if profileId is invalid/missing
      // navigate('/'); // Example redirect
    }
  // Dependency array includes profileId to refetch if the URL changes
  }, [profileId]); // Removed user and setUser as dependencies to avoid potential loops unless needed for auth checks here

  ///////////////////////////////////////////////////////////////////////
  // ========================= AVATAR HANDLERS ======================= //
  ///////////////////////////////////////////////////////////////////////
 
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarError(""); // Clear previous avatar errors

    if (file) {
      // Validation logic (Size, Type)
      if (file.size > 1024 * 1024) { // 1MB Limit
        setAvatarError("Avatar must be less than 1MB.");
        setAvatar(null);
        setAvatarPreview(null); // Clear preview on error
        e.target.value = "";
        return;
      }
      const allowedTypes = /jpeg|jpg|png|gif/;
      // Ensure consistent check for extension (using path.extname logic like backend is safer if available)
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.test(fileExtension) || !allowedTypes.test(file.type)) {
        setAvatarError("Invalid file type. Only .jpeg, .jpg, .png and .gif files are allowed!");
        setAvatar(null);
        setAvatarPreview(null); // Clear preview on error
        e.target.value = "";
        return;
      }
      // If validation passes:
      setAvatar(file); // Store the File object for upload
      setAvatarPreview(URL.createObjectURL(file)); // Set preview URL
    } else {
      // If user cancels file selection, potentially revert to original avatar?
      // Or just clear preview if that's the desired UX.
      // For now, just clearing preview if no file is selected *after* trying.
      // setAvatarPreview(null); // This might clear preview unexpectedly if user just clicks cancel
    }
  };

  // =================== DELETE AVATAR ==================== //
  // (handleDeleteAvatar remains unchanged)
  const handleDeleteAvatar = () => {
    setAvatar(null); // Clear the avatar state (could be file or URL)
    setAvatarPreview(null); // Clear the preview
    // Optional: Reset the file input visually
    const avatarInput = document.getElementById("avatar-upload");
    if (avatarInput) {
      avatarInput.value = "";
    }
  };

    // ========================= CAPITALIZE WORDS ========================= //
  // Function to capitalize the first letter of each word in a string
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

  ///////////////////////////////////////////////////////////////////////
  // ========================= SUBMIT HANDLER ======================== //
  // Handles the form submission to update the profile
  //////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Basic Frontend Validation (Example)
    if (!firstName || !lastName || !email || !nickname) {
        setError("First Name, Last Name, Email, and Nickname are required.");
        return;
    }

    // Check if the logged-in user is allowed to edit this profile
    if (!user || user.USER_ID !== currentUserId) {
      setError("You are not authorized to edit this profile.");
      // Optionally redirect or disable form
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("nickname", nickname);
      formData.append("address", address);         
      formData.append("addressLine2", addressLine2);
      formData.append("city", city);
      formData.append("state", stateName);           
      formData.append("zipCode", zipCode);

      // Handle avatar: Append only if it's a new File object
      if (avatar instanceof File) {
        formData.append("avatar", avatar);
      } else if (typeof avatar === 'string' && avatar) {
        // If it's the existing URL string, send it so backend knows not to change it unless a file is sent
        // The key 'avatarUrl' might be used by backend to differentiate
        formData.append("avatarUrl", avatar);
      }
      // If avatar is null (deleted), don't send anything or send a specific flag if backend needs it

      // Send PUT request to the update endpoint
      const response = await axios.put(`/api/profile/${profileId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      // Handle success response
      if (response.status === 200 && response.data.user) {
        setSuccessMessage("Profile updated successfully!");

        // Extract updated user data from response for context update
        const updatedUserData = response.data.user;

        // Determine the correct avatar URL for context (prefer response)
        const finalAvatarPath = updatedUserData.USER_AVATAR || (avatar instanceof File ? URL.createObjectURL(avatar) : avatar); // Fallback logic might need refinement
        const finalAvatarUrl = finalAvatarPath && finalAvatarPath.startsWith('http')
                               ? finalAvatarPath
                               : `http://localhost:4000${finalAvatarPath}`;

        // Update the AuthContext if the updated profile belongs to the logged-in user
        if (user && setUser && user.USER_ID === currentUserId) {
          setUser({
            ...user, // Spread existing user data to keep other fields intact
            USER_FIRSTNAME: updatedUserData.USER_FIRSTNAME,
            USER_LASTNAME: updatedUserData.USER_LASTNAME,
            USER_EMAIL: updatedUserData.USER_EMAIL,
            USER_NICKNAME: updatedUserData.USER_NICKNAME,
            USER_AVATAR: finalAvatarUrl, 
            USER_ADDRESS: updatedUserData.USER_ADDRESS || "",
            USER_ADDRESS_LINE_2: updatedUserData.USER_ADDRESS_LINE_2 || "",
            USER_CITY: updatedUserData.USER_CITY || "",
            USER_STATE: updatedUserData.USER_STATE || "",
            USER_ZIPCODE: updatedUserData.USER_ZIPCODE || "",
          });
        }

         // Update avatar preview to reflect the saved state
         if (finalAvatarPath) {
             setAvatarPreview(finalAvatarUrl);
             // If a new file was uploaded, we might want to update the 'avatar' state
             // from a File object back to the URL path returned by the server
             // to prevent resubmitting the File object accidentally.
             if (avatar instanceof File) {
                setAvatar(updatedUserData.USER_AVATAR); // Store the path returned by server
             }
         } else {
             setAvatarPreview(null); // If avatar was removed
         }


      } else {
        // Handle non-200 success or unexpected response format
        setError(response.data?.message || "Profile update failed. Unexpected response.");
      }
    } catch (error) {
      // Handle network errors or errors thrown by the backend
      setError(
        "Profile update failed: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Profile update error", error);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ================================================================= //
  // ========================= JSX BELOW ============================= //
  // ================================================================= //
  ///////////////////////////////////////////////////////////////////////

  // Check if the logged-in user is viewing their own profile
  const isOwnProfile = user && user.USER_ID === currentUserId;

  // Display loading or error state before rendering the form
  if (!currentUserId && !error) {
      // Added a simple loading indicator, you can replace with a spinner component
      return <div className={styles.loading}>Loading profile...</div>;
  }

  // Optionally show a more prominent error display if fetching failed completely
  if (error && !currentUserId) {
      return <div className={styles.error}>{error}</div>;
  }


  return (
    // Only allow submission if it's the user's own profile
    <form onSubmit={isOwnProfile ? handleSubmit : (e) => e.preventDefault()} className={styles.registerForm} autoComplete="off">
      {/* ============ Section Header =========== */}
      {/* Differentiate title based on viewing own vs other profile */}
      <h1 className={styles.editProfileTitle}>{isOwnProfile ? "Edit Profile" : "View Profile"}</h1>

      {/* ============ PERSONAL DETAILS SECTION ============  */}
      <div className={styles.inputContainer}>
        <h2 className={styles.inputHeader}>Personal Details</h2>
        <p className={styles.inputLabel}>First Name:</p>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(capitalizeWords(e.target.value))}
          readOnly={!isOwnProfile} 
          className={`${styles.inputField} ${!isOwnProfile ? styles.readOnly : ''}`} // Optional read-only styling
        />
        <p className={styles.inputLabel}>Last Name:</p>
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(capitalizeWords(e.target.value))}
          readOnly={!isOwnProfile}
          className={`${styles.inputField} ${!isOwnProfile ? styles.readOnly : ''}`}
        />
        <p className={styles.inputLabel}>Email:</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={!isOwnProfile}
          className={`${styles.inputField} ${!isOwnProfile ? styles.readOnly : ''}`}
        />
      </div>

      {/* ============ PROFILE & AVATAR SECTION ============  */}
      <div className={styles.inputContainer}>
        <h2 className={styles.inputHeader}>Profile</h2>

        {/* Only show avatar upload controls if it's the user's own profile */}
        {isOwnProfile && (
            <div className={styles.uploadAvatarSection}>
                <label htmlFor="avatar-upload" className={styles.avatarLabel}>
                Avatar:
                </label>
                <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                className={styles.inputField}
                // Disable if not owner? Usually file inputs aren't disabled, but hide button
                />
                {avatarPreview && (
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

        {/* Display avatar error message */}
        {avatarError && (
          <div className={styles.avatarErrorMessage}>{avatarError}</div>
        )}

        {/* Always display the avatar preview if available */}
        {avatarPreview && (
          <div className={styles.avatarPreviewContainer}>
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className={styles.avatarPreview}
              // Handle potential broken image links
              onError={(e) => { e.target.onerror = null; e.target.src="/path/to/default/avatar.png"; }} // Fallback src
            />
          </div>
        )}
         {/* Show default image if no preview and not owner's edit view? Or just nothing */}
         {!avatarPreview && !isOwnProfile && (
             <div className={styles.avatarPreviewContainer}>
                 {/* Optional: Show a placeholder if no avatar exists */}
                 {/* <img src="/path/to/default/avatar.png" alt="Default Avatar" className={styles.avatarPreview} /> */}
             </div>
         )}


        <p className={styles.inputLabelNick}>Nickname:</p>
        <input
          type="text"
          placeholder="Nickname" // Removed "(Required)" as it might not be editable always
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          readOnly={!isOwnProfile}
          className={`${styles.inputField} ${!isOwnProfile ? styles.readOnly : ''}`}
        />
      </div>

      {/* ============ FULL ADDRESS SECTION (REVERTED) ============  */}
      <div className={styles.inputContainer}>
        <h2 className={styles.inputHeader}>Full Address</h2>

        {/* Combined Address Input */}
        <p className={styles.inputLabel}>Address:</p>
        <input
          type="text"
          placeholder="Street Number & Name" 
          value={address} 
          onChange={(e) => setAddress(capitalizeWords(e.target.value))} 
          readOnly={!isOwnProfile}
          className={`${styles.inputField} ${!isOwnProfile ? styles.readOnly : ''}`}
        />

        {/* Unit/Apartment Input (Address Line 2) */}
        <p className={styles.inputLabel}>Apartment / Unit:</p>
        <input
          type="text"
          placeholder="Unit, Apt, Suite #"
          value={addressLine2} 
          onChange={(e) => setAddressLine2(e.target.value)} 
          readOnly={!isOwnProfile}
          className={`${styles.inputField} ${!isOwnProfile ? styles.readOnly : ''}`}
        />

        {/* City Input */}
        <p className={styles.inputLabel}>City / Suburb:</p>
        <input
          type="text"
          placeholder="City or Suburb"
          value={city} 
          onChange={(e) => setCity(capitalizeWords(e.target.value))} 
          readOnly={!isOwnProfile}
          className={`${styles.inputField} ${!isOwnProfile ? styles.readOnly : ''}`}
        />

        {/* State/Region Input */}
        <p className={styles.inputLabel}>State / Region:</p>
        <input
          type="text"
          placeholder="State or Region"
          value={stateName} 
          onChange={(e) => setStateName(capitalizeWords(e.target.value))} 
          readOnly={!isOwnProfile}
          className={`${styles.inputField} ${!isOwnProfile ? styles.readOnly : ''}`}
        />

        {/* Postcode Input */}
        <p className={styles.inputLabel}>Zip Code / Postcode:</p>
        <input
          type="text"
          placeholder="Zip Code or Postcode"
          value={zipCode} 
          onChange={(e) => setZipCode(e.target.value)} 
          readOnly={!isOwnProfile}
          className={`${styles.inputField} ${!isOwnProfile ? styles.readOnly : ''}`}
        />
      </div>

      {/* Only show Save Changes button if it's the user's own profile */}
      {isOwnProfile && (
        <button type="submit" className={styles.saveChangesButton}>
          Save Changes
        </button>
      )}

      {/* Always show Return Home button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className={styles.homeButton}
      >
        Return Home
      </button>

      {/* Display general error messages */}
      {error && !successMessage && <div className={styles.error}>{error}</div>}
      {/* Display success message */}
      {successMessage && <div className={styles.success}>{successMessage}</div>}

    </form>
  );
}

export default Profile;