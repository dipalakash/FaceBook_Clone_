"use client";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatProfilePicture = (picturePath) => {
    if (!picturePath) return "/placeholder.svg?height=40&width=40";
    return picturePath.startsWith("http")
      ? picturePath
      : `http://localhost:5000${picturePath}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Facebook Clone
        </Link>

        {user ? (
          <div className="navbar-right">
            <div className="user-info">
              <img
                src={formatProfilePicture(user.profilePicture)}
                alt={user.firstName}
                className="user-avatar"
                onClick={() => navigate(`/userprofile/${user._id}`)} // ✅ Navigate to edit profile
              />
              <span className="user-name">{user.firstName}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-right">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
