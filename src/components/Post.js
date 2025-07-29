// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { Heart, MessageCircle, Share2, Users } from "lucide-react";
// import { FaEllipsisH } from "react-icons/fa";
// import CommentSection from "./CommentSection";
// import { useNavigate } from "react-router-dom";
// import "./Post.css";

// const Post = ({ post, onPostUpdated, onPostDeleted }) => {
//   const { user } = useAuth();
//   const [showComments, setShowComments] = useState(false);
//   const [isLiking, setIsLiking] = useState(false);
//   const [showLikes, setShowLikes] = useState(false);
//   const [likeUsers, setLikeUsers] = useState([]);
//   const [loadingLikes, setLoadingLikes] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editContent, setEditContent] = useState(post.content);
//   const [editMedia, setEditMedia] = useState(null);
//   const [previewMedia, setPreviewMedia] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setEditContent(post.content);
//   }, [post.content]);

//   const formatDate = (dateString) => {
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const hasLiked = user && post.likes.includes(user._id);

//  const formatProfilePicture = (picturePath) => {
//     if (!picturePath) return "/placeholder.svg?height=40&width=40";
//     return picturePath.startsWith("http")
//       ? picturePath
//       : `http://localhost:5000${picturePath}`;
//   };

//   const handleLike = async () => {
//     if (isLiking || !user) return;
//     setIsLiking(true);
//     try {

//        const res = await axios.put(
//         `http://localhost:5000/api/posts/${post._id}/like`
//       );

//       onPostUpdated(res.data);
//     } catch (error) {
//       console.error("Error liking post:", error);
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/posts/${post._id}`);
//       if (typeof onPostDeleted === "function") {
//         onPostDeleted(post._id);
//       }
//     } catch (err) {
//       console.error("Failed to delete post:", err);
//     }
//   };

//   const handleEdit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("content", editContent);
//       if (editMedia) {
//         formData.append("media", editMedia);
//         formData.append(
//           "mediaType",
//           editMedia.type.startsWith("video") ? "video" : "image"
//         );
//       }

//       const res = await axios.put(
//         `http://localhost:5000/api/posts/${post._id}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       onPostUpdated(res.data);
//       setShowEditModal(false);
//       setShowMenu(false);
//       setEditMedia(null);
//       setPreviewMedia(null);
//     } catch (error) {
//       console.error("Error editing post:", error);
//     }
//   };

//   const handleShowLikes = async () => {
//     if (post.likes.length === 0) return;
//     setShowLikes(!showLikes);
//     if (!showLikes && likeUsers.length === 0) {
//       setLoadingLikes(true);
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/posts/${post._id}/likes`
//         );
//         setLikeUsers(res.data);
//       } catch (error) {
//         console.error("Error fetching likes:", error);
//       } finally {
//         setLoadingLikes(false);
//       }
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setEditMedia(file);
//     if (file) {
//       setPreviewMedia(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div className="post">
//       <div className="post-header">
//         <img
//           src={formatProfilePicture(post.user.profilePicture)}
//           alt={post.user.firstName || "User"}
//           className="user-avatar hover-effect"
//           onClick={() => navigate("/userprofile/" + post.user._id)}
//         />
//         <div className="post-user-info">
//           <h4>
//             {post.user.firstName || "User"} {post.user.lastName || ""}
//           </h4>
//           <p className="post-time">{formatDate(post.createdAt)}</p>
//         </div>

//         {user?._id === post.user._id && (
//           <div className="post-options">
//             <button
//               className="post-menu-icon"
//               onClick={() => setShowMenu(!showMenu)}
//             >
//               <FaEllipsisH />
//             </button>
//             {showMenu && (
//               <div className="post-dropdown">
//                 <button
//                   onClick={() => {
//                     setShowEditModal(true);
//                     setShowMenu(false);
//                   }}
//                 >
//                   Edit Post
//                 </button>
//                 <button onClick={handleDelete}>Delete Post</button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="post-content">
//         <p>{post.content}</p>
//         {post.media && (
//           <div className="post-media">
//             {Array.isArray(post.media) ? (
//               post.media.map((mediaUrl, idx) =>
//                 post.mediaType === "image" ? (
//                  <img
//                     key={idx}
//                     src={`http://localhost:5000${mediaUrl}?t=${Date.now()}`}
//                     alt={`Post ${idx}`}
//                     className="post-image"
//                     style={{
//                       marginBottom: "10px",
//                       maxWidth: "100%",
//                       borderRadius: "8px",
//                     }}
//                   />
//                 ) : post.mediaType === "video" ? (
//                   // <video
//                   //   key={idx}
//                   //   src={http://localhost:5000${mediaUrl}?t=${Date.now()}}
//                   //   controls
//                   //   className="post-video"
//                   //   style={{
//                   //     marginBottom: "10px",
//                   //     maxWidth: "100%",
//                   //     borderRadius: "8px",
//                   //   }}
//                   // />
//                    <video
//                     key={idx}
//                     src={`http://localhost:5000${mediaUrl}?t=${Date.now()}`}
//                     controls
//                     className="post-video"
//                     style={{
//                       marginBottom: "10px",
//                       maxWidth: "100%",
//                       borderRadius: "8px",
//                     }}
//                   />

