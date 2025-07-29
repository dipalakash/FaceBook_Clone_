import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Image_post.css";

const Image_post = () => {
  const [imagePosts, setImagePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserImages = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);

        const res = await axios.get(`http://localhost:5000/api/users/${user._id}/posts`);
        const allPosts = res.data || [];

        // Filter posts where mediaType is "image" and media is not empty
        const imageOnly = allPosts
          .filter((post) => post.mediaType === "image" && post.media && post.media.length)
          .flatMap((post) => {
            const mediaArray = Array.isArray(post.media) ? post.media : [post.media];
            return mediaArray.map((media) => ({
              _id: post._id,
              media,
            }));
          });

        setImagePosts(imageOnly);
      } catch (err) {
        console.error("Error fetching user's image posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserImages();
  }, [user]);

  return (
    <div className="image-posts-container">
      <h2>My Image Posts</h2>

      {loading ? (
        <div>Loading...</div>
      ) : imagePosts.length === 0 ? (
        <div>No image posts yet!</div>
      ) : (
        <div className="image-posts-grid">
          {imagePosts.map((item, index) => (
            <div key={`${item._id}-${index}`} className="image-post-card">
              <img
                src={`http://localhost:5000${item.media}?t=${Date.now()}`}
                alt="Post"
                className="image-post-img"
                onClick={() => navigate(`/post/${item._id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Image_post;
