import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/AddEventJobPage.css";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";

function AddEventJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "Event",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert("Job/Event added successfully!");
    setFormData({ title: "", date: "", category: "Event", description: "" });
  };

  return (
    <div className="addeventjob-container">
      <Sidebar />
        <ThemeToggle />
      <div className="form-container">
        <h2>Add Job or Event</h2>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event/job title"
            required
          />

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Event">Event</option>
            <option value="Job">Job</option>
          </select>

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter details about the event or job"
            rows="4"
            required
          ></textarea>

          <button type="submit">Add</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default AddEventJobPage;

