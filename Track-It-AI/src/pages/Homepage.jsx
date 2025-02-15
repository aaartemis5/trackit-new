import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/Homepage.css";
import bg from '../assets/bg-image.jpg';
import Footer from "../components/Footer";

function HomePage() {
  return (
    <div className="homepage">
      <ThemeToggle />
      <div className="hero-section">
        <div className="main-text">
          <h1>
            AI-Powered <span> Registration Tracker</span>
          </h1>
          <p>
            ⏳ <em>Never Miss a <span >Deadline</span> </em>  <br />
            🎯 <em>Smart Event Tracking, Simplified!</em> <br />
            🚀 <strong>Get Started</strong> with our{" "}
            <span >
              AI-Powered Registration Tracker 
            </span>
            .
          </p>

          <Link to="/login" className="btn">
            Get Started
          </Link>
        </div>
        <div className="image">
          <img src={bg} alt="bg" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;


