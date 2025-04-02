import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import './RegisterForm.module.css';

///////////////////////////////////////////////////////////////////////
// ========================= PROFILE COMPONENT ======================== //
///////////////////////////////////////////////////////////////////////

function Profile() {

    ///////////////////////////////////////////////////////////////////////
    // ========================= STATE VARIABLES ========================= //
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
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [currentUserId, setCurrentUserId] = useState(''); // User ID
    const { user, setUser } = useContext(AuthContext); // Get user and setUser from context
    const { userId: profileId } = useParams(); // Get userId from URL

    ///////////////////////////////////////////////////////////////////////
    // ========================= USE EFFECT HOOK ========================= //
    ///////////////////////////////////////////////////////////////////////

    useEffect(() => {
        // Fetch user data on component mount
        console.log("Profile component mounted/updated.");
        console.log("profileId:", profileId);
        console.log("user from AuthContext:", user);

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/profile/${profileId}`); // Fetch user data from backend

                console.log("Raw response status:", response.status); // Add log - Check the HTTP status
                console.log("Raw response data:", response.data);   // Add log - Inspect the entire response

                if (response.status === 200) {
                    // Log before the check
                    console.log("Checking response.data.user:", response.data ? response.data.user : 'response.data is falsy');

                    if (response.data && response.data.user) { // <---- ADD THIS CHECK (ALREADY PRESENT, KEEP IT!)
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
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
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

        if (profileId) {
            fetchUserData();
        } else {
            setError('User ID not found in URL');
        }
    }, [profileId, user, setUser]); // <---- ADD setUser to the dependency array

    ///////////////////////////////////////////////////////////////////////
    // ========================= AVATAR HANDLERS ======================= //
    ///////////////////////////////////////////////////////////////////////

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);

        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            setAvatarPreview(null);
        }
    };

    const handleUploadAvatar = async () => {
        if (!avatar) {
            setError('Please select an avatar to upload.');
            return;
        }

        setUploadingAvatar(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('avatar', avatar);

            const response = await axios.post(`/api/upload-avatar/${profileId}`, formData, {  // Use formData here
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
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
                avatar, // Send the URL
                address,
                city,
                zipCode,
            });

            if (response.status === 200) {
                console.log('Profile updated successfully');
                setSuccessMessage('Profile updated successfully!'); // Set success message
                // Update user context if the updated profile matches the current user
                if (user && setUser && user.USER_ID === currentUserId) {
                    console.log("setUser function:", setUser); // Add this line
                    setUser({
                        ...user,
                        USER_FIRSTNAME: firstName,
                        USER_LASTNAME: lastName,
                        USER_EMAIL: email,
                        USER_NICKNAME: nickname,
                        USER_AVATAR: avatar, // Update with the Avatar URL
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
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Edit Profile</h2>
            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>} {/* Render success message */}
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Nickname (Required)"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
            <label htmlFor="avatar-upload">Upload Avatar:</label>
            <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar || avatarUploaded}
            />
            {avatarPreview && (
                <div className="avatar-preview-container">
                    <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="avatar-preview"
                    />
                    {!avatarUploaded && (
                        <button type="button" onClick={handleUploadAvatar} disabled={uploadingAvatar}>
                            {uploadingAvatar ? 'Uploading...' : 'Upload'}
                        </button>
                    )}
                    {avatarUploaded && (
                        <button type="button" onClick={handleDeleteAvatar} className="delete-button">
                            X
                        </button>
                    )}
                </div>
            )}
            <input
                type="text"
                placeholder="Address (Optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <input
                type="text"
                placeholder="City (Optional)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <input
                type="text"
                placeholder="Zip Code (Optional)"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
            />
            <button type="submit">Update Profile</button>
        </form>
    );
}

export default Profile;