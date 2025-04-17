import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { Link } from "react-router-dom";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteName, setNoteName] = useState("");
const [noteContent, setNoteContent] = useState("");
const [completedTasks, setCompletedTasks] = useState([]);
const [selectedTaskId, setSelectedTaskId] = useState(null);


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });
        const rawText = await response.text();
        console.log("📦 Raw response from /tasks:", rawText);

        if (response.ok) {
          const data = JSON.parse(rawText); // try to parse manually now
          setTasks(data);
        } else {
          console.error("❌ Error Response:", rawText);
        }
      } catch (error) {
        console.error("🚨 Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateNote = async () => {
    if (!noteName || !noteContent || !selectedTaskId) {
      alert("Please fill all fields");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/task-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          taskId: selectedTaskId,
          name: noteName,
          content: noteContent,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("✅ Task note created successfully!");
      
        // Mark this task as completed
        setCompletedTasks((prev) => [...prev, selectedTaskId]);
      
        // Reset modal inputs
        setNoteName("");
        setNoteContent("");
        setSelectedTaskId(null);
      
        // Close modal
        document.getElementById("closeModalBtn")?.click();
      }
      
  
        // Optionally refetch tasks or update UI
       else {
        alert(`❌ Failed to create note: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating task note:", error);
      alert("❌ An error occurred while creating the note");
    }
  };
  
  
  
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
              <b>All Taskes</b>
            </p>
          </h3>
          <div class="add-note" style={{ marginTop: "35px" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/256/762/762686.png"
              alt="Note Icon"
            />
            <p>
              <strong>No Any Taskes Found here!</strong>
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

          {/*Model for complete notebook for task */}

          <div
  className="modal fade"
  id="exampleModal2"
  tabIndex="-1"
  aria-labelledby="exampleModalLabel2"
  aria-hidden="true"
>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel2">
          New Notes
        </h1>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          id="closeModalButton"
        ></button>
      </div>
      <div className="modal-body">
        <form>
          <div className="mb-3">
            <label htmlFor="recipient-name" className="col-form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="recipient-name"
              value={noteName}
              onChange={(e) => setNoteName(e.target.value)}
              placeholder="Enter note name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="message-text" className="col-form-label">
              Content:
            </label>
            <textarea
              className="form-control"
              id="message-text"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            ></textarea>
          </div>
        </form>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Close
        </button>
        <button type="button" className="btn btn-primary" onClick={handleCreateNote}>
  Create
</button>
      </div>
    </div>
  </div>
</div>


          <div className="container mt-4">
            {loading ? (
              <p>Loading tasks...</p>
            ) : (
              <div className="row">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="col-md-4"
                    style={{ width: "185.5%" }}
                  >
                    <div className="card mb-4">
                      <div className="card-body">
                        <h5 className="card-title">{task.name}</h5>
                        <p className="card-text">
                          <strong>Description:</strong> {task.description}
                        </p>
                        <p className="card-text">
                          <strong>Due Date:</strong>{" "}
                          {new Date(task.dueDate).toLocaleString()}
                        </p>
                        <p className="card-text">
                          <strong>Created At:</strong>{" "}
                          {new Date(task.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {completedTasks.includes(task._id) ? (
                                        <div className="alert alert-success p-2 mt-2" role="alert">
                                            ✅ Task Completed
                                        </div>
                                        ) : (
                                        <div className="alert alert-danger p-2 mt-2" role="alert">
                                            ⚠️ Task Incomplete – Note not created!{" "}
                                            <a
                                            href="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal2"
                                            onClick={() => setSelectedTaskId(task._id)}
                                            >
                                            Click here to complete
                                            </a>
                                        </div>
                                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