//                 ) : null
//               )
//             ) : post.mediaType === "image" ? (
//               <img
//                 src={`http://localhost:5000${post.media}?t=${Date.now()}`}
//                 alt="Post"
//                 className="post-image"
//               />
//             ) : post.mediaType === "video" ? (
//               <video
//                 src={`http://localhost:5000${post.media}?t=${Date.now()}`}
//                 controls
//                 className="post-video"
//               />
//             ) : null}
//           </div>
//         )}
//       </div>

//       <div className="post-stats">
//         <span className="likes-count" onClick={handleShowLikes}>
//           {post.likes.length} likes
//         </span>
//         <span>{post.comments.length} comments</span>
//       </div>

//       <div className="post-actions">
//         <button
//           className={`post-action-button ${hasLiked ? "liked" : ""}`}
//           onClick={handleLike}
//         >
//           <Heart size={20} className={hasLiked ? "filled" : ""} />
//           <span>Like</span>
//         </button>
//         <button
//           className="post-action-button"
//           onClick={() => setShowComments(!showComments)}
//         >
//           <MessageCircle size={20} />
//           <span>Comment</span>
//         </button>
//         <button
//           className="post-action-button"
//           onClick={() => alert("Share logic here")}
//         >
//           <Share2 size={20} />
//           <span>Share</span>
//         </button>
//       </div>

//       {showComments && (
//         <CommentSection
//           postId={post._id}
//           comments={post.comments}
//           onPostUpdated={onPostUpdated}
//         />
//       )}

//       {showLikes && (
//         <div className="likes-modal">
//           <div className="likes-modal-content">
//             <div className="likes-modal-header">
//               <h4>
//                 <Users size={16} /> People who liked this post
//               </h4>
//               <button
//                 className="close-modal"
//                 onClick={() => setShowLikes(false)}
//               >
//                 ×
//               </button>
//             </div>
//             <div className="likes-modal-body">
//               {loadingLikes ? (
//                 <p>Loading...</p>
//               ) : likeUsers.length === 0 ? (
//                 <p>No likes yet</p>
//               ) : (
//                 <ul className="likes-list">
//                   {likeUsers.map((likeUser) => (
//                     <li key={likeUser._id} className="like-user">
//                       <img
//                         src={formatProfilePicture(likeUser.profilePicture)}
//                         alt={likeUser.firstName}
//                         className="like-user-avatar"
//                       />
//                       <span>
//                         {likeUser.firstName} {likeUser.lastName}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {showEditModal && (
//         <div className="modal-overlay">
//           <div className="edit-modal">
//             <h3>Edit Post</h3>
//             <textarea
//               value={editContent}
//               onChange={(e) => setEditContent(e.target.value)}
//               rows={4}
//             />
//             <input
//               type="file"
//               accept="image/*,video/*"
//               onChange={handleFileChange}
//             />
//             {previewMedia && (
//               <div className="edit-preview">
//                 {editMedia?.type?.startsWith("image") ? (
//                   <img
//                     src={previewMedia}
//                     alt="Preview"
//                     className="post-image"
//                   />
//                 ) : editMedia?.type?.startsWith("video") ? (
//                   <video src={previewMedia} controls className="post-video" />
//                 ) : null}
//               </div>
//             )}
//             <div className="edit-actions">
//               <button className="btn-save" onClick={handleEdit}>
//                 Save
//               </button>
//               <button
//                 className="btn-cancel"
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setEditMedia(null);
//                   setPreviewMedia(null);
//                   setEditContent(post.content);
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Post;

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { Heart, MessageCircle, Share2, Users } from "lucide-react";
// import { FaEllipsisH } from "react-icons/fa";
// import CommentSection from "./CommentSection";
// import { useNavigate } from "react-router-dom";
// import Slider from "react-slick"; // slider import
// import "./Post.css";

// const Post = ({ post, onPostUpdated, onPostDeleted }) => {
//   const { user } = useAuth();
//   const [showComments, setShowComments] = useState(false);
//   const [isLiking, setIsLiking] = useState(false);
//   const [showLikes, setShowLikes] = useState(false);
//   const [likeUsers, setLikeUsers] = useState([]);
//   const [loadingLikes, setLoadingLikes] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editContent, setEditContent] = useState(post.content);
//   const [editMedia, setEditMedia] = useState(null);
//   const [previewMedia, setPreviewMedia] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setEditContent(post.content);
//   }, [post.content]);

