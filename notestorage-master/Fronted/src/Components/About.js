
import React from "react";

export default function About() {
  return (
    <div>
      {/* About Section */}
      <div className="container col-xxl-8 px-4 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5" style={{padding:"30px"}}>
          <div className="col-12 col-md-8 col-lg-6 mx-auto">
            <img
              src="/images/about.jpg"
              className="d-block mx-auto img-fluid rounded shadow"
              alt="About Us"
              width="700"
              height="500"
              loading="lazy"
            />
          </div>
          <div className="col-lg-6 text-center text-lg-start">
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
              This website is mainly for storing notes.
            </h1>
            <p className="lead">
              We created this platform for people who need a secure place to
              store important notes. These notes will always be available
              whenever needed. The technologies used in building this website
              include HTML, CSS, React, and more. This service is completely
              free, and we do not charge any fees from users. Our team consists
              of three dedicated developers working to make this website useful
              for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container px-4 py-5">
        <h1 className="pb-2 border-bottom" style={{position:"relative", left:"700px", width:"20%",bottom:"20px"}}>Our Team</h1>
        <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
          {/* Team Member: Nitesh Kumar Pandit */}
          <div className="col">
            <div
              className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
              style={{
                backgroundImage: "url('/images/Nitesh.png')",
                backgroundSize: "cover",
              }}
            >
              <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                <h3 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">
                  Nitesh Kumar Pandit
                </h3>
                <ul className="d-flex list-unstyled mt-auto">
                  <li className="me-auto">
                    <img
                      src="/images/Nitesh.png"
                      alt="Nitesh Kumar Pandit"
                      width="32"
                      height="32"
                      className="rounded-circle border border-white"
                    />
                  </li>
                  <li className="d-flex align-items-center me-3">
                    <small>Nepal</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Team Member: Komal Chaudhary */}
          <div className="col">
            <div
              className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
              style={{
                backgroundImage: "url('/images/komal.png')",
                backgroundSize: "cover",
                padding: "30px",
              }}
            >
              <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                <h3 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">
                  Komal Chaudhary
                </h3>
                <ul className="d-flex list-unstyled mt-auto">
                  <li className="me-auto">
                    <img
                      src="/images/komal.png"
                      alt="Komal Chaudhary"
                      width="32"
                      height="32"
                      className="rounded-circle border border-white"
                    />
                  </li>
                  <li className="d-flex align-items-center me-3">
                    <small>Nepal</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Team Member: Pappu Thakur */}
          <div className="col">
            <div
              className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
              style={{
                backgroundImage: "url('/images/Pappu.jpg')",
                backgroundSize: "cover",
              }}
            >
              <div className="d-flex flex-column h-100 p-5 pb-3 text-shadow-1">
                <h3 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">
                  Pappu Thakur
                </h3>
                <ul className="d-flex list-unstyled mt-auto">
                  <li className="me-auto">
                    <img
                      src="/images/Pappu.jpg"
                      alt="Pappu Thakur"
                      width="32"
                      height="32"
                      className="rounded-circle border border-white"
                    />
                  </li>
                  <li className="d-flex align-items-center me-3">
                    <small>Nepal</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
