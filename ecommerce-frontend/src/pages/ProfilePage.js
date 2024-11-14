// src/pages/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api'; // Assuming these functions are defined in api.js

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(); // Fetch profile data
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile data.');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(profile);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div>
      <h2>My Profile</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="profile-details">
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>
        <label>
          Address:
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>
      </div>
      {isEditing ? (
        <>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      )}
    </div>
  );
};

export default ProfilePage;
