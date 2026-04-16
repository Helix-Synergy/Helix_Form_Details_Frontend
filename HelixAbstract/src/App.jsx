import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const API_URL = "https://helix-abstract-form-backend-1.onrender.com/api/forms/submit";

const App = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    affiliation: "",
    university: "",
    country: "",
    tracks: "",
  });

  const [files, setFiles] = useState({
    photo: null,
    abstract: null,
    biography: null,
  });

  const [loading, setLoading] = useState(false);

  // Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Submitting your abstract...", {
      position: "top-right",
      theme: "colored",
    });

    try {
      const data = new FormData();

      // Convert tracks string → array
      const tracksArray = formData.tracks
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      // Append text fields
      Object.keys(formData).forEach((key) => {
        if (key === "tracks") {
          tracksArray.forEach((track) => {
            data.append("tracks", track);
          });
        } else {
          data.append(key, formData[key]);
        }
      });

      // Append files
      data.append("photo", files.photo);
      data.append("abstract", files.abstract);
      data.append("biography", files.biography);

      const res = await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);
      
      toast.update(toastId, {
        render: "Form submitted successfully! 🎉",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        theme: "colored",
      });

    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Submission failed! Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <ToastContainer limit={3} />
      <h1 className="title"> Abstract Form</h1>

      <div className="form-card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" name="firstName" placeholder="John" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="lastName" placeholder="Doe" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Affiliation</label>
            <input type="text" name="affiliation" placeholder="Company/Org" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>University</label>
            <input type="text" name="university" placeholder="Your University" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input type="text" name="country" placeholder="Country" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Tracks</label>
            <input
              type="text"
              name="tracks"
              placeholder="AI, Blockchain, Web3 (comma separated)"
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Passport Photo (Required)</label>
            <input type="file" name="photo" accept="image/*" onChange={handleFileChange} required />
          </div>

          <div className="form-group">
            <label>Abstract (PDF/DOC)</label>
            <input type="file" name="abstract" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
          </div>

          <div className="form-group">
            <label>Biography (PDF/DOC)</label>
            <input type="file" name="biography" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit Submission"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;