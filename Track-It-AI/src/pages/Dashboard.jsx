import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/Dashboard.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Footer from "../components/Footer";
import axios from "axios";

function Dashboard() {
  // Existing dummy data and chart data (for illustration)
  const stats = {
    ongoing: 5,
    upcoming: 3,
    rejected: 2,
  };

  const applicationData = [
    { month: "Jan", applied: 2 },
    { month: "Feb", applied: 5 },
    { month: "Mar", applied: 8 },
    { month: "Apr", applied: 6 },
    { month: "May", applied: 10 },
    { month: "Jun", applied: 7 },
    { month: "Jul", applied: 12 },
    { month: "Aug", applied: 9 },
    { month: "Sep", applied: 4 },
    { month: "Oct", applied: 6 },
    { month: "Nov", applied: 5 },
    { month: "Dec", applied: 3 },
  ];

  const [processResult, setProcessResult] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleProcessEmails = async () => {
    setProcessing(true);
    try {
      // Retrieve the Gmail access token from localStorage.
      const token = localStorage.getItem("gmailAccessToken");
      if (!token) {
        alert("No Gmail access token found!");
        setProcessing(false);
        return;
      }

      // Call the backend endpoint to process emails.
      const response = await axios.post("https://trackit-new.onrender.com/api/email/process-emails", { token });
      setProcessResult(response.data);
    } catch (error) {
      console.error("Error processing emails:", error);
      alert("Error processing emails");
    }
    setProcessing(false);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <ThemeToggle />
      <div className="dashboard-content">
        <h2>Dashboard</h2>
        <div className="stats">
          <div className="stat-card ongoing">
            <h3>Ongoing Applications</h3>
            <p>{stats.ongoing}</p>
          </div>
          <div className="stat-card upcoming">
            <h3>Upcoming Applications</h3>
            <p>{stats.upcoming}</p>
          </div>
          <div className="stat-card rejected">
            <h3>Rejected Applications</h3>
            <p>{stats.rejected}</p>
          </div>
        </div>
        <div className="chart-container">
          <h3>Applications Applied Over the Months</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applied" fill="var(--chart-bar)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* New button to trigger email processing */}
        <button onClick={handleProcessEmails} disabled={processing} style={{ marginTop: "20px", padding: "10px 20px" }}>
          {processing ? "Processing Emails..." : "Process Emails"}
        </button>
        {processResult && (
          <div style={{ marginTop: "20px" }}>
            <h3>Processed Emails</h3>
            <pre>{JSON.stringify(processResult, null, 2)}</pre>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
