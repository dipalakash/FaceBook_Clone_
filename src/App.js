// // "use client";
// // import {
// //   BrowserRouter as Router,
// //   Routes,
// //   Route,
// //   Navigate,
// // } from "react-router-dom";
// // import { AuthProvider, useAuth } from "./context/AuthContext";
// // import Login from "./pages/Login";
// // import Register from "./pages/Register";
// // import Home from "./pages/Home";
// // import ForgotPassword from "./pages/ForgotPassword";
// // import ResetPassword from "./pages/ResetPassword";
// // import Navbar from "./components/Navbar";
// // import "./App.css";
// // import UserProfile from "./components/userProfile";

// // // Protected route component
// // const ProtectedRoute = ({ children }) => {
// //   const { user } = useAuth();
// //   if (!user) return <Navigate to="/login" />;
// //   return children;
// // };

// // function App() {
// //   return (
// //     <AuthProvider>
// //       <Router>
// //         <div className="app">
// //           <Navbar />
// //           <div className="app-container">
// //             <Routes>
// //               <Route path="/login" element={<Login />} />
// //               <Route path="/register" element={<Register />} />
// //               <Route path="/forgot-password" element={<ForgotPassword />} />
// //              <Route path="/userprofile/:id" element={<UserProfile />} />

// //               <Route
// //                 path="/reset-password/:token"
// //                 element={<ResetPassword />}
// //               />
// //               <Route
// //                 path="/"
// //                 element={
// //                   <ProtectedRoute>
// //                     <Home />
// //                   </ProtectedRoute>
// //                 }
// //               />
// //             </Routes>
// //           </div>
// //         </div>
// //       </Router>
// //     </AuthProvider>
// //   );
// // }

// // export default App;
// // App.jsx
// "use client";

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Home from "./pages/Home";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import UserProfile from "./components/userProfile";
// import Navbar from "./components/Navbar";
// import "./App.css";

// // Protected route component with loading check
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) return <div>Loading...</div>; // or your spinner component

//   if (!user) return <Navigate to="/login" />;

//   return children;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="app">
//           <Navbar />
//           <div className="app-container">
//             <Routes>
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/forgot-password" element={<ForgotPassword />} />
//               <Route path="/reset-password/:token" element={<ResetPassword />} />
//               <Route path="/userprofile/:id" element={<UserProfile />} />
//               <Route
//                 path="/"
//                 element={
//                   <ProtectedRoute>
//                     <Home />
//                   </ProtectedRoute>
//                 }
//               />
//             </Routes>
//           </div>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

"use client";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./components/userProfile";
import EditProfile from "./pages/EditProfile"; // ✅ Import new page
import Navbar from "./components/Navbar";
import "./App.css";
import VerifyOtp from "./pages/VerifyOtp";
import Image_post from "./components/Image_post";

import Video_post from "./components/Video_post";
// import Image_post from "./components/Image_post";

// ✅ Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="app-container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/userprofile/:id" element={<UserProfile />} />
              <Route
                path="/my-images"
                element={
                  <ProtectedRoute>
                    <Image_post />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-videos"
                element={
                  <ProtectedRoute>
                    <Video_post />
                  </ProtectedRoute>
                }
              />

              
              {/* ✅ Add edit-profile route */}
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="/verify-otp" element={<VerifyOtp />} />;
              {/* ✅ Home (Protected) */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
