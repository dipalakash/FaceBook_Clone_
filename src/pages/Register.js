"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      if (!passwordRegex.test(value)) {
        setPasswordMessage(
          "Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 special character."
        );
      } else {
        setPasswordMessage("");
      }
    }

    if (name === "email") {
      if (!emailRegex.test(value)) {
        setEmailMessage("Please enter a valid email address.");
      } else {
        setEmailMessage("");
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      profilePicture,
    } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and include one uppercase letter, one number, and one special character."
      );
      return;
    }

    const userData = new FormData();
    userData.append("firstName", firstName);
    userData.append("lastName", lastName);
    userData.append("email", email);
    userData.append("password", password);
    if (profilePicture) {
      userData.append("profilePicture", profilePicture);
    }

    const result = await register(userData);
    if (result.success) {
      alert("OTP sent to your email.");
      navigate("/verify-otp", { state: { email: result.email } });
    } else {
      setError("Registration failed. Email may already be in use.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the Facebook Clone community</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
            {emailMessage && (
              <small style={{ color: "red", fontSize: "13px" }}>
                {emailMessage}
              </small>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => setPasswordTouched(true)}
              className="form-input password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-button abc"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {passwordMessage && passwordTouched && (
              <small style={{ color: "red", fontSize: "13px" }}>
                {passwordMessage}
              </small>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group password-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input password-input"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="toggle-button abc"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="form-group">
            <label className="file-input-label">
              Profile Picture
              <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                className="file-input"
                accept="image/*"
              />
            </label>
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