//   const formatDate = (dateString) => {
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const hasLiked = user && post.likes.includes(user._id);

//   const formatProfilePicture = (picturePath) => {
//     if (!picturePath) return "/placeholder.svg?height=40&width=40";
//     return picturePath.startsWith("http")
//       ? picturePath
//       : `http://localhost:5000${picturePath}`;
//   };

//   const handleLike = async () => {
//     if (isLiking || !user) return;
//     setIsLiking(true);
//     try {
//       const res = await axios.put(
//         `http://localhost:5000/api/posts/${post._id}/like`
//       );
//       onPostUpdated(res.data);
//     } catch (error) {
//       console.error("Error liking post:", error);
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/posts/${post._id}`);
//       if (typeof onPostDeleted === "function") {
//         onPostDeleted(post._id);
//       }
//     } catch (err) {
//       console.error("Failed to delete post:", err);
//     }
//   };

//   const handleEdit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("content", editContent);
//       if (editMedia) {
//         formData.append("media", editMedia);
//         formData.append(
//           "mediaType",
//           editMedia.type.startsWith("video") ? "video" : "image"
//         );
//       }

//       const res = await axios.put(
//         `http://localhost:5000/api/posts/${post._id}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       onPostUpdated(res.data);
//       setShowEditModal(false);
//       setShowMenu(false);
//       setEditMedia(null);
//       setPreviewMedia(null);
//     } catch (error) {
//       console.error("Error editing post:", error);
//     }
//   };

//   const handleShowLikes = async () => {
//     if (post.likes.length === 0) return;
//     setShowLikes(!showLikes);
//     if (!showLikes && likeUsers.length === 0) {
//       setLoadingLikes(true);
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/posts/${post._id}/likes`
//         );
//         setLikeUsers(res.data);
//       } catch (error) {
//         console.error("Error fetching likes:", error);
//       } finally {
//         setLoadingLikes(false);
//       }
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setEditMedia(file);
//     if (file) {
//       setPreviewMedia(URL.createObjectURL(file));
//     }
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   };

//   return (
//     <div className="post">
//       <div className="post-header">
//         <img
//           src={formatProfilePicture(post.user.profilePicture)}
//           alt={post.user.firstName || "User"}
//           className="user-avatar hover-effect"
//           onClick={() => navigate("/userprofile/" + post.user._id)}
//         />
//         <div className="post-user-info">
//           <h4>
//             {post.user.firstName || "User"} {post.user.lastName || ""}
//           </h4>
//           <p className="post-time">{formatDate(post.createdAt)}</p>
//         </div>

//         {user?._id === post.user._id && (
//           <div className="post-options">
//             <button
//               className="post-menu-icon"
//               onClick={() => setShowMenu(!showMenu)}
//             >
//               <FaEllipsisH />
//             </button>
//             {showMenu && (
//               <div className="post-dropdown">
//                 <button
//                   onClick={() => {
//                     setShowEditModal(true);
//                     setShowMenu(false);
//                   }}
//                 >
//                   Edit Post
//                 </button>
//                 <button onClick={handleDelete}>Delete Post</button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="post-content">
//         <p>{post.content}</p>
//         {post.media && Array.isArray(post.media) && (
//           <div className="post-media">
//             <Slider {...sliderSettings}>
//               {post.media.map((mediaUrl, idx) =>
//                 post.mediaType === "image" ? (
//                   <img
//                     key={idx}
//                     src={`http://localhost:5000${mediaUrl}?t=${Date.now()}`}
//                     alt={`Post ${idx}`}
//                     className="post-image"
//                     style={{
//                       maxWidth: "100%",
//                       borderRadius: "10px",
//                       maxHeight: "500px",
//                     }}
//                   />
//                 ) : post.mediaType === "video" ? (
//                   <video
//                     key={idx}
//                     src={`http://localhost:5000${mediaUrl}?t=${Date.now()}`}
//                     controls
//                     className="post-video"
//                     style={{
//                       maxWidth: "100%",
//                       borderRadius: "10px",
//                       maxHeight: "500px",
//                     }}
//                   />
//                 ) : null
//               )}
//             </Slider>
//           </div>
//         )}
//       </div>

//       <div className="post-stats">
//         <span className="likes-count" onClick={handleShowLikes}>
//           {post.likes.length} likes
//         </span>
//         <span>{post.comments.length} comments</span>
//       </div>

//       <div className="post-actions">
//         <button
//           className={`post-action-button ${hasLiked ? "liked" : ""}`}
//           onClick={handleLike}
//         >
//           <Heart size={20} className={hasLiked ? "filled" : ""} />
//           <span>Like</span>
//         </button>
//         <button
//           className="post-action-button"
//           onClick={() => setShowComments(!showComments)}
//         >
//           <MessageCircle size={20} />
//           <span>Comment</span>
//         </button>
//         <button
//           className="post-action-button"
//           onClick={() => alert("Share logic here")}
//         >
//           <Share2 size={20} />
//           <span>Share</span>
//         </button>
//       </div>

