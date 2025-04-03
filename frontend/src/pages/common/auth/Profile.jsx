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
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [avatarUploaded, setAvatarUploaded] = useState(false);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); 
    const [currentUserId, setCurrentUserId] = useState(''); 
    const { user, setUser } = useContext(AuthContext);
    const { userId: profileId } = useParams(); 

    ///////////////////////////////////////////////////////////////////////
    // ========================= USE EFFECT HOOK ======================= //
    ///////////////////////////////////////////////////////////////////////

    useEffect(() => {
        // Fetch user data on component mount
        console.log("Profile component mounted/updated.");
        console.log("profileId:", profileId);
        console.log("user from AuthContext:", user);

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/profile/${profileId}`); // Fetch user data from backend


                if (response.status === 200) {

                    if (response.data && response.data.user) { 
                        const userData = response.data.user;
                        setFirstName(userData.USER_FIRSTNAME || '');
                        setLastName(userData.USER_LASTNAME || '');
                        setEmail(userData.USER_EMAIL || '');
                        setNickname(userData.USER_NICKNAME || '');
                        setAvatar(userData.USER_AVATAR || null); //Store the Avatar URL
                        setAvatarPreview(userData.USER_AVATAR || null); //Store the Avatar URL
                        setAddress(userData.USER_ADDRESS || '');
                        setCity(userData.USER_CITY || '');
                        setZipCode(userData.USER_ZIPCODE || '');
                        setCurrentUserId(userData.USER_ID || '');
                    } else {
                        setError('Failed to load profile data: User data is missing');
                        console.error('Backend response OK (200), but user data key is missing or falsy in:', response.data); // Add detailed log
                    }
                } else if (response.status === 404) {
                    setError('Profile not found'); // Handle 404 explicitly
                }
                else {
                    setError(`Failed to load profile data (Status: ${response.status})`);
                }
            } catch (error) {

                console.error('Error fetching profile data:', error);

                if (error.response) {
                    // The request was made and the server responded with a status code that falls out of the range of 2xx
                    console.error("Error response data:", error.response.data);
                    console.error("Error response status:", error.response.status);
                    setError(`Failed to load profile data (Server Error: ${error.response.status}) - ${error.response.data.message || 'No message'}`);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error("Error request:", error.request);
                    setError('Failed to load profile data: No response from server');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error message:', error.message);
                    setError('Failed to load profile data: Request setup error');
                }
            }
        };

        if (profileId) { // Check if profileId is available in the URL
            fetchUserData();
        } else {
            setError('User ID not found in URL');
        }
    }, [profileId, user, setUser]); // Fetch user data when component mounts or profileId changes

    ///////////////////////////////////////////////////////////////////////
    // ========================= AVATAR HANDLERS ======================= //
    ///////////////////////////////////////////////////////////////////////

    // ================== Avatar Upload Handler ================== //

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);

        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            setAvatarPreview(null);
        }
    };

    // ================== Avatar Upload Function ================== //

    const handleUploadAvatar = async () => {
        if (!avatar) {
            setError('Please select an avatar to upload.');
            return;
        }

        setUploadingAvatar(true);
        setError('');

        try {
            const formData = new FormData(); // Create a new FormData object
            formData.append('avatar', avatar); // Append the file to the form data

            const response = await axios.post(`/api/upload-avatar/${profileId}`, formData, {  
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
                },
            });

            if (response.status === 200) {
                console.log('Avatar uploaded successfully');
                setAvatarUploaded(true);
                setAvatarPreview(response.data.avatarUrl);
                setAvatar(response.data.avatarUrl); //Store the Avatar URL

            } else {
                setError('Avatar upload failed.');
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            setError('Avatar upload failed.');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleDeleteAvatar = () => {
        setAvatar(null);
        setAvatarPreview(null);
        setAvatarUploaded(false);
    };

    ///////////////////////////////////////////////////////////////////////
    // ========================= SUBMIT HANDLER ======================== //
    ///////////////////////////////////////////////////////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');          // Clear any previous errors
        setSuccessMessage(''); // Clear any previous success message

        try {
            const response = await axios.put(`/api/profile/${profileId}`, {  // Send profile data as JSON
                firstName,
                lastName,
                email,
                nickname,
                avatar, 
                address,
                city,
                zipCode,
            });

            if (response.status === 200) {
                console.log('Profile updated successfully');
                setSuccessMessage('Profile updated successfully!'); 

                if (user && setUser && user.USER_ID === currentUserId) { // Check if the user is the same as the one being updated
                    console.log("setUser function:", setUser); 
                    setUser({
                        ...user,
                        USER_FIRSTNAME: firstName,
                        USER_LASTNAME: lastName,
                        USER_EMAIL: email,
                        USER_NICKNAME: nickname,
                        USER_AVATAR: avatar, 
                        USER_ADDRESS: address,
                        USER_CITY: city,
                        USER_ZIPCODE: zipCode,
                    });
                }
            } else {
                setError('Profile update failed.');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setError('Profile update failed');
        }
    };

    ///////////////////////////////////////////////////////////////////////
    // ========================= JSX BELOW ============================= //
    ///////////////////////////////////////////////////////////////////////

    return (
        <form onSubmit={handleSubmit} className={styles.registerForm}>

            {/* ============ Section Header =========== */}
            <h1 className={styles.editProfileTitle}>Edit Profile</h1>

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

                <p className={styles.inputLabel}>Email:</p>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                />

            </div>

            {/* ============ PROFILE & AVATAR SECTION ============  */}

            <div className={styles.inputContainer}>

                <h2 className={styles.inputHeader}>Profile</h2>

                {avatarPreview && (
                    <div className={styles.avatarPreviewContainer}>
                        <img
                            src={avatarPreview}
                            alt="Avatar Preview"
                            className={styles.avatarPreview}
                        />

                    </div>
                )}

                <div className={styles.uploadAvatarSection}>
                  <label htmlFor="avatar-upload" className={styles.avatarLabel}>Avatar:</label>
                  <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={uploadingAvatar || avatarUploaded}
                      className={styles.inputField}
                  />
                  {!avatarUploaded && (
                      <button type="button" onClick={handleUploadAvatar} disabled={uploadingAvatar} className={styles.uploadButton}>
                          {uploadingAvatar ? 'Uploading...' : 'Upload'}
                      </button>
                  )}
                </div>

                <p className={styles.inputLabelNick}>Nickname:</p>
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

            <button type="submit" className={styles.registerButton}>Update Profile</button>

            {/*Alert Messages */}
            {error && <div className={styles.error}>{error}</div>}
            {successMessage && <div className={styles.success}>{successMessage}</div>}
            
        </form>
    );
}

export default Profile;