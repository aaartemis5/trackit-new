import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Firebase config
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../styles/ThemeToggle.css";
import logo from '../assets/logo.mp4';

function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Track user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Handle theme change
 

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav className="navbar">
      <video className="logo-video" autoPlay loop muted>
        <source src={logo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Website Title */}
      <h2 className="navbar-title">Track-It AI</h2>

      {/* Right Section */}
      <div className="nav-actions">
        {/* Theme Toggle Button */}
        {/* <button 
          className="theme-toggle" 
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙 " : "☀️ "}
        </button> */}

        {/* Login / Logout Button */}
        {user ? (
          <button className="auth-button logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button
            className="auth-button login"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default ThemeToggle;



