import { useState } from "react";
import "../styles/Profile.css";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Firebase config
import { onAuthStateChanged, signOut } from "firebase/auth";
import Footer from "../components/Footer";

function Profile() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [location, setLocation] = useState("New York");
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/100");
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-content">
     <Sidebar />
     <ThemeToggle />
     <div className="profile-container">
       
      <h2>Profile</h2>
      <div className="profile-card">
        <label htmlFor="imageUpload" className="profile-pic">
          <img src={profilePic} alt="Profile" />
        </label>
        <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} />

        <div className="profile-details">
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        </div>

        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
    <Footer />
     </div>
    
  );
}

export default Profile;
