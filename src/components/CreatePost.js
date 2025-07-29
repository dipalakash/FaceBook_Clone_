"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Image, Video, X } from "lucide-react";
import "./CreatePost.css";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [mediaType, setMediaType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];
    const newFiles = [];

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setError("One of the files exceeds 10MB limit");
        return;
      }

      if (!file.type.startsWith("image/")) return;

      newFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setMediaFiles((prev) => [...prev, ...newFiles]);
    setMediaType("image");
    setError("");
  };

  const removeMediaAtIndex = (indexToRemove) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    // POST /api/auth/verify-otp
    const verifyOtp = async ({ email, otp }) => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "OTP verification failed");
        return data;
      } catch (error) {
        throw error;
      }
    };

    e.preventDefault();

    if (!content && mediaFiles.length === 0) return;
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("content", content);

      mediaFiles.forEach((file) => {
        formData.append("media", file); // append multiple
      });

      formData.append("mediaType", mediaType);

      const res = await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onPostCreated(res.data);
      setContent("");
      setMediaFiles([]);
      setMediaType("");
      setMediaPreviews([]);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // ---video posted----------->

  
  const handleVideoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 50 * 1024 * 1024) {
    setError("Video exceeds 50MB limit");
    return;
  }

  if (!file.type.startsWith("video/")) {
    setError("Only video files are allowed");
    return;
  }

  setMediaFiles([file]);
  setMediaPreviews([]); // or show thumbnail via video element if desired
  setMediaType("video");
  setError("");
};

  return (
    <div className="create-post">
      <div className="create-post-header">
        <img
          src={user?.profilePicture || "/placeholder.svg?height=40&width=40"}
          alt={user?.firstName}
          className="user-avatar"
        />
        <textarea
          placeholder={`What's on your mind, ${user?.firstName}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="post-input"
        />
      </div>

      {error && <div className="post-error">{error}</div>}

      {mediaPreviews.length > 0 && (
        <div className="media-preview-multiple">
          {mediaPreviews.map((preview, index) => (
            <div key={index} className="media-thumb-wrapper">
              <img
                src={preview}
                alt={`Preview ${index}`}
                className="media-thumb"
              />
              <button
                className="remove-thumb"
                onClick={() => removeMediaAtIndex(index)}
                title="Remove"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="create-post-actions">
        <div className="media-buttons">
          <label className="media-button">
            <Image size={20} />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMediaChange}
              style={{ display: "none" }}
            />
          </label>

          {/* Optional: disable video upload if multiple image upload active */}
          <label className="media-button">
            <Video size={20} />
            <span>Video</span>
            {/* <input
              type="file"
              accept="video/*"
              disabled={mediaPreviews.length > 0}
              style={{ display: "none" }}
            /> */}
            <input
              type="file"
              accept="video/*"
              disabled={mediaPreviews.length > 0}
              onChange={handleVideoChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <button
          className="post-button"
          onClick={handleSubmit}
          disabled={isSubmitting || (!content && mediaFiles.length === 0)}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
