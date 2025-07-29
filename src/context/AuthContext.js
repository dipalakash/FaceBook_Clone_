// // context/AuthContext.jsx
// "use client";

// import { createContext, useState, useContext, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Optional: Ensure full URL for profile picture
//   const formatUserData = (userData) => {
//     if (!userData) return null;
//     if (
//       userData.profilePicture &&
//       !userData.profilePicture.startsWith("http")
//     ) {
//       return {
//         ...userData,
//         profilePicture: `http://localhost:5000${userData.profilePicture}`,
//       };
//     }
//     return userData;
//   };

//   // On app load, check for token and fetch user
//   useEffect(() => {
//     const checkLoggedIn = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (token) {
//           axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//           const res = await axios.get("http://localhost:5000/api/users/me");
//           setUser(formatUserData(res.data));
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         localStorage.removeItem("token");
//         delete axios.defaults.headers.common["Authorization"];
//         setUser(null);
//       }
//       setLoading(false);
//     };

//     checkLoggedIn();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", {
//         email,
//         password,
//       });

//       // Save token and set user
//       localStorage.setItem("token", res.data.token);
//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${res.data.token}`;
//       setUser(formatUserData(res.data.user));

//       return { success: true };
//     } catch (error) {
//       if (error.response?.status === 401) {
//         return { success: false, reason: "not_verified" };
//       } else if (error.response?.status === 400) {
//         return { success: false, reason: "invalid" };
//       }
//       console.error("Login error:", error);
//       return { success: false, reason: "unknown" };
//     }
//   };

//   //---------
//   const register = async (userData) => {
//     try {
//       await axios.post("http://localhost:5000/api/auth/register", userData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       return true;
//     } catch (error) {
//       console.error("Registration error:", error);
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     delete axios.defaults.headers.common["Authorization"];
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

"use client";

import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ensure full URL for profile picture
  const formatUserData = (userData) => {
    if (!userData) return null;
    const formatted = { ...userData };
    if (userData.profilePicture && !userData.profilePicture.startsWith("http")) {
      formatted.profilePicture = `http://localhost:5000${userData.profilePicture}`;
    }
    if (userData.coverPhoto && !userData.coverPhoto.startsWith("http")) {
      formatted.coverPhoto = `http://localhost:5000${userData.coverPhoto}`;
    }
    return formatted;
  };

  const refreshUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/me");
      setUser(formatUserData(res.data));
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await axios.get("http://localhost:5000/api/users/me");
          setUser(formatUserData(res.data));
        } else {
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      setUser(formatUserData(res.data.user));

      return { success: true };
    } catch (error) {
      if (error.response?.status === 401) {
        return { success: false, reason: "not_verified" };
      } else if (error.response?.status === 400) {
        return { success: false, reason: "invalid" };
      }
      console.error("Login error:", error);
      return { success: false, reason: "unknown" };
    }
  };

  // const register = async (userData) => {
  //   try {
  //     await axios.post("http://localhost:5000/api/auth/register", userData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     return true;
  //   } catch (error) {
  //     console.error("Registration error:", error);
  //     return false;
  //   }
  // };

  const register = async (userData) => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/register", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 201) {
      return { success: true, email: userData.get("email") };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false };
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

