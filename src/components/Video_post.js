import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Video_post.css"; // Create this file like Image_post.css or reuse if layout is same

const Video_post = () => {
  const [videoPosts, setVideoPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserVideos = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/users/${user._id}/posts`);
        const allPosts = res.data || [];
        const videosOnly = allPosts.filter((post) => post.mediaType === "video");
        setVideoPosts(videosOnly);
      } catch (err) {
        console.error("Error fetching user's video posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserVideos();
  }, [user]);

  return (
    <div className="video-posts-container">
      <h2>My Video Posts</h2>

      {loading ? (
        <div>Loading...</div>
      ) : videoPosts.length === 0 ? (
        <div>No video posts yet!</div>
      ) : (
        <div className="video-posts-grid">
          {videoPosts.map((post) => (
            <div key={post._id} className="video-post-card">
              <video
                src={`http://localhost:5000${post.media}?t=${Date.now()}`}
                className="video-post-player"
                controls
                onClick={() => navigate(`/post/${post._id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Video_post;