//       {showComments && (
//         <CommentSection
//           postId={post._id}
//           comments={post.comments}
//           onPostUpdated={onPostUpdated}
//         />
//       )}

//       {showLikes && (
//         <div className="likes-modal">
//           <div className="likes-modal-content">
//             <div className="likes-modal-header">
//               <h4>
//                 <Users size={16} /> People who liked this post
//               </h4>
//               <button
//                 className="close-modal"
//                 onClick={() => setShowLikes(false)}
//               >
//                 ×
//               </button>
//             </div>
//             <div className="likes-modal-body">
//               {loadingLikes ? (
//                 <p>Loading...</p>
//               ) : likeUsers.length === 0 ? (
//                 <p>No likes yet</p>
//               ) : (
//                 <ul className="likes-list">
//                   {likeUsers.map((likeUser) => (
//                     <li key={likeUser._id} className="like-user">
//                       <img
//                         src={formatProfilePicture(likeUser.profilePicture)}
//                         alt={likeUser.firstName}
//                         className="like-user-avatar"
//                       />
//                       <span>
//                         {likeUser.firstName} {likeUser.lastName}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {showEditModal && (
//         <div className="modal-overlay">
//           <div className="edit-modal">
//             <h3>Edit Post</h3>
//             <textarea
//               value={editContent}
//               onChange={(e) => setEditContent(e.target.value)}
//               rows={4}
//             />
//             <input
//               type="file"
//               accept="image/*,video/*"
//               onChange={handleFileChange}
//             />
//             {previewMedia && (
//               <div className="edit-preview">
//                 {editMedia?.type?.startsWith("image") ? (
//                   <img
//                     src={previewMedia}
//                     alt="Preview"
//                     className="post-image"
//                   />
//                 ) : editMedia?.type?.startsWith("video") ? (
//                   <video src={previewMedia} controls className="post-video" />
//                 ) : null}
//               </div>
//             )}
//             <div className="edit-actions">
//               <button className="btn-save" onClick={handleEdit}>
//                 Save
//               </button>
//               <button
//                 className="btn-cancel"
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setEditMedia(null);
//                   setPreviewMedia(null);
//                   setEditContent(post.content);
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Post;

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { Heart, MessageCircle, Share2, Users } from "lucide-react";
// import { FaEllipsisH } from "react-icons/fa";
// import CommentSection from "./CommentSection";
// import { useNavigate } from "react-router-dom";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "./Post.css";

// const Post = ({ post, onPostUpdated, onPostDeleted }) => {
//   const { user } = useAuth();
//   const [showComments, setShowComments] = useState(false);
//   const [isLiking, setIsLiking] = useState(false);
//   const [showLikes, setShowLikes] = useState(false);
//   const [likeUsers, setLikeUsers] = useState([]);
//   const [loadingLikes, setLoadingLikes] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editContent, setEditContent] = useState(post.content);
//   const [editMedia, setEditMedia] = useState(null);
//   const [previewMedia, setPreviewMedia] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setEditContent(post.content);
//   }, [post.content]);

//   const formatDate = (dateString) => {
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const hasLiked = user && post.likes.includes(user._id);

//   const formatProfilePicture = (picturePath) => {
//     if (!picturePath) return "/placeholder.svg?height=40&width=40";
//     return picturePath.startsWith("http")
//       ? picturePath
//       : `http://localhost:5000${picturePath}`;
//   };

//   const handleLike = async () => {
//     if (isLiking || !user) return;
//     setIsLiking(true);
//     try {
//       const res = await axios.put(
//         `http://localhost:5000/api/posts/${post._id}/like`
//       );
//       onPostUpdated(res.data);
//     } catch (error) {
//       console.error("Error liking post:", error);
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/posts/${post._id}`);
//       if (typeof onPostDeleted === "function") {
//         onPostDeleted(post._id);
//       }
//     } catch (err) {
//       console.error("Failed to delete post:", err);
//     }
//   };

//   const handleEdit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("content", editContent);
//       if (editMedia) {
//         formData.append("media", editMedia);
//         formData.append(
//           "mediaType",
//           editMedia.type.startsWith("video") ? "video" : "image"
//         );
//       }

//       const res = await axios.put(
//         `http://localhost:5000/api/posts/${post._id}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       onPostUpdated(res.data);
//       setShowEditModal(false);
//       setShowMenu(false);
//       setEditMedia(null);
//       setPreviewMedia(null);
//     } catch (error) {
//       console.error("Error editing post:", error);
//     }
//   };

