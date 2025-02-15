import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase"; // Firebase configuration
import "../styles/Login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email/Password Login Handler (if needed)
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in:", user);
      navigate("/add-event-job");
    } catch (err) {
      setError("Login failed. Please check your email/password.");
      console.error("Email Login Error:", err);
    }
    setLoading(false);
  };

  // Google OAuth Login Handler
  const handleOAuthLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Request Gmail read-only scope for later use.
      provider.addScope("https://www.googleapis.com/auth/gmail.readonly");

      // Trigger the Google sign-in popup.
      const result = await signInWithPopup(auth, provider);

      // Extract the Firebase ID token for backend authentication.
      const firebaseIdToken = await result.user.getIdToken();

      // Extract the Gmail OAuth access token (which has the Gmail scopes).
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const gmailAccessToken = credential.accessToken;
      
      console.log("Firebase ID Token:", firebaseIdToken);
      console.log("Gmail Access Token:", gmailAccessToken);

      // Save the Gmail access token in localStorage for later use in email processing.
      localStorage.setItem("gmailAccessToken", gmailAccessToken);

      // Send the Firebase ID token to your backend for authentication.
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: firebaseIdToken }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const textResponse = await response.text(); // Read response as text first
      try {
        const data = JSON.parse(textResponse);
        console.log("Backend response:", data);
        navigate("/add-event-job");
      } catch (jsonError) {
        throw new Error(`Invalid JSON response: ${textResponse}`);
      }
    } catch (error) {
      console.error("OAuth Login Error:", error);
      setError(error.message);
      await signOut(auth); // Clear cached session to allow retry
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <ThemeToggle />
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleEmailLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="oauth-buttons">
        <button 
          className="google-login" 
          onClick={handleOAuthLogin}
          type="button"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
