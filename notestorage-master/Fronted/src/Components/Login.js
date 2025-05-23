import React, { useState } from "react";
import "../css/styles2.css";
import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider, facebookProvider } from "./firebase";


import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  //Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: user.password }),
      });

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (response.ok) {
          localStorage.setItem("userInfo", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          alert("Login successful!");
          navigate("/notesDashboard");
        } else {
          alert(data.message);
        }
      } catch (jsonError) {
        console.error("JSON Parse Error:", jsonError);
        alert("Invalid server response. Please try again.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Something went wrong. Please check your connection.");
    }
  };

  //Handle google submit
  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          displayName: result.user.displayName,
          email: result.user.email,
        })
      );
      alert("Google login successful!");
      navigate("/notesDashboard");
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed.");
    }
  };
//Handle Facebook submit
  const handleFacebookLogin = async () => {
    const auth = getAuth();
    const provider = new FacebookAuthProvider();
    provider.addScope("email");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already has an existing account with the same email
      const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);

      if (signInMethods.length > 0) {
        if (signInMethods.includes("password")) {
          const credential = FacebookAuthProvider.credentialFromResult(result);
          await auth.currentUser.linkWithCredential(credential);
          alert("Facebook account successfully linked!");
        } else {
          alert("This account is already associated with another login method.");
        }
      } else {
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            displayName: user.displayName,
            email: user.email || "Email not available",
          })
        );
        alert("Logged in with Facebook!");
      }

      navigate("/notesDashboard");
    } catch (error) {
      console.error("Facebook Login Error:", error);
      alert("Facebook login failed.");
    }
  };

  return (
    <div>
      <div className="container2 d-flex">
        <div className="left-panel w-50">{}</div>
        <div
          className="right-panel w-50 d-flex align-items-center justify-content-center text-white"
          style={{
            background: "transparent",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="form-container w-75 ">
            <h2>Login Now</h2>
            <p>
              Don't have account?{" "}
              <Link to="/signup" className="text-warning">
                SignUp
              </Link>
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-warning w-100">
                Login Now
              </button>
            </form>
            <div className="text-center mt-3">Or login with</div>
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-light w-48" onClick={handleGoogleLogin}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiufjMBMPwlCuWDLiEEd_e9Z6jHGRi8kP7oA&s"
                  width="20"
                  alt="Google"
                />{" "}
                Google
              </button>
              <button className="btn btn-light w-48" onClick={handleFacebookLogin}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                  width="20"
                  alt="Facebook"
                />{" "}
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