//   const handleShowLikes = async () => {
//     if (post.likes.length === 0) return;
//     setShowLikes(!showLikes);
//     if (!showLikes && likeUsers.length === 0) {
//       setLoadingLikes(true);
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/posts/${post._id}/likes`
//         );
//         setLikeUsers(res.data);
//       } catch (error) {
//         console.error("Error fetching likes:", error);
//       } finally {
//         setLoadingLikes(false);
//       }
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setEditMedia(file);
//     if (file) {
//       setPreviewMedia(URL.createObjectURL(file));
//     }
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true,
//   };

  
//     const mediaArray = Array.isArray(post.media) ? post.media : [post.media];

//     // Debug logs
//     console.log("post.media:", post.media);
//     console.log("mediaArray:", mediaArray);
//     console.log("mediaType:", post.mediaType);

  
  

//   return (
//     <div className="post">
//       <div className="post-header">
//         <img
//           src={formatProfilePicture(post.user.profilePicture)}
//           alt={post.user.firstName || "User"}
//           className="user-avatar hover-effect"
//           onClick={() => navigate("/userprofile/" + post.user._id)}
//         />
//         <div className="post-user-info">
//           <h4>
//             {post.user.firstName || "User"} {post.user.lastName || ""}
//           </h4>
//           <p className="post-time">{formatDate(post.createdAt)}</p>
//         </div>

//         {user?._id === post.user._id && (
//           <div className="post-options">
//             <button
//               className="post-menu-icon"
//               onClick={() => setShowMenu(!showMenu)}
//             >
//               <FaEllipsisH />
//             </button>
//             {showMenu && (
//               <div className="post-dropdown">
//                 <button
//                   onClick={() => {
//                     setShowEditModal(true);
//                     setShowMenu(false);
//                   }}
//                 >
//                   Edit Post
//                 </button>
//                 <button onClick={handleDelete}>Delete Post</button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       <div className="post-content">
//         <p>{post.content}</p>
//         {post.media && Array.isArray(post.media) && post.media.length > 0 && (
//           <div className="post-media">
//             <Slider {...sliderSettings}>
//               {post.media.map((mediaUrl, idx) => {
//                 const fullUrl = `http://localhost:5000${mediaUrl}`;
//                 if (post.mediaType === "image") {
//                   return (
//                     <div key={idx}>
//                       <img
//                         src={fullUrl}
//                         alt={`Post ${idx}`}
//                         className="post-image"
//                       />
//                     </div>
//                   );
//                 } else if (post.mediaType === "video") {
//                   return (
//                     <div key={idx}>
//                       <video src={fullUrl} controls className="post-video" />
//                     </div>
//                   );
//                 }
//                 return null;
//               })}
//             </Slider>
//           </div>
//         )}
//       </div>
//       <div className="post-stats">
//         <span className="likes-count" onClick={handleShowLikes}>
//           {post.likes.length} likes
//         </span>
//         <span>{post.comments.length} comments</span>
//       </div>
//       <div className="post-actions">
//         <button
//           className={`post-action-button ${hasLiked ? "liked" : ""}`}
//           onClick={handleLike}
//         >
//           <Heart size={20} className={hasLiked ? "filled" : ""} />
//           <span>Like</span>
//         </button>
//         <button
//           className="post-action-button"
//           onClick={() => setShowComments(!showComments)}
//         >
//           <MessageCircle size={20} />
//           <span>Comment</span>
//         </button>
//         <button
//           className="post-action-button"
//           onClick={() => alert("Share logic here")}
//         >
//           <Share2 size={20} />
//           <span>Share</span>
//         </button>
//       </div>
//       {showComments && (
//         <CommentSection
//           postId={post._id}
//           comments={post.comments}
//           onPostUpdated={onPostUpdated}
//         />
//       )}
//       {showLikes && (
//         <div className="likes-modal">
//           <div className="likes-modal-content">
//             <div className="likes-modal-header">
//               <h4>
//                 <Users size={16} /> People who liked this post
//               </h4>
//               <button
//                 className="close-modal"
//                 onClick={() => setShowLikes(false)}
//               >
//                 ×
//               </button>
//             </div>
//             <div className="likes-modal-body">
//               {loadingLikes ? (
//                 <p>Loading...</p>
//               ) : likeUsers.length === 0 ? (
//                 <p>No likes yet</p>
//               ) : (
//                 <ul className="likes-list">
//                   {likeUsers.map((likeUser) => (
//                     <li key={likeUser._id} className="like-user">
//                       <img
//                         src={formatProfilePicture(likeUser.profilePicture)}
//                         alt={likeUser.firstName}
//                         className="like-user-avatar"
//                       />
//                       <span>
//                         {likeUser.firstName} {likeUser.lastName}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//       {showEditModal && (
//         <div className="modal-overlay">
//           <div className="edit-modal">
//             <h3>Edit Post</h3>
//             <textarea
//               value={editContent}
//               onChange={(e) => setEditContent(e.target.value)}
//               rows={4}
//             />
//             <input
//               type="file"
//               accept="image/*,video/*"
//               onChange={handleFileChange}
//             />
//             {previewMedia && (
//               <div className="edit-preview">
//                 {editMedia?.type?.startsWith("image") ? (
//                   <img
//                     src={previewMedia}
//                     alt="Preview"
//                     className="post-image"
//                   />
//                 ) : editMedia?.type?.startsWith("video") ? (
//                   <video src={previewMedia} controls className="post-video" />
//                 ) : null}
//               </div>
//             )}
//             <div className="edit-actions">
//               <button className="btn-save" onClick={handleEdit}>
//                 Save
//               </button>
//               <button
//                 className="btn-cancel"
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setEditMedia(null);
//                   setPreviewMedia(null);
//                   setEditContent(post.content);
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // export default Post;


// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { Heart, MessageCircle, Share2, Users } from "lucide-react";
// import { FaEllipsisH } from "react-icons/fa";
// import CommentSection from "./CommentSection";
// import { useNavigate } from "react-router-dom";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "./Post.css";

// const Post = ({ post, onPostUpdated, onPostDeleted }) => {
//   const { user } = useAuth();
//   const [showComments, setShowComments] = useState(false);
//   const [isLiking, setIsLiking] = useState(false);
//   const [showLikes, setShowLikes] = useState(false);
//   const [likeUsers, setLikeUsers] = useState([]);
//   const [loadingLikes, setLoadingLikes] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editContent, setEditContent] = useState(post.content);
//   const [editMedia, setEditMedia] = useState(null);
//   const [previewMedia, setPreviewMedia] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setEditContent(post.content);
//   }, [post.content]);

//   const formatDate = (dateString) => {
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const hasLiked = user && post.likes.includes(user._id);

//   const formatProfilePicture = (picturePath) => {
//     if (!picturePath) return "/placeholder.svg?height=40&width=40";
//     return picturePath.startsWith("http")
//       ? picturePath
//       : `http://localhost:5000${picturePath}`;
//   };

//   const handleLike = async () => {
//     if (isLiking || !user) return;
//     setIsLiking(true);
//     try {
//       const res = await axios.put(
//         `http://localhost:5000/api/posts/${post._id}/like`
//       );
//       onPostUpdated(res.data);
//     } catch (error) {
//       console.error("Error liking post:", error);
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/posts/${post._id}`);
//       if (typeof onPostDeleted === "function") {
//         onPostDeleted(post._id);
//       }
//     } catch (err) {
//       console.error("Failed to delete post:", err);
//     }
//   };

//   const handleEdit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("content", editContent);
//       if (editMedia) {
//         formData.append("media", editMedia);
//         formData.append(
//           "mediaType",
//           editMedia.type.startsWith("video") ? "video" : "image"
//         );
//       }

//       const res = await axios.put(
//         `http://localhost:5000/api/posts/${post._id}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       onPostUpdated(res.data);
//       setShowEditModal(false);
//       setShowMenu(false);
//       setEditMedia(null);
//       setPreviewMedia(null);
//     } catch (error) {
//       console.error("Error editing post:", error);
//     }
//   };

