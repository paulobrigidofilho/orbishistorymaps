///////////////////////////////////
// ===== PROFILE COMPONENT ===== //
///////////////////////////////////

// This component allows users to view and edit their profile information

//  ========== Module imports  ========== //

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./Auth.module.css"; 

//  ========== Component imports  ========== //
import PersonalDetailsDiv from "./components/PersonalDetailsDiv";
import ProfileDiv from "./components/ProfileDiv";
import FullAddressDiv from "./components/FullAddressDiv";

//  ========== Function imports  ========== //
import capitalizeWords from "./functions/capitalizeWords";
import handleDeleteAvatar from "./functions/handleDeleteAvatar";
import handleProfileAvatarChange from "./functions/handleProfileAvatarChange";
import handleProfileSubmit from "./functions/handleProfileSubmit";
import fetchProfileData from "./functions/fetchProfileData";

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
  const [avatarError, setAvatarError] = useState(""); 
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(""); 

  // --- Context and Routing ---
  const { user, setUser } = useContext(AuthContext); 
  const { userId: profileId } = useParams();        
  const navigate = useNavigate();

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  // Fetch profile data when the component mounts or profileId changes
  ///////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (profileId && profileId !== 'undefined') {
      const setters = {
        setFirstName,
        setLastName,
        setEmail,
        setNickname,
        setAvatar,
        setAvatarPreview,
        setAddress,
        setAddressLine2,
        setCity,
        setStateName,
        setZipCode,
        setCurrentUserId,
        setError
      };
      
      fetchProfileData(profileId, setters);
    } else {
      setError("Invalid or missing profile ID");
    }
  }, [profileId]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HANDLER FUNCTIONS ===================== //
  ///////////////////////////////////////////////////////////////////////
  
  // --- Handler functions with proper context ---
  const handleAvatarChangeWithContext = (e) => {
    handleProfileAvatarChange(e, setAvatar, setAvatarError, setAvatarPreview);
  };

  const handleDeleteAvatarWithContext = () => {
    handleDeleteAvatar(setAvatar, setAvatarPreview);
  };

  const handleSubmitWithContext = (e) => {
    const profileData = {
      firstName,
      lastName,
      email,
      nickname,
      avatar,
      address,
      addressLine2,
      city,
      stateName,
      zipCode,
      currentUserId
    };
    
    const setters = {
      setError,
      setSuccessMessage,
      setUser,
      setAvatar,
      setAvatarPreview
    };
    
    handleProfileSubmit(e, profileData, setters, profileId, user);
  };

  ///////////////////////////////////////////////////////////////////////
  // ================================================================= //
  // ========================= JSX BELOW ============================= //
  // ================================================================= //
  ///////////////////////////////////////////////////////////////////////

  // Check if the logged-in user is viewing their own profile
  const isOwnProfile = user && user.id && currentUserId && (user.id === currentUserId);

  // Display loading or error state before rendering the form
  if (!currentUserId && !error) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  // Optionally show a more prominent error display if fetching failed completely
  if (error && !currentUserId) {
    return <div className={styles.error}>{error}</div>;
  }

  // Create modified versions of the components for read-only mode
  const ReadOnlyPersonalDetails = (
    <div className={styles.inputContainer}>
      <h2 className={styles.inputHeader}>Personal Details</h2>
      <p className={styles.inputLabel}>First Name:</p>
      <input
        type="text"
        value={firstName}
        readOnly
        className={`${styles.inputField} ${styles.readOnly}`}
      />
      <p className={styles.inputLabel}>Last Name:</p>
      <input
        type="text"
        value={lastName}
        readOnly
        className={`${styles.inputField} ${styles.readOnly}`}
      />
      <p className={styles.inputLabel}>Email:</p>
      <input
        type="email"
        value={email}
        readOnly
        className={`${styles.inputField} ${styles.readOnly}`}
      />
    </div>
  );

  return (
    <form onSubmit={isOwnProfile ? handleSubmitWithContext : (e) => e.preventDefault()} className={styles.registerForm} autoComplete="off">
      {/* ============ Section Header =========== */}
      <h1 className={styles.registerTitle}>{isOwnProfile ? "Edit Profile" : "View Profile"}</h1>

      {/* ============ PERSONAL DETAILS SECTION ============  */}
      {isOwnProfile ? (
        <PersonalDetailsDiv 
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          // No password fields for profile editing
          password=""
          setPassword={() => {}}
          confirmPassword=""
          setConfirmPassword={() => {}}
          capitalizeWords={capitalizeWords}
        />
      ) : ReadOnlyPersonalDetails}

      {/* ============ PROFILE & AVATAR SECTION ============  */}
      {isOwnProfile ? (
        <ProfileDiv 
          nickname={nickname}
          setNickname={setNickname}
          avatarPreview={avatarPreview}
          avatarError={avatarError}
          handleAvatarChange={handleAvatarChangeWithContext}
          handleDeleteAvatar={handleDeleteAvatarWithContext}
        />
      ) : (
        <div className={styles.inputContainer}>
          <h2 className={styles.inputHeader}>Profile</h2>
          
          {avatarPreview && (
            <div className={styles.avatarPreviewContainer}>
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className={styles.avatarPreview}
                onError={(e) => { e.target.onerror = null; e.target.src="/path/to/default/avatar.png"; }}
              />
            </div>
          )}
          
          <p className={styles.inputLabelNick}>Nickname:</p>
          <input
            type="text"
            value={nickname}
            readOnly
            className={`${styles.inputField} ${styles.readOnly}`}
          />
        </div>
      )}

      {/* ============ FULL ADDRESS SECTION ============  */}
      {isOwnProfile ? (
        <FullAddressDiv 
          address={address}
          setAddress={setAddress}
          addressLine2={addressLine2}
          setAddressLine2={setAddressLine2}
          city={city}
          setCity={setCity}
          stateName={stateName}
          setStateName={setStateName}
          zipCode={zipCode}
          setZipCode={setZipCode}
          capitalizeWords={capitalizeWords}
        />
      ) : (
        <div className={styles.inputContainer}>
          <h2 className={styles.inputHeader}>Full Address</h2>
          
          <p className={styles.inputLabel}>Address:</p>
          <input type="text" value={address} readOnly className={`${styles.inputField} ${styles.readOnly}`} />
          
          <p className={styles.inputLabel}>Apartment / Unit:</p>
          <input type="text" value={addressLine2} readOnly className={`${styles.inputField} ${styles.readOnly}`} />
          
          <p className={styles.inputLabel}>City / Suburb:</p>
          <input type="text" value={city} readOnly className={`${styles.inputField} ${styles.readOnly}`} />
          
          <p className={styles.inputLabel}>State / Region:</p>
          <input type="text" value={stateName} readOnly className={`${styles.inputField} ${styles.readOnly}`} />
          
          <p className={styles.inputLabel}>Zip Code / Postcode:</p>
          <input type="text" value={zipCode} readOnly className={`${styles.inputField} ${styles.readOnly}`} />
        </div>
      )}

      {/* Only show Save Changes button if it's the user's own profile */}
      {isOwnProfile && (
        <button type="submit" className={styles.registerButton}>
          Save Changes
        </button>
      )}

      {/* Always show Return Home button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className={styles.homeButton || styles.registerButton}
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