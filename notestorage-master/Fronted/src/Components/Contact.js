import React, { useState } from 'react';
import "../css/contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    robotCheck: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const { name, email, message, robotCheck } = formData;

    if (!name || !email || !message || !robotCheck) {
      alert("Please fill all fields and confirm you're not a robot.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Your query is submitted!");
        setFormData({ name: "", email: "", message: "", robotCheck: false });
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <div className="left-panel">
          <h2>Write us</h2>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" placeholder="AdMike" value={formData.name} onChange={handleChange} />
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" placeholder="admike@domain.com" value={formData.email} onChange={handleChange} />
          <div className="checkbox">
            <input type="checkbox" id="robotCheck" style={{ width: "30%", marginTop: "16px" }} checked={formData.robotCheck} onChange={handleChange} />
            <label htmlFor="robotCheck" style={{ width: "100%" }}>I am not a robot</label>
          </div>
        </div>
        <div className="right-panel">
          <label htmlFor="message">Message</label>
          <textarea id="message" placeholder="Write text here..." value={formData.message} onChange={handleChange}></textarea>
          <button type="submit" className="roo" style={{ height: "50px" }} onClick={handleSubmit}>SEND MESSAGE</button>
        </div>
      </div>
    </div>
  );
}
