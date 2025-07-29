"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaImage, FaVideo, FaBookmark, FaUser } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/posts");
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else {
          setError("Error loading posts. Invalid data format.");
        }
      } catch (error) {
        setError("Error loading posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const addNewPost = (post) => {
    if (post && post._id && post.user) {
      setPosts((prevPosts) => [post, ...prevPosts]);
    }
  };

  const updatePost = (updatedPost) => {
    if (updatedPost && updatedPost._id && updatedPost.user) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    }
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletedPostId)
    );
  };

  const formatProfilePicture = (picturePath) => {
    if (!picturePath) return "/placeholder.svg?height=40&width=40";
    return picturePath.startsWith("http")
      ? picturePath
      : `http://localhost:5000${picturePath}`;
  };

  return (
    <div className="home-layout">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="left-profile">
          {/* <img
            src={
              user?.profilePicture
                ? `http://localhost:5000${user.profilePicture}`
                : "/placeholder.svg?height=50&width=50"
            }
            alt="Profile"
            className="left-profile-img"
          /> */}
          <img
            src={formatProfilePicture(user.profilePicture)}
            alt={user.firstName}
            className="user-avatar"
            onClick={() => navigate(`/userprofile/${user._id}`)} // ✅ Navigate to edit profile
          />
          <h3>
            {user?.firstName} {user?.lastName}
          </h3>
          <button
            onClick={() => navigate(`/userprofile/${user?._id}`)}
            className="view-btn"
          >
            View Profile
          </button>
        </div>
        <ul className="left-menu">
          <li onClick={() => navigate("/my-images")}>
            <FaImage /> My Images
          </li>
          <li onClick={() => navigate("/my-videos")}>
            <FaVideo /> My Videos
          </li>
          <li onClick={() => alert("Saved Posts clicked")}>
            <FaBookmark /> Saved Posts
          </li>
        </ul>
      </div>

      {/* Feed Area */}
      <div className="main-feed">
        <CreatePost onPostCreated={addNewPost} />
        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">No posts yet. Be the first to post!</div>
        ) : (
          posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              onPostUpdated={updatePost}
              onPostDeleted={handlePostDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
