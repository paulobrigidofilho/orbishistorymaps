//  ========== Component imports  ========== //
import React, { useState } from 'react';
import axios from 'axios';
import './RegisterForm.module.css';

// ========================= REGISTER FORM COMPONENT ======================== //

function RegisterForm() {
  // ========================= STATE VARIABLES ========================= //
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUploaded, setAvatarUploaded] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');

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
      setError('Please select an avatar to upload.');
      return;
    }

    setUploadingAvatar(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('avatar', avatar);

      const response = await axios.post('/api/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Avatar uploaded successfully');
        setAvatarUploaded(true);
        setAvatarPreview(response.data.avatarUrl);
        setAvatar(response.data.avatarUrl);
      } else {
        setError('Avatar upload failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setError('Avatar upload failed: ' + error.message);
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
    setError('');

    let avatarUrl = avatar;

    if (!avatarUrl && avatar) { // Only upload if a new avatar is chosen
      try {
        const formData = new FormData();
        formData.append('avatar', avatar);

        const response = await axios.post('/api/upload-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          avatarUrl = response.data.avatarUrl;
        } else {
          setError('Avatar upload failed: ' + (response.data?.message || 'Unknown Error'));
          return;
        }
      } catch (uploadError) {
        console.error("Avatar upload error:", uploadError);
        setError('Avatar upload failed: ' + (uploadError.response?.data?.message || uploadError.message || 'Unknown Error'));
        return;
      }
    }

    try {
      const response = await axios.post('/api/register', {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        nickname,
        avatar: avatarUrl,
        address,
        city,
        zipCode,
      });

      if (response.status === 201) {
        console.log('Registration successful');
        // Redirect to login or profile page after successful registration
      } else {
        setError(response.data?.message || 'Registration failed');
      }
    } catch (registerError) {
      console.error('Registration error:', registerError);
      setError(registerError.response?.data?.message || registerError.message || 'Registration failed');
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <form onSubmit={handleSubmit} className="register-form">
      {error && <div className="error">{error}</div>}
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
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
        disabled={uploadingAvatar || avatarUploaded} // Disable while uploading or after successful upload
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
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="text"
        placeholder="Zip Code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;