//   const handleShowLikes = async () => {
//     if (post.likes.length === 0) return;
//     setShowLikes(!showLikes);
//     if (!showLikes && likeUsers.length === 0) {
//       setLoadingLikes(true);
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/posts/${post._id}/likes`
//         );
//         setLikeUsers(res.data);
//       } catch (error) {
//         console.error("Error fetching likes:", error);
//       } finally {
//         setLoadingLikes(false);
//       }
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setEditMedia(file);
//     if (file) {
//       setPreviewMedia(URL.createObjectURL(file));
//     }
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true,
//   };

//   const mediaArray = Array.isArray(post.media)
//     ? post.media.filter((item) => item && item.trim() !== "")
//     : [post.media].filter((item) => item && item.trim() !== "");

//   console.log("post.media:", post.media);
//   console.log("mediaArray:", mediaArray);
//   console.log("mediaType:", post.mediaType);

//   return (
//     <div className="post">
//       <div className="post-header">
//         <img
//           src={formatProfilePicture(post.user.profilePicture)}
//           alt={post.user.firstName || "User"}
//           className="user-avatar hover-effect"
//           onClick={() => navigate("/userprofile/" + post.user._id)}
//         />
//         <div className="post-user-info">
//           <h4>
//             {post.user.firstName || "User"} {post.user.lastName || ""}
//           </h4>
//           <p className="post-time">{formatDate(post.createdAt)}</p>
//         </div>

//         {user?._id === post.user._id && (
//           <div className="post-options">
//             <button
//               className="post-menu-icon"
//               onClick={() => setShowMenu(!showMenu)}
//             >
//               <FaEllipsisH />
//             </button>
//             {showMenu && (
//               <div className="post-dropdown">
//                 <button
//                   onClick={() => {
//                     setShowEditModal(true);
//                     setShowMenu(false);
//                   }}
//                 >
//                   Edit Post
//                 </button>
//                 <button onClick={handleDelete}>Delete Post</button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       <div className="post-content">
//         <p>{post.content}</p>
//         {mediaArray.length > 0 && (post.mediaType === "image" || post.mediaType === "video") && (
//           <div className="post-media">
//             <Slider {...sliderSettings}>
//               {mediaArray.map((mediaUrl, index) =>
//                 post.mediaType === "image" ? (
//                   <div key={index}>
//                     <img
//                       src={`http://localhost:5000${mediaUrl}`}
//                       alt={`Media ${index}`}
//                       className="post-image"
//                     />
//                   </div>
//                 ) : post.mediaType === "video" ? (
//                   <div key={index}>
//                     <video
//                       src={`http://localhost:5000${mediaUrl}`}
//                       controls
//                       className="post-video"
//                     />
//                   </div>
//                 ) : null
//               )}
//             </Slider>
//           </div>
//         )}
//       </div>
//       <div className="post-stats">
//         <span className="likes-count" onClick={handleShowLikes}>
//           {post.likes.length} likes
//         </span>
//         <span>{post.comments.length} comments</span>
//       </div>
//       <div className="post-actions">
//         <button
//           className={`post-action-button ${hasLiked ? "liked" : ""}`}
//           onClick={handleLike}
//         >
//           <Heart size={20} className={hasLiked ? "filled" : ""} />
//           <span>Like</span>
//         </button>
//         <button
//           className="post-action-button"
//           onClick={() => setShowComments(!showComments)}
//         >
//           <MessageCircle size={20} />
//           <span>Comment</span>
//         </button>
//         <button
//           className="post-action-button"
//           onClick={() => alert("Share logic here")}
//         >
//           <Share2 size={20} />
//           <span>Share</span>
//         </button>
//       </div>
//       {showComments && (
//         <CommentSection
//           postId={post._id}
//           comments={post.comments}
//           onPostUpdated={onPostUpdated}
//         />
//       )}
//       {showLikes && (
//         <div className="likes-modal">
//           <div className="likes-modal-content">
//             <div className="likes-modal-header">
//               <h4>
//                 <Users size={16} /> People who liked this post
//               </h4>
//               <button
//                 className="close-modal"
//                 onClick={() => setShowLikes(false)}
//               >
//                 ×
//               </button>
//             </div>
//             <div className="likes-modal-body">
//               {loadingLikes ? (
//                 <p>Loading...</p>
//               ) : likeUsers.length === 0 ? (
//                 <p>No likes yet</p>
//               ) : (
//                 <ul className="likes-list">
//                   {likeUsers.map((likeUser) => (
//                     <li key={likeUser._id} className="like-user">
//                       <img
//                         src={formatProfilePicture(likeUser.profilePicture)}
//                         alt={likeUser.firstName}
//                         className="like-user-avatar"
//                       />
//                       <span>
//                         {likeUser.firstName} {likeUser.lastName}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//       {showEditModal && (
//         <div className="modal-overlay">
//           <div className="edit-modal">
//             <h3>Edit Post</h3>
//             <textarea
//               value={editContent}
//               onChange={(e) => setEditContent(e.target.value)}
//               rows={4}
//             />
//             <input
//               type="file"
//               accept="image/*,video/*"
//               onChange={handleFileChange}
//             />
//             {previewMedia && (
//               <div className="edit-preview">
//                 {editMedia?.type?.startsWith("image") ? (
//                   <img
//                     src={previewMedia}
//                     alt="Preview"
//                     className="post-image"
//                   />
//                 ) : editMedia?.type?.startsWith("video") ? (
//                   <video src={previewMedia} controls className="post-video" />
//                 ) : null}
//               </div>
//             )}
//             <div className="edit-actions">
//               <button className="btn-save" onClick={handleEdit}>
//                 Save
//               </button>
//               <button
//                 className="btn-cancel"
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setEditMedia(null);
//                   setPreviewMedia(null);
//                   setEditContent(post.content);
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Post;
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Heart, MessageCircle, Share2, Users, Trash2 } from "lucide-react";
import { FaEllipsisH } from "react-icons/fa";
import CommentSection from "./CommentSection";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Post.css";

