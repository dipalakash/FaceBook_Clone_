"use client";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css"; // Optional CSS styling

const EditProfile = () => {
  const { user, refreshUser } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (profilePicture) formData.append("profilePicture", profilePicture);
    if (coverPhoto) formData.append("coverPhoto", coverPhoto);

    try {
      await axios.patch(
        `http://localhost:5000/api/users/${user._id}/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await refreshUser(); // update context
      alert("Profile updated successfully!");
      navigate("/userprofile/" + user._id);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <div>
          <label>New Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>
        <div>
          <label>New Cover Photo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverPhoto(e.target.files[0])}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
