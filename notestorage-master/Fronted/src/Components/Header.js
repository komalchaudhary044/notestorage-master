import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isWelcomePage = location.pathname === "/welcome";
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  return (
    <header>
      <nav
        className="navbar navbar-expand-lg px-3"
        style={{ background: "#2c3e50", padding: "30px" }}
      >
        <Link className="navbar-brand fw-bold text-light" to="/">
          i<span style={{ color: "#1abc9c" }}>NoteBook</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active text-light" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="d-flex">
          {isWelcomePage && (
            <>
              <Link to="/login" className="btn btn-outline-success">
                Login
              </Link>
              <Link to="/signup" className="btn btn-success mx-2">
                Signup
              </Link>
            </>
          )}
          {isLoginPage && (
            <Link to="/signup" className="btn btn-success">
              Signup
            </Link>
          )}
          {isSignupPage && (
            <Link to="/login" className="btn btn-outline-success">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}