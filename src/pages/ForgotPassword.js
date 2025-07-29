"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetLink, setResetLink] = useState(""); // For development only

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage("");
    setError("");
    setResetLink("");

    // Validate email
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send request to backend to initiate password reset
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      // Show success message
      setMessage("Password reset link has been generated");

      // For development only - display the reset link
      if (response.data.resetUrl) {
        setResetLink(response.data.resetUrl);
      }

      setEmail(""); // Clear the form
    } catch (err) {
      // Show error message
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">Enter your email to reset your password</p>

        {message && <div className="auth-message">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Reset Password"}
          </button>
        </form>

        {/* Development only - display reset link */}
        {resetLink && (
          <div className="dev-reset-link">
            <p>Development Only: Reset Link</p>
            <a href={resetLink} target="_blank" rel="noopener noreferrer">
              {resetLink}
            </a>
          </div>
        )}

        <div className="auth-footer">
          <p>
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
