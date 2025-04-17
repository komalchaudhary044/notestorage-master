import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    termsAccepted: false,
  });
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value, // Handle both text inputs and checkboxes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  

    if (!user.firstName) {
      alert("First name is required");
      return;
    }


    if (!user.lastName) {
      alert("Last name is required");
      return;
    }


    if (!user.email) {
      alert("email is required");
      return;
    }

    if (!user.password) {
      alert("password is required");
      return;
    }
  

    if (!user.termsAccepted) {
      alert("Please accept the Terms & Conditions.");
      return;
    }
  



    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token in localStorage
        alert("Account Created Now You Login!");
        navigate("/login"); // Redirect to Login Page
      } else {
        alert(data.Message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container2 d-flex">
      <div className="left-panel w-50">
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" style={{ marginLeft: "40px", marginRight: "40px", marginTop: "-30px" }}>
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/images/image5.webp" className="d-block w-100 h-50 rounded" alt="Slide 1" />
            </div>
            <div className="carousel-item">
              <img src="/images/image6.webp" className="d-block w-100 h-50 rounded" alt="Slide 2" />
            </div>
            <div className="carousel-item">
              <img src="/images/goo.webp" className="d-block w-100 h-50 rounded" alt="Slide 3" />
            </div>
          </div>
        </div>
      </div>
      <div className="right-panel w-50 d-flex align-items-center justify-content-center text-white" style={{ background: "transparent", boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)" }}>
        <div className="form-container w-75">
          <h2>Create an account</h2>
          <p>
            Already have an account? <Link to="/login" className="text-warning">Log in</Link>
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="text" className="form-control" name="firstName" placeholder="First name" value={user.firstName} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <input type="text" className="form-control" name="lastName" placeholder="Last name" value={user.lastName} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <input type="email" className="form-control" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <input type="password" className="form-control" name="password" placeholder="Enter your password" value={user.password} onChange={handleChange} required />
            </div>
            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" id="terms" name="termsAccepted" onChange={handleChange} />
              <label className="form-check-label" htmlFor="terms">I agree to the <Link to="/terms" className="text-warning">Terms & Conditions</Link></label>
            </div>
            <button type="button" className="btn btn-warning w-100" onClick={handleSubmit}>Create account</button>

          </form>
          <div className="text-center mt-3">Or register with</div>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-light w-48"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiufjMBMPwlCuWDLiEEd_e9Z6jHGRi8kP7oA&s" width="20" alt='google' /> Google</button>
            <button className="btn btn-light w-48"><img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" width="20" alt="Facebook" /> Facebook</button>
          </div>
        </div>
      </div>
    </div>
  );
}