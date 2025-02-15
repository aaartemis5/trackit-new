import { useState } from "react";
import "../styles/Applications.css";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const applicationsData = [
  { id: 1, title: "Software Engineer", company: "TechCorp", location: "Remote", date: "Feb 5, 2025", status: "Ongoing", type: "Full-Time" },
  { id: 2, title: "Data Analyst", company: "DataWorks", location: "New York", date: "Feb 2, 2025", status: "Accepted", type: "Part-Time" },
  { id: 3, title: "Frontend Developer", company: "WebFlow", location: "San Francisco", date: "Jan 28, 2025", status: "Rejected", type: "Full-Time" },
  { id: 4, title: "Product Manager", company: "TechCorp", location: "Remote", date: "Feb 5, 2025", status: "Ongoing", type: "Full-Time" },
  { id: 5, title: "Data Analyst", company: "DataWorks", location: "New York", date: "Feb 2, 2025", status: "Accepted", type: "Part-Time" },
    { id: 6, title: "Frontend Developer", company: "WebFlow", location: "San Francisco", date: "Jan 28, 2025", status: "Rejected", type: "Full-Time" },
    { id: 7, title: "Product Manager", company: "TechCorp", location: "Remote", date: "Feb 5, 2025", status: "Ongoing", type: "Full-Time" },
    { id: 8, title: "Data Analyst", company: "DataWorks", location: "New York", date: "Feb 2, 2025", status: "Accepted", type: "Part-Time" },
    { id: 9, title: "Frontend Developer", company: "WebFlow", location: "San Francisco", date: "Jan 28, 2025", status: "Rejected", type: "Full-Time" },
    { id: 10, title: "Product Manager", company: "TechCorp", location: "Remote", date: "Feb 5, 2025", status: "Ongoing", type: "Full-Time" },
    { id: 11, title: "Data Analyst", company: "DataWorks", location: "New York", date: "Feb 2, 2025", status: "Accepted", type: "Part-Time" },
    { id: 12, title: "Frontend Developer", company: "WebFlow", location: "San Francisco", date: "Jan 28, 2025", status: "Rejected", type: "Full-Time" },
    { id: 13, title: "Product Manager", company: "TechCorp", location: "Remote", date: "Feb 5, 2025", status: "Ongoing", type: "Full-Time" },
    { id: 14, title: "Data Analyst", company: "DataWorks", location: "New York", date: "Feb 2, 2025", status: "Accepted", type: "Part-Time" },
    { id: 15, title: "Frontend Developer", company: "WebFlow", location: "San Francisco", date: "Jan 28, 2025", status: "Rejected", type: "Full-Time" },
    { id: 16, title: "Product Manager", company: "TechCorp", location: "Remote", date: "Feb 5, 2025", status: "Ongoing", type: "Full-Time" },
    
];

function Applications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredApplications = applicationsData.filter((app) => {
    return (
      (statusFilter === "all" || app.status === statusFilter) &&
      (typeFilter === "all" || app.type === typeFilter) &&
      (app.title.toLowerCase().includes(searchTerm.toLowerCase()) || app.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="page-container">
      <Sidebar />
      <ThemeToggle />
      <div className="applications-container">
        <h2>Applications</h2>

        <div className="search-filters">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="all">Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="all">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
          </select>
        </div>
        {/* <button className="search-application-btn">Search Application</button> */}

        <div className="applications-list">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <div
                key={app.id}
                className={`application-card ${app.status.toLowerCase()}`}
              >
                <h3>{app.title}</h3>
                <p>{app.company}</p>
                <div className="job-details">
                  <span>📍 {app.location}</span>
                  <span>📅 {app.date}</span>
                </div>
                <span className={`status-tag ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </div>
            ))
          ) : (
            <p className="no-results">No applications found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Applications;

