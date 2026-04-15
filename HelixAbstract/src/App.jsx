import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    affiliation: "",
    university: "",
    country: "",
    tracks: "",
    photo: null,
    abstract: null,
    biography: null,
  });

  useEffect(() => {
    fetchForms();
  }, []);

  // GET DATA
  const fetchForms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/forms/all");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // HANDLE FILE CHANGE
  const handleFileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      await axios.post(
        "http://localhost:5000/api/forms/submit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Form submitted successfully");

      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        affiliation: "",
        university: "",
        country: "",
        tracks: "",
        photo: null,
        abstract: null,
        biography: null,
      });

      fetchForms(); // refresh table
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">User Form</h2>

      {/* FORM */}
      <form className="form" onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input name="affiliation" placeholder="Affiliation" onChange={handleChange} required />
        <input name="university" placeholder="University" onChange={handleChange} required />
        <input name="country" placeholder="Country" onChange={handleChange} required />
        <input name="tracks" placeholder="Tracks" onChange={handleChange} required />

        <label>Photo:</label>
        <input type="file" name="photo" onChange={handleFileChange} required />

        <label>Abstract:</label>
        <input type="file" name="abstract" onChange={handleFileChange} required />

        <label>Biography:</label>
        <input type="file" name="biography" onChange={handleFileChange} required />

        <button type="submit">Submit</button>
      </form>

      {/* <h2 className="title">Admin Dashboard</h2> */}

      {/* TABLE */}
      {/* <table className="styled-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Affiliation</th>
            <th>University</th>
            <th>Country</th>
            <th>Tracks</th>
            <th>Photo</th>
            <th>Abstract</th>
            <th>Biography</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>
              <td>{item.affiliation}</td>
              <td>{item.university}</td>
              <td>{item.country}</td>
              <td>{item.tracks}</td>

              <td>
                <img
                  src={`http://localhost:5000/${item.photo?.replace(/\\/g, "/")}`}
                  alt=""
                  className="photo"
                />
              </td>

              <td>
                <a
                  href={`http://localhost:5000/${item.abstract?.replace(/\\/g, "/")}`}
                  target="_blank"
                >
                  View
                </a>
              </td>

              <td>
                <a
                  href={`http://localhost:5000/${item.biography?.replace(/\\/g, "/")}`}
                  target="_blank"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default App;