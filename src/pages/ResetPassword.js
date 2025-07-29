"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "./Login.css"

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidToken, setIsValidToken] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Verify token when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsLoading(true)
        await axios.get(`http://localhost:5000/api/auth/reset-password/${token}`)
        setIsValidToken(true)
      } catch (err) {
        console.error("Token verification error:", err)
        setIsValidToken(false)
        setError("Invalid or expired password reset link")
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [token])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous messages
    setMessage("")
    setError("")

    const { password, confirmPassword } = formData

    // Validate passwords
    if (!password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsSubmitting(true)

    try {
      // Send request to backend to reset password
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password })

      // Show success message
      setMessage("Password has been reset successfully")

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      console.error("Reset password error:", err)
      // Show error message
      setError(err.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Verifying Reset Link</h1>
          <p className="auth-subtitle">Please wait while we verify your reset link...</p>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Invalid Reset Link</h1>
          <p className="auth-subtitle">This password reset link is invalid or has expired.</p>
          <div className="auth-footer">
            <p>
              <Link to="/forgot-password" className="auth-link">
                Request a new password reset link
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Enter your new password</p>

        {message && <div className="auth-message">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
