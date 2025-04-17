import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/notesDashboard.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import moment from "moment";
export default function NotesDashboard() {
  const location = useLocation();
  const notebook = location.state?.notebook; // safely get notebook from route state
  const [notebookName, setNotebookName] = useState("");
  const [notes, setNotes] = useState([]);
  const [noteName, setNoteName] = useState(""); // for modal input
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditorEnabled, setIsEditorEnabled] = useState(false);
  const [selectedNotebookId, setSelectedNotebookId] = useState(null); // for filtering
  const [imageData, setImageData] = useState("");
  const [fileData, setFileData] = useState("");
  const [noteTitles, setNoteTitles] = useState([]);
  const [files, setFiles] = useState([]);

  //For Task
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  //For creating task
  let finalDueDate;

  if (taskDueDate === "Today") {
    finalDueDate = new Date();
  } else if (taskDueDate === "Tomorrow") {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    finalDueDate = date;
  } else {
    finalDueDate = new Date(taskDueDate); // assuming it's a valid date string
  }

  const handleCreateTask = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: taskName,
          description: taskDescription,
          dueDate: finalDueDate, // use the parsed date
        }),
      });

      const data = await response.json(); // only do this if the response is JSON

      if (!response.ok) {
        throw new Error(data.error || "Task creation failed");
      }

      alert("✅ Task created successfully!");
      console.log("New task:", data);
      // Optionally: clear the form or close the modal
    } catch (err) {
      console.error("❌ Server error:", err.message);
      alert("❌ Error: " + err.message);
    }
  };

  //fetch only the title
  useEffect(() => {
    const fetchNoteTitles = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notes/onlytitles", {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });

        const data = await res.json();
        setNoteTitles(data);
      } catch (err) {
        console.error("Error fetching note titles:", err);
      }
    };

    fetchNoteTitles();
  }, []);

  //Fetch only the files and and images
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notes/onlyfiles", {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });

        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    fetchFiles();
  }, []);

  const handleNotebookClick = (id) => {
    setSelectedNotebookId(id);
    console.log("Notebook selected:", id);
  };

  const createNotebook = async () => {
    if (!notebookName.trim()) {
      alert("Please enter a notebook name.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/notebooks/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"), // token stored on login
          },
          body: JSON.stringify({ name: notebookName }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        alert("✅ Notebook created successfully!");
        setNotebookName(""); // clear input
        // Optionally: refresh the notebook list here
      } else {
        alert("❌ Failed to create notebook: " + json.error);
      }
    } catch (error) {
      alert("❌ Error while creating notebook.");
      console.error(error);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNote) {
      alert("Please select a note first.");
      return;
    }

    const content = quillInstance.current.root.innerHTML;

    const noteData = {
      title: selectedNote?.name || "Untitled",
      description: content,
      notebookId: selectedNotebookId || null,
      image: imageData || null,
      file: fileData || null,
    };

    try {
      const response = await fetch("http://localhost:5000/api/notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(noteData),
      });

      const responseText = await response.text(); // 🔍 GET RAW RESPONSE
      console.log("📦 Raw response text:", responseText); // 🧾 LOG IT

      // Try to parse manually if you want to confirm it's valid JSON
      try {
        const result = JSON.parse(responseText);
        alert("✅ Note saved successfully!");
      } catch (jsonError) {
        console.error("❌ JSON parse failed:", jsonError);
        alert(
          "❌ Backend didn't return valid JSON. Check console for details."
        );
      }
    } catch (error) {
      console.error("❌ Failed to save note:", error);
      alert("❌ Failed to save note.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.type.startsWith("image/")) {
      alert("Please select a non-image file.");
      return;
    }
    setFileData(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const range = quillInstance.current.getSelection(true);

      // Optional: Customize how you show files in the editor
      const fileLink = `<a href="${reader.result}" download="${file.name}" target="_blank">${file.name}</a>`;
      quillInstance.current.clipboard.dangerouslyPasteHTML(
        range.index,
        fileLink
      );
    };

    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      const range = quillInstance.current.getSelection(true);
      quillInstance.current.insertEmbed(range.index, "image", imageUrl);
      setImageData(reader.result); // Base64 encoded image
    };
    reader.readAsDataURL(file);
  };

  const getShortenedHTML = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;

    const firstImg = div.querySelector("img");
    const firstText = div.textContent.trim().slice(0, 100) + "...";

    if (firstImg) {
      return (
        `<img src="${firstImg.src}" style="width:100%;height:auto; margin-bottom:10px;" />` +
        `<p>${firstText}</p>`
      );
    }
    return `<p>${firstText}</p>`;
  };

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserInfo(parsedUser);
      } catch (error) {
        console.error("Failed to parse user info from localStorage:", error);
      }
    }
  }, []);

  const name =
    userInfo?.displayName ||
    `${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`.trim() ||
    "Unknown User";

  const email = userInfo?.email || "unknown@example.com";

  // Choose avatar initial from firstName or displayName
  const avatarInitial =
    userInfo?.firstName?.[0]?.toUpperCase() ||
    userInfo?.displayName?.[0]?.toUpperCase() ||
    "U";

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

  //For Popovers
  useEffect(() => {
    const popoverTrigger = document.getElementById("accountPopover");
    if (popoverTrigger) {
      popoverTrigger.setAttribute(
        "data-bs-content",
        `<strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}`
      );

      const popover = new window.bootstrap.Popover(popoverTrigger, {
        trigger: "manual",
        placement: "right",
        html: true,
      });

      let isPopoverVisible = false;

      popoverTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        if (isPopoverVisible) {
          popover.hide();
          isPopoverVisible = false;
        } else {
          popover.show();
          isPopoverVisible = true;
        }
      });

      document.addEventListener("click", (e) => {
        if (
          isPopoverVisible &&
          !popoverTrigger.contains(e.target) &&
          !document.querySelector(".popover")?.contains(e.target)
        ) {
          popover.hide();
          isPopoverVisible = false;
        }
      });
    }
  }, [name, email]); // 🔁 Runs again if name/email changes

  return (
    <div style={{ marginRight: "200px" }}>
      <div className="container">
        <aside className="sidebar">
          <div className="container">
            <div className="profile-container dropdown">
              <div
                className="avatar"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {avatarInitial}
              </div>
              <strong>{email}</strong>
              <br />
              <br />
              <br />
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="profileDropdown"
              >
                <li className="dropdown-header">ACCOUNT</li>
                <li className="px-3">
                  <strong>{name}</strong>
                  <br />
                  <small>{email}</small>
                </li>
                <hr />
                <a
                  className="dropdown-item"
                  href="#"
                  id="accountPopover"
                  title="Account Info"
                >
                  <i className="fas fa-user"></i> Account info...
                </a>

                <li>
                  <a className="dropdown-item" href="/">
                    <i className="fas fa-cog"></i> Settings
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    id="notificationPopover"
                    title="Notifications"
                    data-bs-toggle="popover"
                    data-bs-placement="bottom"
                    data-bs-html="true"
                  >
                    <i className="fas fa-bell"></i> Notifications
                  </a>
                </li>

                <hr />
                <li>
                  <i className="fas fa-question-circle"></i>{" "}
                  <Link className="nav-link text-light" to="/contact">
                    <a className="dropdown-item" href="#">
                      Need help?
                    </a>
                  </Link>
                </li>
                <hr />
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => {
                      const confirmLogout = window.confirm(
                        "Are you sure you want to sign out?"
                      );
                      if (confirmLogout) {
                        localStorage.removeItem("userInfo");
                        alert("You have been logged out successfully.");
                        navigate("/");
                      }
                    }}
                  >
                    <i className="fas fa-sign-out-alt"></i> Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <input type="text" className="search" placeholder="Search" />
          <div className="d-flex justify-content-between">
            <button className="btn note">
              <Link
                to="/notes"
                style={{ color: "black", textDecoration: "none" }}
              >
                + Note
              </Link>
            </button>
            <div className="dropdown">
              <button
                className="btn btn-secondary"
                type="button"
                data-bs-toggle="dropdown"
                style={{
                  margin: "10px",
                  paddingRight: "70px",
                  textAlign: "center",
                }}
              >
                ...
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a
                    className="dropdown-item"
                    href="/"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal1"
                  >
                    <i className="fas fa-book"></i> NoteBook
                  </a>
                </li>
                <hr />
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => {
                      if (!selectedNote)
                        return alert("Please select a note first!");
                      document.getElementById("fileInput").click();
                    }}
                  >
                    <i className="fas fa-file"></i> File
                  </a>
                </li>
                <hr />
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => {
                      if (!selectedNote)
                        return alert("Please select a note first!");
                      document.getElementById("imageInput").click();
                    }}
                  >
                    <i className="fas fa-image"></i> Image
                  </a>
                </li>
                <hr />
                <li>
                  <a className="dropdown-item" href="/">
                    <i className="fas fa-paint-brush"></i> Sketch
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#taskModal"
          >
            + Task
          </button>

          {/* <!-- Modal --> */}
          <div
            className="modal fade"
            id="taskModal"
            tabindex="-1"
            aria-labelledby="taskModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="taskModalLabel">
                    Things to do
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Task Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter task"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        placeholder="What is this task about?"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Due Date</label>
                      <div className="d-flex">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={(e) => {
                            e.preventDefault(); // 🛑 Stop the page refresh
                            setTaskDueDate("Today");
                          }}
                        >
                          Today
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            setTaskDueDate("Tomorrow");
                          }}
                        >
                          Tomorrow
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                        >
                          Custom
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                        >
                          Repeat
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCreateTask}
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="slider">
            <ul>
              <li>
                <i className="fas fa-home"></i>
                <Link
                  to="/home"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Home
                </Link>
              </li>

              <li
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <i className="fas fa-sticky-note"></i> Notes
                <ul
                  style={{
                    listStyleType: "circular",
                    marginLeft: "10px",
                    overflowY: "auto",
                    height: "100px",
                  }}
                >
                  <p>
                    <a
                      className="dropdown-item"
                      href="/"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal2"
                    >
                      <b style={{ color: "green" }}>+ New Note</b>
                    </a>
                  </p>
                  {noteTitles.map((note) => (
                    <li key={note._id} style={{ fontSize: "0.9rem" }}>
                      {note.title}
                    </li>
                  ))}
                </ul>
              </li>

              <li>
                <i className="fas fa-tasks"></i>
                <Link
                  to="/task"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Tasks
                </Link>
              </li>

              <li>
                <i className="fas fa-file"></i> Files
                <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
                  {files.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        margin: "8px 0",
                        padding: "5px",
                        borderRadius: "5px",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f0f0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      {/* File link */}
                      {item.file && (
                        <a
                          href={item.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#007bff", textDecoration: "none" }}
                        >
                          {item.file.split("/").pop()}
                        </a>
                      )}

                      {/* Image link */}
                      {item.image && (
                        <a
                          href={item.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "block", marginTop: "5px" }}
                        >
                          <img
                            src={item.image}
                            alt="Uploaded"
                            style={{
                              width: "100px",
                              height: "auto",
                              borderRadius: "5px",
                              border: "1px solid #ddd",
                              boxShadow: "1px 1px 5px rgba(0,0,0,0.1)",
                            }}
                          />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </li>

              <li>
                <i className="fas fa-book"></i>
                <Link
                  to="/notebook"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  NoteBook
                </Link>
              </li>

              <li>
                <i className="fas fa-share"></i>
                <Link
                  to="/shared"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Shared with Me
                </Link>
              </li>

              <li>
                <i className="fas fa-trash"></i>
                <Link
                  to="/trash"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Trash
                </Link>
              </li>
            </ul>
          </div>

          <div className="notebook-card">
            <img src="/images/istoc.jpg" alt="Notebook Icon" />
            <p>
              <strong>Write Your notes Here!</strong>
            </p>
          </div>
        </aside>

        <main className="content">
          <div className="d-flex justify-content-between">
            <h3
              onClick={() => handleNotebookClick(notebook._id)}
              style={{ cursor: "pointer" }}
            >
              {notebook?.name || "Notebook"}
            </h3>
            <button
              type="button"
              className="btn btn-light btn-sm"
              style={{ width: "25%", color: "blue" }}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Share
            </button>
          </div>

          <p>
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>

          {notes.length === 0 ? (
            <div className="add-note">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg1fQdMzYmJ6ux6CDXbLAtsl4S3NARPNYVwg&s"
                alt="Note Icon"
              />
              <p>
                <strong>It all begins with notes</strong>
              </p>
              <p>
                Click the{" "}
                <span className="new-note">
                  <a
                    className="dropdown-item"
                    href="/"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal2"
                  >
                    <b>+ New Note</b>
                  </a>
                </span>{" "}
                button in the sidebar to create a note.
              </p>
            </div>
          ) : (
            <div className="note-cards d-flex flex-wrap gap-3 mt-3">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="card p-3 shadow-sm"
                  style={{ width: "18rem", cursor: "pointer" }}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditorEnabled(true);
                  }}
                >
                  <h5 className="text-primary">{note.title}</h5>

                  {/* Description preview */}
                  <div
                    className="note-preview"
                    dangerouslySetInnerHTML={{
                      __html: getShortenedHTML(note.description),
                    }}
                  ></div>

                  {/* File (if present) */}
                  {note.file && (
                    <div className="mt-2">
                      <strong>File:</strong>{" "}
                      <span className="text-muted">{note.file}</span>
                    </div>
                  )}

                  {/* Image (if available outside description) */}
                  {note.image && !note.description.includes(note.image) && (
                    <img
                      src={note.image}
                      alt="Note"
                      style={{
                        width: "100%",
                        height: "auto",
                        marginTop: "10px",
                      }}
                    />
                  )}

                  {/* Created time */}
                  <div
                    className="mt-2 text-muted"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {moment(note.createdAt).format("MMM D, YYYY [at] h:mm A")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* ✅ Hidden Inputs Here */}
        <input
          type="file"
          id="fileInput"
          accept=".pdf,.doc,.docx,.txt,.ppt,.xls,.xlsx,.zip,.rar"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />

        <main className="content1">
          <div className="rich-text-container">
            <h2 style={{ textAlign: "center" }}>Write Your Notes</h2>
            <input
              type="text"
              className="note-title"
              placeholder="Enter Title..."
              value={selectedNote?.name || ""}
              readOnly
            />
            <div
              id="toolbar"
              style={{
                pointerEvents: isEditorEnabled ? "auto" : "none",
                opacity: isEditorEnabled ? 2 : 0.5,
              }}
            >
              <span className="ql-formats">
                <select className="ql-font"></select>
                <select className="ql-size"></select>
              </span>
              <span className="ql-formats">
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>
                <button className="ql-strike"></button>
              </span>
              <span className="ql-formats">
                <select className="ql-color"></select>
                <select className="ql-background"></select>
              </span>
              <span className="ql-formats">
                <button className="ql-list" value="ordered"></button>
                <button className="ql-list" value="bullet"></button>
                <button className="ql-indent" value="-1"></button>
                <button className="ql-indent" value="+1"></button>
              </span>
              <span className="ql-formats">
                <select className="ql-align"></select>
              </span>
              <span className="ql-formats">
                <button className="ql-clean"></button>
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
              style={{ backgroundColor: "green", color: "white" }}
              disabled={!isEditorEnabled}
              onClick={handleSaveNote} // <-- add this
            >
              Save
            </button>
          </div>

          {/* <!-- Modal for Share Btn   --> */}
          <div
            className="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Share
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <label for="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Email Name"
                    placeholder="Enter Email here!"
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-warning w-25">
                    Send Invite
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <!--  Model For Notebook --> */}

          <div
            className="modal fade"
            id="exampleModal1"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Create Notebook
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <label htmlFor="NotebookName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="NotebookName"
                    placeholder="NoteBook........."
                    value={notebookName}
                    onChange={(e) => setNotebookName(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={createNotebook}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Model for notes */}
          <div
            className="modal fade"
            id="exampleModal2"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Create Note
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <label htmlFor="NotebookName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="NotebookName"
                    placeholder="Note........."
                    onChange={(e) => setNoteName(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => {
                      if (noteName.trim()) {
                        setNotes((prev) => [...prev, { name: noteName }]);
                        setNoteName(""); // clear input
                        document.getElementById("closeModalBtn").click(); // close modal
                      }
                    }}
                  >
                    Create
                  </button>

                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    id="closeModalBtn" // 🟢 add this
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
