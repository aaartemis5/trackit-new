import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link to="/add-event-job">➕ Add Job/Event</Link></li>
        <li><Link to="/applications">🚀Applications</Link></li>
        <li><Link to="/dashboard">📊 Dashboard</Link></li>
        <li><Link to="/profile">👤 Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Sidebar;


