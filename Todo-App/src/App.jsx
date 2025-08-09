import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot
} from "firebase/firestore";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const tasksCollection = collection(db, "tasks");

  // Fetch tasks in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text
      }));
      setTasks(tasksData);
    });
    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (input.trim() !== "") {
      await addDoc(tasksCollection, { text: input });
      setInput("");
    }
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    if (editId === id) {
      setEditId(null);
      setEditValue("");
    }
  };

  const startEdit = (id, text) => {
    setEditId(id);
    setEditValue(text);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValue("");
  };

  const saveEdit = async (id) => {
    if (editValue.trim() !== "") {
      await updateDoc(doc(db, "tasks", id), { text: editValue });
      setEditId(null);
      setEditValue("");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 bg-light border-0 rounded-4">
        <h2 className="text-center mb-4 text-primary fw-bold">📝 To-Do App</h2>

        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control rounded-start-pill"
            placeholder="Enter a task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="btn btn-primary rounded-end-pill px-4"
            onClick={addTask}
          >
            Add
          </button>
        </div>

        <ul className="list-group">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom"
            >
              {editId === task.id ? (
                <>
                  <input
                    type="text"
                    className="form-control me-2"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <div className="btn-group">
                    <button
                      className="btn btn-success btn-sm me-1"
                      onClick={() => saveEdit(task.id)}
                      title="Save"
                    >
                      <i className="bi bi-check-circle"></i>
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={cancelEdit}
                      title="Cancel"
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex-grow-1">{task.text}</span>
                  <div className="btn-group">
                    <button
                      className="btn btn-warning btn-sm me-1"
                      onClick={() => startEdit(task.id, task.text)}
                      title="Edit"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTask(task.id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
