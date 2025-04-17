import React , { useEffect, useState } from "react";
import "../css/Home.css";
import { Link } from "react-router-dom";

export default function SharedNotes() {
    const [sharedNotes, setSharedNotes] = useState([]);
  useEffect(() => {
    const fetchSharedNotes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notes/shared", {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        });

        const data = await res.json();
        setSharedNotes(data);
      } catch (error) {
        console.error("Error fetching shared notes:", error);
      }
    };

    fetchSharedNotes();
  }, []);



  return (
    <div>
      <div class="container">
        <aside class="sidebar">
          <div class="container">
            <div
              class="profile-container dropdown"
              style={{ cursor: "pointer" }}
            >
              <div
                class="avatar"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                S
              </div>
              <strong>sunil12345abc@gmail.com</strong><br />

              <br />
              <br />
              <br />
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="profileDropdown"
              >
                <li class="dropdown-header">ACCOUNT</li>
                <li class="px-3">
                  <strong>sonikumar12345abc</strong>
                  <br />
                  <small>sonikumar12345abc@gmail.com</small>
                </li>
                <hr />
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-user"></i> Account info...
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-cog"></i> Settings
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-bell"></i> Notifications
                  </a>
                </li>
                <hr />
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-question-circle"></i> Need help?
                  </a>
                </li>
                <hr />
                <li>
                  <a class="dropdown-item text-danger" href="#">
                    <i class="fas fa-sign-out-alt"></i> Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <input type="text" class="search" placeholder="Search" />
          <div class="d-flex justify-content-between">
            <button class="btn note">
              <a
                href="Note.jsp"
                style={{ color: "black", textDecoration: "none" }}
              >
                + Note
              </a>
            </button>
            <div class="dropdown">
              <button
                class="btn btn-secondary"
                type="button"
                data-bs-toggle="dropdown"
                style={{ margin: "10px" }}
              >
                ...
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal1"
                  >
                    <i class="fas fa-book"></i> NoteBook
                  </a>
                </li>
                <hr />
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-file"></i> File
                  </a>
                </li>
                <hr />
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-image"></i> Image
                  </a>
                </li>
                <hr />
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-paint-brush"></i> Sketch
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#taskModal"
          >
            + Task
          </button>

          {/* <!-- Modal --> */}
          <div
            class="modal fade"
            id="taskModal"
            tabindex="-1"
            aria-labelledby="taskModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="taskModalLabel">
                    Things to do
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="mb-3">
                      <label class="form-label">Task Name</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter task"
                      />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Description</label>
                      <textarea
                        class="form-control"
                        placeholder="What is this task about?"
                      ></textarea>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Due Date</label>
                      <div class="d-flex">
                        <button type="button" class="btn btn-outline-secondary">
                          Today
                        </button>
                        <button type="button" class="btn btn-outline-secondary">
                          Tomorrow
                        </button>
                        <button type="button" class="btn btn-outline-secondary">
                          Custom
                        </button>
                        <button type="button" class="btn btn-outline-secondary">
                          Repeat
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="button" class="btn btn-primary">
                    Create Task
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="slider">
            <ul>
              <li>
                <i class="fas fa-home"></i>
                <a
                  href="home.html"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Home
                </a>
              </li>
              <li>
                <i class="fas fa-sticky-note"></i> Notes
              </li>
              <li>
                <i class="fas fa-tasks"></i> Tasks
              </li>
              <li>
                <i class="fas fa-file"></i> Files
              </li>
              <li>
                <i class="fas fa-book"></i> Notebook
              </li>
              <li>
                <i class="fas fa-share"></i> Shared with Me
              </li>
              <li>
                <i class="fas fa-trash"></i> Trash
              </li>

              {/* <!--
                <li><i class="fas fa-th-large"></i> Templates</li>
                <li><i class="fas fa-tags"></i> Tags</li>
                <li><i class="fas fa-star"></i> Shortcuts</li>
                <li><i class="fas fa-users"></i> Spaces</li>
                --> */}
            </ul>
          </div>
          <div class="notebook-card">
            <img src="images/istoc.png" alt="Notebook Icon" />
            <p>
              <strong>Write Your notes Here!</strong>
            </p>
          </div>
        </aside>

        <main
          class="content"
          style={{
            maxWidth: "100%",
          }}
        >
          <p>Get Ready to takes notes</p>
          <h3>
            {" "}
            <p className="text-danger">
              <b>Share List</b>
            </p>
          </h3>
          <div className="add-note" style={{ marginTop: "35px" }}>
            <img
                src="https://cdn-icons-png.flaticon.com/512/9069/9069013.png"
                alt="Note Icon"
            />
            <p>
                <strong>
                Total Shared Notes:{" "}
                <span className="text-success">{sharedNotes.length}</span>
                </strong>
            </p>
            </div>

          {/* <!-- Modal for Notebook --> */}
          <div
            class="modal fade"
            id="exampleModal1"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    Create Notebook
                  </h1>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <label
                    for="text"
                    class="form-label"
                    style={{ marginRight: "760px" }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="Notebook Name"
                    placeholder="Note........."
                  />
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" class="btn btn-warning">
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <!--  Model  --> */}

          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    Create Notebook
                  </h1>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <input type="text" placeholder="Enter Notebook Name" />
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" class="btn btn-warning">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row" >
        {sharedNotes.map((note) => (
          <div className="card my-3" key={note._id} style={{width:"40%",overflow:"hidden",margin:"4px"}}>
            <div className="card-header">
              <strong>To: {note.recipientEmail}</strong>
            </div>
            <div className="card-body">
              <h5 className="card-title">{note.title}</h5>
              <div
                className="card-text"
                dangerouslySetInnerHTML={{ __html: note.description }}
              />
            </div>
            <div className="card-footer">
              <small>
                Shared on: {new Date(note.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        ))}
      </div>
          
        </main>
      </div>
    </div>
  );
}
