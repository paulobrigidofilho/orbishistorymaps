///////////////////////////////////////////////////////////////////////
// =================== REGISTER FORM COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

// This component handles the user registration form fields including
// personal details, profile information, and full address.

//  ========== Module imports  ========== //
import styles from "./Auth.module.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

//  ========== Component imports  ========== //
import PersonalDetailsDiv from "./components/PersonalDetailsDiv";
import ProfileDiv from "./components/ProfileDiv";
import FullAddressDiv from "./components/FullAddressDiv";

//  ========== Button imports  ========== //
import { SubmitBtn } from "./btn";

//  ========== Function imports  ========== //
import handleAvatarChange from "./functions/handleAvatarChange";
import handleDeleteAvatar from "./functions/handleDeleteAvatar";
import handleSubmitRegistration from "./functions/handleSubmitRegistration";
import useRedirectAfterRegistration from "./functions/useRedirectAfterRegistration";

//  ========== Helper imports  ========== //
import capitalizeWords from "./helpers/capitalizeWords";

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
  const [pendingUpload, setPendingUpload] = useState(false); // Add this
  const [address, setAddress] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("New Zealand");

  // --- Registration State ---
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // --- Error and Success Messages ---
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [avatarError, setAvatarError] = useState("");

  // --- Apply the redirect hook ---
  useRedirectAfterRegistration(
    registrationSuccess,
    setSuccessMessage,
    navigate
  );

  // --- Handler functions with proper context ---
  const handleAvatarChangeWithContext = (e) => {
    handleAvatarChange(e, setAvatar, setAvatarError, setAvatarPreview);
    if (e.target.files[0]) {
      setPendingUpload(true);
    } else {
      setPendingUpload(false);
    }
  };

  const handleDeleteAvatarWithContext = () => {
    setAvatar(null);
    setAvatarPreview(null);
    setPendingUpload(false);
    const avatarInput = document.getElementById("avatar-upload");
    if (avatarInput) {
      avatarInput.value = "";
    }
  };

  const handleSubmitWithContext = (e) => {
    const formData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      nickname,
      avatar,
      address,
      addressLine2,
      city,
      stateName,
      zipCode,
      country,
    };

    const setters = {
      setError,
      setSuccessMessage,
      setRegistrationSuccess,
      setUser,
    };

    handleSubmitRegistration(e, formData, setters);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <form
      onSubmit={handleSubmitWithContext}
      className={styles.registerForm}
      autoComplete="off"
    >
      {/* ============ Section Header =========== */}
      <h1 className={styles.registerTitle}>Register</h1>

      {/* ============ PERSONAL DETAILS SECTION ============  */}
      <PersonalDetailsDiv
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        capitalizeWords={capitalizeWords}
        showPasswordFields={true}
      />

      {/* ============ PROFILE & AVATAR SECTION ============  */}
      <ProfileDiv
        nickname={nickname}
        setNickname={setNickname}
        avatarPreview={avatarPreview}
        avatarError={avatarError}
        handleAvatarChange={handleAvatarChangeWithContext}
        handleDeleteAvatar={handleDeleteAvatarWithContext}
        pendingUpload={pendingUpload}
        isRegistrationMode={true}
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
        country={country}
        setCountry={setCountry}
        capitalizeWords={capitalizeWords}
      />

      {/* Tag for Required Fields */}
      <p className={styles.requiredNote}>* Required Fields</p>

      {/* Submit Button */}
      <SubmitBtn variant="register" />

      {/* Messages to be displayed */}
      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}
    </form>
  );
}

export default RegisterForm;
