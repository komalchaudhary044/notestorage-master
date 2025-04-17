import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "../css/Home.css"
export default function Home() {
    const [notes, setNotes] = useState([]);
  const [notebooks, setNotebooks] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notes/", {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        });
        setNotes(res.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    const fetchNotebooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notebooks/getusernotebooks", {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        });
        setNotebooks(res.data);
      } catch (error) {
        console.error("Error fetching notebooks:", error);
      }
    };

    fetchNotes();
    fetchNotebooks();
  }, []);
    return (
       <div>



            <div class="container">
                <aside class="sidebar">
                    <div class="container">
                        <div class="profile-container dropdown" style={{cursor: "pointer"}}>
                            <div
                                class="avatar text-sucess"
                                id="profileDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false" >
                                S
                            </div>
                            <strong>sunil12345abc@gmail.com</strong><br />
                            <br />
                            <br />
                            <ul
                                class="dropdown-menu dropdown-menu-end"
                                aria-labelledby="profileDropdown"
                            >
                                <li class="dropdown-header">ACCOUNT</li>
                                <li class="px-3">
                                    <strong>sonikumar12345abc</strong><br />
                                    <small>sonikumar12345abc@gmail.com</small>
                                </li>
                                <hr />
                                <li>
                                    <a class="dropdown-item" href="#"
                                    ><i class="fas fa-user"></i> Account info...</a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#"
                                    ><i class="fas fa-cog"></i> Settings</a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#"
                                    ><i class="fas fa-bell"></i> Notifications</a>
                                </li>
                                <hr />
                                <li>
                                    <a class="dropdown-item" href="#"
                                    ><i class="fas fa-question-circle"></i> Need help?</a>
                                </li>
                                <hr />
                                <li>
                                    <a class="dropdown-item text-danger" href="#"
                                    ><i class="fas fa-sign-out-alt"></i> Sign out</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <input type="text" class="search" placeholder="Search" />
                    <div class="d-flex justify-content-between">
                        <button class="btn note"><a href="Note.jsp" style={{color: "black",textDecoration:"none"}}>+ Note</a></button>
                        <div class="dropdown">
                            <button
                                class="btn btn-secondary"
                                type="button"
                                data-bs-toggle="dropdown"
                                style={{margin: "10px"}}
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
                                    <a class="dropdown-item" href="#"
                                    ><i class="fas fa-file"></i> File</a>
                                </li>
                                <hr />
                                <li>
                                    <a class="dropdown-item" href="#"
                                    ><i class="fas fa-image"></i> Image</a>
                                </li>
                                <hr />
                                <li>
                                    <a class="dropdown-item" href="#"
                                    ><i class="fas fa-paint-brush"></i> Sketch</a>
                                </li>
                                
                            </ul>
                        </div>
                    </div>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#taskModal">+ Task</button>

                    {/* <!-- Modal --> */}
                    <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="taskModalLabel">Things to do</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="mb-3">
                                            <label class="form-label">Task Name</label>
                                            <input type="text" class="form-control" placeholder="Enter task" />
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Description</label>
                                            <textarea class="form-control" placeholder="What is this task about?"></textarea>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Due Date</label>
                                            <div class="d-flex">
                                                <button type="button" class="btn btn-outline-secondary">Today</button>
                                                <button type="button" class="btn btn-outline-secondary">Tomorrow</button>
                                                <button type="button" class="btn btn-outline-secondary">Custom</button>
                                                <button type="button" class="btn btn-outline-secondary">Repeat</button>
                                            </div>
                                        </div>



                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="button" class="btn btn-primary">Create Task</button>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div class="slider">
                        <ul>
                            <li>
                                <i class="fas fa-home"></i><a href="home.html" style={{color: "black",textDecoration:"none"}}>Home</a>
                            </li>
                            <li><i class="fas fa-sticky-note"></i> Notes</li>
                            <li><i class="fas fa-tasks"></i> Tasks</li>
                            <li><i class="fas fa-file"></i> Files</li>
                            <li><i class="fas fa-book"></i> Notebook</li>
                            <li><i class="fas fa-share"></i> Shared with Me</li>
                            <li><i class="fas fa-trash"></i> Trash</li>

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
                        <p><strong>Write Your notes Here!</strong></p>
                    </div>
                </aside>




                <main class="content" style={{
                    maxWidth: "100%",
                    
                }}>
                    <p>Get Ready to takes notes</p>
                    <div class="add-note" style={{position:"relative",bottom:"50px"}}>
                        <img src="/images/nonotes.png" alt="Note Icon" />
                        <p><strong>No Any notes Found here!</strong></p>
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
                                    <label for="text" class="form-label" style={{marginRight:"760px"}}>Name</label>
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
                                    <button type="button" class="btn btn-warning">Create</button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* <!--  Model  --> */}

                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Create Notebook</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <input type="text" placeholder="Enter Notebook Name" />
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-warning">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="container my-4">
      <h3 style={{position:"relative",left:"80px",top:"-80px",width:"550px",height:"50px"}}>📒 All Notebooks</h3>
      <div className="d-flex flex-wrap gap-3" style={{position:"relative",right:"160px",overflowY:"auto",height:"400px"}}>
        {notebooks.map((notebook) => (
          <div className="card p-3 shadow-sm" style={{ width: "18rem" }} key={notebook._id}>
            <h5 className="text-success">{notebook.name}</h5>
            <p className="text-muted">
              Created: {moment(notebook.createdAt).format("MMM D, YYYY [at] h:mm A")}
            </p>
          </div>
        ))}
      </div>

      <h4 className="mt-4" style={{position:"relative",left:"280px",bottom:"130px"}}>📝 All Notes</h4>
      <div className="d-flex flex-wrap gap-3" style={{position:"relative",right:"140px",overflowY:"auto",height:"300px"}}>
        {notes.map((note) => (
          <div className="card p-3 shadow-sm" style={{ width: "18rem" }} key={note._id}>
            <h5 className="text-primary">{note.title}</h5>

            <div
              className="note-preview"
              dangerouslySetInnerHTML={{ __html: note.description }}
              style={{ maxHeight: "200px", overflow: "hidden" }}
            ></div>

            {note.file && (
              <div className="mt-2">
                <strong>File:</strong> <span className="text-muted">{note.file}</span>
              </div>
            )}

            {note.image && !note.description.includes(note.image) && (
              <img
                src={note.image}
                alt="Note"
                style={{ width: "100%", height: "auto", marginTop: "10px" }}
              />
            )}

            <p className="text-muted mt-2" style={{ fontSize: "0.8rem" }}>
              Created: {moment(note.createdAt).format("MMM D, YYYY [at] h:mm A")}
            </p>
          </div>
        ))}
      </div>
    </div>
                        </main>
                    </div>
       </div>
        
            
            )
}