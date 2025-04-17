import React, { useEffect, useRef, useState } from "react";
import "../css/Notes.css";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // ✅ Make sure CSS is imported

export default function Note() {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditorEnabled, setIsEditorEnabled] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [fileData, setFileData] = useState(""); // base64
  const [imageData, setImageData] = useState(""); // base64
  const [selectedNotebookId, setSelectedNotebookId] = useState(null);
  const [email, setEmail] = useState("");

  const handleImageInsert = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result;
      setImageData(base64Image); // For saving in DB

      // Insert into editor
      const range = quillInstance.current.getSelection(true);
      quillInstance.current.insertEmbed(range.index, "image", base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInsert = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileData(file.name); // Save file name to DB

    // Optionally: add link to the file name in editor
    const range = quillInstance.current.getSelection(true);
    quillInstance.current.insertText(range.index, `[${file.name}]`, {
      link: "#",
      bold: true,
    });
  };

  //Updating the notes in the databse.
  const handleUpdateNote = async () => {
    if (!quillInstance.current) {
      alert("Editor is not ready.");
      return;
    }

    const updatedDescription = quillInstance.current.root.innerHTML;

    const updatedNote = {
      _id: selectedNote._id,
      title: noteTitle,
      description: updatedDescription,
      file: fileData,
      image: imageData,
      notebookId: selectedNotebookId || null,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"), // include token if required
          },
          body: JSON.stringify(updatedNote),
        }
      );

      if (response.ok) {
        alert("Note updated successfully!");
      } else {
        alert("Failed to update the note.");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      alert("An error occurred while updating the note.");
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setNoteTitle(note.title); // <-- Set the title properly
    setIsEditorEnabled(true);
    setFileData(" ");
    setImageData(" ");
    setSelectedNotebookId(note.notebookId || null);

    if (note.image) {
      const range = quillInstance.current.getLength(); // insert at end
      quillInstance.current.insertEmbed(range, "image", note.image);
    }

    // Optional: show file link in editor
    if (note.file) {
      const range = quillInstance.current.getLength();
      quillInstance.current.insertText(range, `[${note.file}]`, {
        link: "#",
        bold: true,
      });
    }

    if (quillInstance.current) {
      quillInstance.current.root.innerHTML = note.description || "";

      // Only add image if it's not already in description
      if (note.image && !note.description.includes(note.image)) {
        quillInstance.current.root.innerHTML += `<img src="${note.image}" alt="Note Image" />`;
      }

      // Only add file if not already in description
      if (note.file && !note.description.includes(note.file)) {
        quillInstance.current.root.innerHTML += `<a href="${note.file}" download>Download File</a>`;
      }
    }
  };

  const handleSoftDelete = async (noteId) => {
    const confirm = window.confirm(
      "Are you sure you want to move this note to Trash?"
    );
    if (!confirm) return;

    const res = await fetch(`http://localhost:5000/api/notes/trash/${noteId}`, {
      method: "PUT",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    if (data.success) {
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      alert("Note moved to Trash");
    }
  };

  useEffect(() => {
    if (!quillInstance.current && editorRef.current) {
      quillInstance.current = new Quill(editorRef.current, {
        modules: { toolbar: "#toolbar" },
        placeholder: "Start typing your notes...",
        theme: "snow",
      });
    }

    return () => {
      quillInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes", {
          headers: {
            "auth-token": localStorage.getItem("token"), // only if you're using protected routes
          },
        });
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div style={{ marginRight: "200px" }}>
      <div class="container">
        <aside class="sidebar">
          <div class="container">
            <div class="profile-container dropdown">
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
            <button class="btn note">+ Note</button>
            <div class="dropdown">
              <button
                class="btn btn-secondary"
                type="button"
                data-bs-toggle="dropdown"
                style={{ margin: "10px", paddingRight: "70px" }}
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
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() =>
                      document.getElementById("fileUploadInput").click()
                    }
                  >
                    <i class="fas fa-file"></i> File
                  </a>
                </li>
                <hr />
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() =>
                      document.getElementById("imageUploadInput").click()
                    }
                  >
                    <i class="fas fa-image"></i> Image
                  </a>
                </li>
                <hr />
                <li>
                  <a class="dropdown-item" href="https://excalidraw.com/">
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

          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="imageUploadInput"
            onChange={handleImageInsert}
          />

          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            style={{ display: "none" }}
            id="fileUploadInput"
            onChange={handleFileInsert}
          />

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
            <img src="images/istoc.jpg" alt="Notebook Icon" />
            <p>
              <strong>Write Your notes Here!</strong>
            </p>
          </div>
        </aside>
        <main class="content">
          <div class="d-flex justify-content-between">
            <h3>Notes</h3>
            <button
              type="button"
              class="btn btn-light btn-sm"
              style={{ width: "25%", color: "blue" }}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Share
            </button>
          </div>
          <p style={{ marginRight: "200px", fontWeight: "600" }}>
            {notes.length} notes
          </p>

          <div className="add-note">
            <div className="slider1">
              {notes.map((note) => (
                <div
                  className="card my-3"
                  key={note._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNoteClick(note)}
                >
                  <div className="card-header">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        style={{ width: "75px", height: "40px",color: "blue" }}
              class="btn btn-light btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
                      >
                        Share
                      </button>
                      <p style={{ marginTop: "10px", width: "150px" }}>
                        <b>{note.title || "Untitled"}</b>
                      </p>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        style={{ width: "75px", height: "40px" }}
                        onClick={() => handleSoftDelete(note._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <p
                      className="card-text"
                      dangerouslySetInnerHTML={{ __html: note.description }}
                    />
                  </div>
                  <div className="card-footer">
                    <small className="text-body-secondary">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <main class="content1">
          <div class="rich-text-container">
            <h2 style={{ textAlign: "center" }}>Write Your Notes</h2>
            <input
              type="text"
              className="note-title"
              placeholder="Enter Title..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <div id="toolbar">
              <span class="ql-formats">
                <select class="ql-font"></select>
                <select class="ql-size"></select>
              </span>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
              </span>
              <span class="ql-formats">
                <select class="ql-color"></select>
                <select class="ql-background"></select>
              </span>
              <span class="ql-formats">
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <button class="ql-indent" value="-1"></button>
                <button class="ql-indent" value="+1"></button>
              </span>
              <span class="ql-formats">
                <select class="ql-align"></select>
              </span>
              <span class="ql-formats">
                <button class="ql-clean"></button>
              </span>
            </div>
            <div
              id="editor"
              ref={editorRef}
              style={{
                backgroundColor: isEditorEnabled ? "#fff" : "#f0f0f0",
                pointerEvents: isEditorEnabled ? "auto" : "none",
              }}
            ></div>
            <button
              className="btn save"
              style={{ backgroundColor: "springgreen", color: "white" }}
              onClick={handleUpdateNote}
              disabled={!isEditorEnabled}
            >
              Update
            </button>
          </div>

          {/* <!-- Modal for Share Btn   --> */}
          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    Share
                  </h1>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <label for="exampleInputEmail1" class="form-label">
                    Email address
                  </label>
                  <input
                        type="email"
                        className="form-control"
                        id="Email"
                        placeholder="Enter Email here!"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                </div>
                <div class="modal-footer">
                <button
  type="button"
  className="btn btn-warning w-25"
  onClick={async () => {
    if (!email || !selectedNote) {
      alert("Please enter an email and select a note.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/notes/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          email,
          title: selectedNote.title,
          description: selectedNote.description,
          createdAt: selectedNote.createdAt,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Note sent successfully!");
        setEmail("");
        setSelectedNote(null);
        document.getElementById("exampleModal").classList.remove("show"); // Hide modal manually (optional)
        document.body.classList.remove("modal-open"); // Clean up body class
        const modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) modalBackdrop.remove();
      } else {
        alert(`Failed to send note: ${data.error || "Server error"}`);
      }
    } catch (error) {
      console.error("Error sending note:", error);
      alert("An unexpected error occurred while sending the note.");
    }
  }}
>
  Send
</button>


                </div>
              </div>
            </div>
          </div>

          {/* <!--  Model For Notebook --> */}

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
                  <label for="text" class="form-label">
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
        </main>
      </div>
    </div>
  );
}
