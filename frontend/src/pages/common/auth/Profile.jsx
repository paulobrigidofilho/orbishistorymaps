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
import handleCancelAvatarSelection from "./functions/handleCancelAvatarSelection";
import handleSubmitAvatar from "./functions/handleSubmitAvatar";

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
  const [storedAvatarPath, setStoredAvatarPath] = useState(null);
  const [pendingUpload, setPendingUpload] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUploadSuccess, setAvatarUploadSuccess] = useState(false);
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
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // --- Context and Routing ---
  const { user, setUser } = useContext(AuthContext);
  const { userId: profileId } = useParams();
  const navigate = useNavigate();

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const loadProfile = async () => {
      if (profileId && profileId !== "undefined") {
        setIsLoading(true);

        const setters = {
          setFirstName,
          setLastName,
          setEmail,
          setNickname,
          setAvatar,
          setAvatarPreview,
          setStoredAvatarPath,
          setAddress,
          setAddressLine2,
          setCity,
          setStateName,
          setZipCode,
          setCurrentUserId,
          setError,
        };

        await fetchProfileData(profileId, setters);
        setIsLoading(false);
      } else {
        setError("Invalid or missing profile ID");
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [profileId]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HANDLER FUNCTIONS ===================== //
  ///////////////////////////////////////////////////////////////////////

  // --- Handler functions with proper context ---
  const handleAvatarChangeWithContext = (e) => {
    handleProfileAvatarChange(
      e,
      setAvatar,
      setAvatarError,
      setAvatarPreview,
      setPendingUpload
    );
    if (e.target.files[0]) {
      setAvatarUploadSuccess(false);
    }
  };

  const handleCancelAvatarWithContext = () => {
    handleCancelAvatarSelection(
      setAvatar,
      setAvatarPreview,
      setPendingUpload,
      storedAvatarPath
    );
  };

  const handleUploadAvatarWithContext = async () => {
    const setters = {
      setPendingUpload,
      setAvatarUploading,
      setAvatarUploadSuccess,
      setAvatarError,
      setAvatar,
      setAvatarPreview,
      setStoredAvatarPath,
    };
    await handleSubmitAvatar(avatar, currentUserId, setters);
  };

  const handleDeleteAvatarWithContext = async () => {
    await handleDeleteAvatar(
      currentUserId,
      setAvatar,
      setAvatarPreview,
      setAvatarError
    );
    setStoredAvatarPath(null);
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
      currentUserId,
    };

    const setters = {
      setError,
      setSuccessMessage,
      setUser,
      setAvatar,
      setAvatarPreview,
    };

    handleProfileSubmit(e, profileData, setters, profileId, user);
  };

  // Check if the logged-in user is viewing their own profile
  const effectiveProfileId = currentUserId || profileId; // fallback to route id
  const isOwnProfile =
    user && user.id && effectiveProfileId && user.id === effectiveProfileId;

  // Display loading or error state before rendering the form
  if (isLoading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  // Optionally show a more prominent error display if fetching failed completely
  if (error && !currentUserId) {
    return <div className={styles.error}>{error}</div>;
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <form
      onSubmit={
        isOwnProfile ? handleSubmitWithContext : (e) => e.preventDefault()
      }
      className={styles.registerForm}
      autoComplete="off"
    >
      {/* ============ Section Header =========== */}
      <h1 className={styles.registerTitle}>
        {isOwnProfile ? "Edit Profile" : "View Profile"}
      </h1>

      {/* ============ PERSONAL DETAILS SECTION ============  */}
      <PersonalDetailsDiv
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        showPasswordFields={false} // Hide password fields
        capitalizeWords={capitalizeWords}
        readOnly={!isOwnProfile}
      />

      {/* ============ PROFILE & AVATAR SECTION ============  */}
      <ProfileDiv
        nickname={nickname}
        setNickname={setNickname}
        avatarPreview={avatarPreview}
        storedAvatarPath={storedAvatarPath}
        avatarError={avatarError}
        handleAvatarChange={handleAvatarChangeWithContext}
        handleDeleteAvatar={handleDeleteAvatarWithContext}
        handleCancelAvatarSelection={handleCancelAvatarWithContext}
        handleUploadAvatar={handleUploadAvatarWithContext}
        avatarUploadSuccess={avatarUploadSuccess}
        avatarUploading={avatarUploading}
        pendingUpload={pendingUpload}
        readOnly={!isOwnProfile}
        isRegistrationMode={false}
      />

      {/* ============ FULL ADDRESS SECTION ============  */}
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
        readOnly={!isOwnProfile}
      />

      {/* Only show Save Changes button if it's the user's own profile */}
      {isOwnProfile && (
        <button type="submit" className={styles.submitButton}>
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
