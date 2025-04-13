//  ========== Component imports  ========== //

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import styles from './Profile.module.css'; // Import CSS module for styling

///////////////////////////////////////////////////////////////////////
// ========================= PROFILE COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

function Profile() {

  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [avatarError, setAvatarError] = useState(''); // State for avatar error message
  const [successMessage, setSuccessMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const { user, setUser } = useContext(AuthContext);
  const { userId: profileId } = useParams();

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/profile/${profileId}`);

        if (response.status === 200 && response.data.user) {
          const userData = response.data.user;
          setFirstName(userData.USER_FIRSTNAME || '');
          setLastName(userData.USER_LASTNAME || '');
          setEmail(userData.USER_EMAIL || '');
          setNickname(userData.USER_NICKNAME || '');
          setAvatar(userData.USER_AVATAR || null);
          setAvatarPreview(userData.USER_AVATAR ? "http://localhost:4000" + userData.USER_AVATAR : null);
          setAddress(userData.USER_ADDRESS || '');
          setCity(userData.USER_CITY || '');
          setZipCode(userData.USER_ZIPCODE || '');
          setCurrentUserId(userData.USER_ID || '');
        } else {
          setError(response.status === 404 ? 'Profile not found' : 'Failed to load profile data');
          console.error('Fetch profile failed:', response);
        }
      } catch (err) {
        setError('Failed to fetch profile');
        console.error('Fetch profile error', err);
      }
    };

    if (profileId) fetchUserData();
    else setError('Profile ID is required');
  }, [profileId, user, setUser]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= AVATAR HANDLERS ======================= //
  // This code now implements the validation logic
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    // Reset error message
    setAvatarError("");

    if (file) {
      if (file.size > 1024 * 1024) { // 1MB Limit
        setAvatarError("Avatar must be less than 1MB.");
        setAvatar(null); // Reset the selected file
        setAvatarPreview(null);
        e.target.value = ""; // Clear the file input
        return;
      }

      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(file.name.toLowerCase());

      if (!extname) {
        setAvatarError("Invalid file type. Only .jpeg, .jpg, .png and .gif files are allowed!");
        setAvatar(null); // Reset the selected file
        setAvatarPreview(null);
        e.target.value = ""; // Clear the file input
        return;
      }

      // Validation is successful
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      // No file selected
      setAvatarPreview(null);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
  };
  ///////////////////////////////////////////////////////////////////////
  // ========================= SUBMIT HANDLER ======================== //
  //////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccessMessage('');

  try {
    // Use FormData for file uploads, similar to registration
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("nickname", nickname);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("zipCode", zipCode);
    
    // Only append avatar if it's a new File
    if (avatar instanceof File) {
      formData.append("avatar", avatar);
    } else if (typeof avatar === 'string') {
      // If it's an existing avatar URL, send it as is
      formData.append("avatarUrl", avatar);
    }

    const response = await axios.put(`/api/profile/${profileId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      setSuccessMessage('Profile updated successfully!');
      
      // Get the avatar URL from the response
      const avatarUrl = response.data.user?.USER_AVATAR || avatarPreview;
      
      if (user && setUser && user.USER_ID === currentUserId) {
        setUser({
          ...user,
          USER_FIRSTNAME: firstName,
          USER_LASTNAME: lastName,
          USER_EMAIL: email,
          USER_NICKNAME: nickname,
          USER_AVATAR: avatarUrl,
          USER_ADDRESS: address,
          USER_CITY: city,
          USER_ZIPCODE: zipCode
        });
      }
    } else {
      setError('Profile update failed.');
    }
  } catch (error) {
    setError('Profile update failed: ' + (error.response?.data?.message || error.message));
    console.error('Profile update error', error);
  }
};

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <h1 className={styles.editProfileTitle}>Edit Profile</h1>

      <div className={styles.inputContainer}>
        <h2 className={styles.inputHeader}>Personal Details</h2>
        <p className={styles.inputLabel}>First Name:</p>
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={styles.inputField} />
        <p className={styles.inputLabel}>Last Name:</p>
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={styles.inputField} />
        <p className={styles.inputLabel}>Email:</p>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.inputField} />
      </div>

      <div className={styles.inputContainer}>
        <h2 className={styles.inputHeader}>Profile</h2>

        <div className={styles.uploadAvatarSection}>
          <label htmlFor="avatar-upload" className={styles.avatarLabel}>Avatar:</label>
          <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} className={styles.inputField} />
          {avatarPreview && (
            <button type="button" onClick={handleDeleteAvatar} className={styles.deleteButton}>
              X
            </button>
          )}
        </div>

        {avatarError && (
          <div className={styles.avatarErrorMessage}>{avatarError}</div>
        )}

        {avatarPreview && (
          <div className={styles.avatarPreviewContainer}>
            <img src={avatarPreview} alt="Avatar Preview" className={styles.avatarPreview} />
          </div>
        )}

        <p className={styles.inputLabelNick}>Nickname:</p>
        <input type="text" placeholder="Nickname (Required)" value={nickname} onChange={(e) => setNickname(e.target.value)} className={styles.inputField} />

      </div>

      <div className={styles.inputContainer}>
        <h2 className={styles.inputHeader}>Full Address</h2>
        <p className={styles.inputLabel}>Address:</p>
        <input type="text" placeholder="Address (Optional)" value={address} onChange={(e) => setAddress(e.target.value)} className={styles.inputField} />
        <p className={styles.inputLabel}>City:</p>
        <input type="text" placeholder="City (Optional)" value={city} onChange={(e) => setCity(e.target.value)} className={styles.inputField} />
        <p className={styles.inputLabel}>Zip Code:</p>
        <input type="text" placeholder="Zip Code (Optional)" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className={styles.inputField} />
      </div>

      <button type="submit" className={styles.registerButton}>Save Changes</button>

      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}

    </form>
  );
}

export default Profile;