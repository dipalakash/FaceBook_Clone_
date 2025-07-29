// // "use client"

// // import { useState } from "react"
// // import axios from "axios"
// // import { useAuth } from "../context/AuthContext"
// // import "./CommentSection.css"

// // const CommentSection = ({ postId, comments, onPostUpdated }) => {
// //   const { user } = useAuth()
// //   const [newComment, setNewComment] = useState("")
// //   const [isSubmitting, setIsSubmitting] = useState(false)

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()

// //     if (!newComment.trim()) return
// //     setIsSubmitting(true)

// //     try {
// //       const res = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
// //         content: newComment,
// //       })

// //       onPostUpdated(res.data)
// //       setNewComment("")
// //     } catch (error) {
// //       console.error("Error adding comment:", error)
// //     } finally {
// //       setIsSubmitting(false)
// //     }
// //   }

// //   // Format date
// //   const formatDate = (dateString) => {
// //     const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
// //     return new Date(dateString).toLocaleDateString(undefined, options)
// //   }

// //   return (
// //     <div className="comment-section">
// //       <div className="comments-list">
// //         {comments.length === 0 ? (
// //           <p className="no-comments">No comments yet. Be the first to comment!</p>
// //         ) : (
// //           comments.map((comment) => (
// //             <div key={comment._id} className="comment">
// //               <img
// //                 src={comment.user.profilePicture || "/placeholder.svg?height=32&width=32"}
// //                 alt={comment.user.firstName}
// //                 className="comment-avatar"
// //               />
// //               <div className="comment-content">
// //                 <div className="comment-bubble">
// //                   <h5>
// //                     {comment.user.firstName} {comment.user.lastName}
// //                   </h5>
// //                   <p>{comment.content}</p>
// //                 </div>
// //                 <div className="comment-actions">
// //                   <span className="comment-time">{formatDate(comment.createdAt)}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>

// //       <form className="comment-form" onSubmit={handleSubmit}>
// //         <img
// //           src={user?.profilePicture || "/placeholder.svg?height=32&width=32"}
// //           alt={user?.firstName}
// //           className="comment-avatar"
// //         />
// //         <input
// //           type="text"
// //           placeholder="Write a comment..."
// //           value={newComment}
// //           onChange={(e) => setNewComment(e.target.value)}
// //           className="comment-input"
// //           disabled={isSubmitting}
// //         />
// //         <button type="submit" className="comment-submit" disabled={isSubmitting || !newComment.trim()}>
// //           Post
// //         </button>
// //       </form>
// //     </div>
// //   )
// // }

// // export default CommentSection


// "use client"

// import { useState } from "react"
// import axios from "axios"
// import { useAuth } from "../context/AuthContext"
// import "./CommentSection.css"

// const CommentSection = ({ postId, comments, onPostUpdated }) => {
//   const { user } = useAuth()
//   const [newComment, setNewComment] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!newComment.trim()) return
//     setIsSubmitting(true)

//     try {
//       const res = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
//         content: newComment,
//       })

//       onPostUpdated(res.data)
//       setNewComment("")
//     } catch (error) {
//       console.error("Error adding comment:", error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Format date
//   const formatDate = (dateString) => {
//     const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
//     return new Date(dateString).toLocaleDateString(undefined, options)
//   }

//   // Helper function to format profile picture URL
//   const formatProfilePicture = (picturePath) => {
//     if (!picturePath) return "/placeholder.svg?height=32&width=32"
//     return picturePath.startsWith("http") ? picturePath : `http://localhost:5000${picturePath}`
//   }

//   return (
//     <div className="comment-section">
//       <div className="comments-list">
//         {comments.length === 0 ? (
//           <p className="no-comments">No comments yet. Be the first to comment!</p>
//         ) : (
//           comments.map((comment) => (
//             <div key={comment._id} className="comment">
//               <img
//                 src={formatProfilePicture(comment.user.profilePicture) || "/placeholder.svg"}
//                 alt={comment.user.firstName}
//                 className="comment-avatar"
//               />
//               <div className="comment-content">
//                 <div className="comment-bubble">
//                   <h5>
//                     {comment.user.firstName} {comment.user.lastName}
//                   </h5>
//                   <p>{comment.content}</p>
//                 </div>
//                 <div className="comment-actions">
//                   <span className="comment-time">{formatDate(comment.createdAt)}</span>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <form className="comment-form" onSubmit={handleSubmit}>
//         <img
//           src={user?.profilePicture || "/placeholder.svg?height=32&width=32"}
//           alt={user?.firstName}
//           className="comment-avatar"
//         />
//         <input
//           type="text"
//           placeholder="Write a comment..."
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           className="comment-input"
//           disabled={isSubmitting}
//         />
//         <button type="submit" className="comment-submit" disabled={isSubmitting || !newComment.trim()}>
//           Post
//         </button>
//       </form>
//     </div>
//   )
// }

// export default CommentSection
"use client"

import { useState } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import "./CommentSection.css"

const CommentSection = ({ postId, comments, onPostUpdated }) => {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!newComment.trim() || !user) return
    setIsSubmitting(true)

    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
        content: newComment,
      })

      onPostUpdated(res.data)
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Helper function to format profile picture URL
  const formatProfilePicture = (picturePath) => {
    if (!picturePath) return "/placeholder.svg?height=32&width=32"
    return picturePath.startsWith("http") ? picturePath : `http://localhost:5000${picturePath}`
  }

  // Safely check if comments exist and are an array
  const safeComments = Array.isArray(comments) ? comments : []

  return (
    <div className="comment-section">
      <div className="comments-list">
        {safeComments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          safeComments.map((comment) => (
            <div key={comment._id} className="comment">
              <img
                src={(comment.user && formatProfilePicture(comment.user.profilePicture)) || "/placeholder.svg"}
                alt={(comment.user && comment.user.firstName) || "User"}
                className="comment-avatar"
              />
              <div className="comment-content">
                <div className="comment-bubble">
                  <h5>{comment.user ? `${comment.user.firstName || ""} ${comment.user.lastName || ""}` : "User"}</h5>
                  <p>{comment.content}</p>
                </div>
                <div className="comment-actions">
                  <span className="comment-time">{formatDate(comment.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <img
          src={user?.profilePicture || "/placeholder.svg?height=32&width=32"}
          alt={user?.firstName || "User"}
          className="comment-avatar"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
          disabled={isSubmitting || !user}
        />
        <button type="submit" className="comment-submit" disabled={isSubmitting || !newComment.trim() || !user}>
          Post
        </button>
      </form>
    </div>
  )
}

export default CommentSection





