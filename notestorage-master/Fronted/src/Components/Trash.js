import React, { useEffect, useState } from "react";
import "../css/Home.css";
export default function Trash() {
  const [trashedNotebooks, setTrashedNotebooks] = useState([]);
  const [notes, setNotes] = useState([]); // <-- for trashed notes
  useEffect(() => {
    const fetchTrashed = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/notebooks/gettrashednotebooks",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );

        const data = await res.json();
        setTrashedNotebooks(data);
      } catch (error) {
        console.error("Error fetching trashed notebooks:", error);
      }
    };

    fetchTrashed();
  }, []);

  //For Trash notes
  useEffect(() => {
    const fetchTrashedNotes = async () => {
      const res = await fetch("http://localhost:5000/api/notes", {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      const trashed = data.filter(note => note.trashed); // assuming .trashed is a boolean
      setNotes(trashed);
    };
  
    fetchTrashedNotes();
  }, []);
  
  


//For notes

const handlePermanentDelete1 = async (noteId) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this note?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/notes/delete/${noteId}`, {
        method: "DELETE",
        headers: {
          "auth-token": localStorage.getItem("token")
        }
      });
  
      if (response.ok) {
        // Remove the deleted note from UI
        setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      } else {
        console.error("Failed to delete the note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };
  
  





//For notebook
  const handlePermanentDelete = async (id) => {
    const confirm = window.confirm(
      "This will permanently delete the notebook. Are you sure?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/trash/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (res.ok) {
        alert("Notebook permanently deleted.");
        setTrashedNotebooks((prev) => prev.filter((nb) => nb._id !== id));
      } else {
        console.error("Failed to delete notebook permanently");
      }
    } catch (error) {
      console.error("Error:", error);
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
            position: "relative",
            right: "150px",
          }}
        >
          <p>Get Ready to takes notes</p>
          <h3>
            Sonikumari345atebac's{" "}
            <p className="text-danger">
              <b>Trash</b>
            </p>
          </h3>
          <div class="add-note" style={{ marginTop: "5px" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/5028/5028066.png"
              alt="Note Icon" style={{width:"105px"}}
            />
            <p>
              {" "}
              <strong>
                {trashedNotebooks.length === 0
                  ? "No Any Trashed Notebook Found here!"
                  : `Total Notebooks: ${trashedNotebooks.length}`}
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




          <h2 className="mt-4">Trashed Notes</h2>

          <div style={{overflowY:"auto" , maxHeight:"400px",position:"relative",left:"150px"}}>

<div className="row">
  {notes.map((note) => (
    <div className="col-md-4" key={note._id}>
      <div
        className="card my-3 shadow-sm"
        style={{ height: "100%", width: "100%", overflow: "hidden" }}
      >
      <div
          className="card-header text-truncate"
          title={note.title}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: "bold",
            backgroundColor: "#f8f9fa",
          }}
        >
          {note.title}
          <button
            className="btn btn-danger btn-sm" style={{width:"25%"}}
            onClick={() => handlePermanentDelete1(note._id)}
          >
            Delete
          </button>
        </div>
       
        
        <div className="card-body" style={{ overflowY: "auto" }}>
          <div
            dangerouslySetInnerHTML={{ __html: note.description }}
            style={{ maxHeight: "350px", overflow: "hidden",objectFit: "cover"}}
          />
{/* 
          {note.image && (
            <img
              src={note.image}
              alt="Note"
              style={{
                maxHeight: "150px",
                width: "100%",
                objectFit: "cover",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            />
          )} */}

          {note.file && (
            <p className="mt-2 text-truncate" title={note.file}>
              <b>File:</b> {note.file}
            </p>
          )}
        </div>

        <div className="card-footer">
          <small>{new Date(note.createdAt).toLocaleDateString()}</small>

        </div>
      </div>
    </div>
  ))}
</div>




<br />


          <div
            className="d-flex flex-wrap"
            style={{ position: "relative", left: "150px" }}
          >
            {trashedNotebooks.map((notebook) => (
              <div
                key={notebook._id}
                className="card border-danger mb-3 mx-2"
                style={{ maxWidth: "18rem" }}
              >
                <div className="card-header text-danger">{notebook.name}</div>
                <div className="card-body">
                  <p className="card-text">This notebook is in trash.</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => handlePermanentDelete(notebook._id)}
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            ))}
          </div>
          </div>

        </main>
      </div>
    </div>
  );
}