const Post = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [likeUsers, setLikeUsers] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editMedia, setEditMedia] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mediaArray, setMediaArray] = useState(
    Array.isArray(post.media) ? post.media : [post.media]
  );
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlide(index),
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const hasLiked = user && post.likes.includes(user._id);

  const formatProfilePicture = (picturePath) => {
    if (!picturePath) return "/placeholder.svg?height=40&width=40";
    return picturePath.startsWith("http")
      ? picturePath
      : `http://localhost:5000${picturePath}`;
  };

  const handleLike = async () => {
    if (isLiking || !user) return;
    setIsLiking(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${post._id}/like`);
      onPostUpdated(res.data);
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${post._id}`);
      if (typeof onPostDeleted === "function") {
        onPostDeleted(post._id);
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  // const handleDeleteImage = async () => {
  //   const updatedMedia = mediaArray.filter((_, index) => index !== currentSlide);
  //   if (updatedMedia.length === 0) return handleDeletePost();

  //   try {
  //     const res = await axios.put(`http://localhost:5000/api/posts/${post._id}`, {
        
  //       media: updatedMedia,
  //     });
  //     setMediaArray(res.data.media);
  //     onPostUpdated(res.data);
  //   } catch (error) {
  //     console.error("Error removing image:", error);
  //   }
  // };
  const handleDeleteImage = async () => {
  if (!window.confirm("Are you sure you want to delete this image?")) return;

  const imageUrlToDelete = mediaArray[currentSlide];

  try {
    const res = await axios.delete(`http://localhost:5000/api/posts/${post._id}/media`, {
      data: { imageUrl: imageUrlToDelete },
      headers: {
        "Content-Type": "application/json",
      },
    });

    const updatedMedia = res.data.updatedMedia;
    setMediaArray(updatedMedia);
    onPostUpdated({ ...post, media: updatedMedia });

    // Reset current slide if needed
    if (currentSlide >= updatedMedia.length) {
      setCurrentSlide(Math.max(0, updatedMedia.length - 1));
    }

    // Delete the post if no media remains
    if (updatedMedia.length === 0) {
      handleDeleteImage(); // Call your existing post delete handler
    }
  } catch (error) {
    console.error("Error removing image:", error);
  }
};


  return (
    <div className="post">
      <div className="post-header">
        <img
          src={formatProfilePicture(post.user.profilePicture)}
          alt={post.user.firstName || "User"}
          className="user-avatar hover-effect"
          onClick={() => navigate("/userprofile/" + post.user._id)}
        />
        <div className="post-user-info">
          <h4>{post.user.firstName} {post.user.lastName}</h4>
          <p className="post-time">{formatDate(post.createdAt)}</p>
        </div>

        {user?._id === post.user._id && (
          <div className="post-options">
            <button className="post-menu-icon" onClick={() => setShowMenu(!showMenu)}>
              <FaEllipsisH />
            </button>
            {showMenu && (
              <div className="post-dropdown">
                <button onClick={() => { setShowEditModal(true); setShowMenu(false); }}>
                  Edit Post
                </button>
                <button onClick={handleDeletePost}>Delete Post</button>
                {mediaArray.length > 1 && (
                  <button onClick={handleDeleteImage}>Delete This Image</button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {mediaArray.length > 0 && (
          <div className="post-media">
            <Slider {...sliderSettings}>
              {mediaArray.map((mediaUrl, index) => (
                <div key={index}>
                  {mediaUrl.endsWith(".mp4") ? (
                    <video
                      src={`http://localhost:5000${mediaUrl}`}
                      controls
                      className="post-video"
                    />
                  ) : (
                    <img
                      src={`http://localhost:5000${mediaUrl}`}
                      alt={`Media ${index}`}
                      className="post-image"
                    />
                  )}
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>

      <div className="post-stats">
        <span className="likes-count" onClick={() => setShowLikes(!showLikes)}>
          {post.likes.length} likes
        </span>
        <span>{post.comments.length} comments</span>
      </div>

      <div className="post-actions">
        <button
          className={`post-action-button ${hasLiked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <Heart size={20} /> <span>Like</span>
        </button>
        <button
          className="post-action-button"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={20} /> <span>Comment</span>
        </button>
        <button
          className="post-action-button"
          onClick={() => alert("Share logic here")}
        >
          <Share2 size={20} /> <span>Share</span>
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post._id}
          comments={post.comments}
          onPostUpdated={onPostUpdated}
        />
      )}

      {showLikes && (
        <div className="likes-modal">
          <div className="likes-modal-content">
            <div className="likes-modal-header">
              <h4><Users size={16} /> People who liked this post</h4>
              <button className="close-modal" onClick={() => setShowLikes(false)}>×</button>
            </div>
            <div className="likes-modal-body">
              {loadingLikes ? <p>Loading...</p> : likeUsers.length === 0 ? <p>No likes yet</p> : (
                <ul className="likes-list">
                  {likeUsers.map((likeUser) => (
                    <li key={likeUser._id} className="like-user">
                      <img
                        src={formatProfilePicture(likeUser.profilePicture)}
                        alt={likeUser.firstName}
                        className="like-user-avatar"
                      />
                      <span>{likeUser.firstName} {likeUser.lastName}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;

