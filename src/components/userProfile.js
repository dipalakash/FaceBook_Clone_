// "use client";

// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import CreatePost from "../components/CreatePost";
// import Post from "../components/Post";
// import "./userProfile.css";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const UserProfile = () => {
//   const [posts, setPosts] = useState([]);
//   const [profileUser, setProfileUser] = useState(null);
//   const [loadingPosts, setLoadingPosts] = useState(true);
//   const [error, setError] = useState("");

//   const { id } = useParams();
//   const { loading: authLoading, user } = useAuth();
//   const navigate = useNavigate();

//   // ✅ Stable fetchData with useCallback
//   const fetchData = useCallback(async () => {
//     try {
//       setLoadingPosts(true);

//       const userRes = await axios.get(`http://localhost:5000/api/users/${id}`);
//       setProfileUser(userRes.data);

//       const postsRes = await axios.get(`http://localhost:5000/api/users/${id}/posts`);
//       if (Array.isArray(postsRes.data)) {
//         setPosts(postsRes.data);
//       } else {
//         setError("Error loading posts. Invalid data format.");
//       }
//     } catch (err) {
//       console.error("Error fetching profile or posts:", err);
//       setError("Error loading profile or posts.");
//     } finally {
//       setLoadingPosts(false);
//     }
//   }, [id]); // Only depends on ID from route params

//   // ✅ useEffect now properly depends on fetchData
//   useEffect(() => {
//     if (!authLoading) {
//       fetchData();
//     }
//   }, [authLoading, fetchData]);

//   const addNewPost = () => fetchData();
//   const updatePost = () => fetchData();
//   const handlePostDeleted = () => fetchData();

//   const formatImage = (url) => {
//     if (!url) return null;
//     return url.startsWith("http") ? url : `http://localhost:5000${url}`;
//   };

//   return (
//     <div className="home-container">
//       {authLoading ? (
//         <div className="loading">Checking login status...</div>
//       ) : (
//         <>
//           {profileUser && (
//             <div className="profile-header-container">
//               <div className="cover-photo-wrapper">
//                 <img
//                   src={formatImage(profileUser.coverPhoto) || "/default-cover.jpg"}
//                   alt="Cover"
//                   className="cover-photo"
//                 />
//                 {user?._id === id && (
//                   <button
//                     className="edit-cover-btn"
//                     onClick={() => navigate("/edit-profile")}
//                   >
//                     Edit Cover Photo
//                   </button>
//                 )}
//               </div>

//               <div className="profile-header">
//                 <img
//                   src={formatImage(profileUser.profilePicture) || "/placeholder.svg"}
//                   alt="Profile"
//                   className="profile-picture"
//                 />

//                 <div className="profile-name-section">
//                   <div className="profile-name-row">
//                     <h2 className="profile-name">
//                       {profileUser.firstName} {profileUser.lastName}
//                     </h2>

//                     {user?._id === id && (
//                       <button
//                         onClick={() => navigate("/edit-profile")}
//                         className="edit-profile-button"
//                       >
//                         Edit Profile
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="feed">
//             {user?._id === id && <CreatePost onPostCreated={addNewPost} />}

//             {loadingPosts ? (
//               <div className="loading">Loading posts...</div>
//             ) : error ? (
//               <div className="error-message">{error}</div>
//             ) : posts.length === 0 ? (
//               <div className="no-posts">No posts yet. Be the first to post!</div>
//             ) : (
//               posts.map((post) => (
//                 <Post
//                   key={post._id}
//                   post={post}
//                   onPostUpdated={updatePost}
//                   onPostDeleted={handlePostDeleted}
//                 />
//               ))
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default UserProfile;
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import "./userProfile.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const { loading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoadingPosts(true);

      const userRes = await axios.get(`http://localhost:5000/api/users/${id}`);
      setProfileUser(userRes.data);

      const postsRes = await axios.get(`http://localhost:5000/api/users/${id}/posts`);
      if (Array.isArray(postsRes.data)) {
        setPosts(postsRes.data);
      } else {
        setError("Error loading posts. Invalid data format.");
      }
    } catch (err) {
      console.error("Error fetching profile or posts:", err);
      setError("Error loading profile or posts.");
    } finally {
      setLoadingPosts(false);
    }
  }, [id]);

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);

  const addNewPost = (post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletedPostId)
    );
  };

  const formatImage = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `http://localhost:5000${url}`;
  };

  return (
    <div className="home-container">
      {authLoading ? (
        <div className="loading">Checking login status...</div>
      ) : (
        <>
          {profileUser && (
            <div className="profile-header-container">
              <div className="cover-photo-wrapper">
                <img
                  src={formatImage(profileUser.coverPhoto) || "/default-cover.jpg"}
                  alt="Cover"
                  className="cover-photo"
                />
                {user?._id === id && (
                  <button
                    className="edit-cover-btn"
                    onClick={() => navigate("/edit-profile")}
                  >
                    Edit Cover Photo
                  </button>
                )}
              </div>

              <div className="profile-header">
                <img
                  src={formatImage(profileUser.profilePicture) || "/placeholder.svg"}
                  alt="Profile"
                  className="profile-picture"
                />
                <div className="profile-name-section">
                  <div className="profile-name-row">
                    <h2 className="profile-name">
                      {profileUser.firstName} {profileUser.lastName}
                    </h2>
                    {user?._id === id && (
                      <button
                        onClick={() => navigate("/edit-profile")}
                        className="edit-profile-button"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="feed">
            {user?._id === id && <CreatePost onPostCreated={addNewPost} />}

            {loadingPosts ? (
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
        </>
      )}
    </div>
  );
};

export default UserProfile;
