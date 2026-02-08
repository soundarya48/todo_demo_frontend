import React, { useState, useEffect } from "react";
import api from "../api";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    api.get("/").then(res => setTodos(res.data));
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await api.post("/", { text });
    setTodos([...todos, res.data]);
    setText("");
  };

  const toggleTodo = async (id) => {
    const res = await api.put(`/${id}`);
    setTodos(todos.map(todo => todo._id === id ? res.data : todo));
  };

  const editTodo = async (id) => {
  if (!editText.trim()) return;
  try {
    const res = await api.put(`/edit/${id}`, { text: editText });
    setTodos(todos.map(todo => todo._id === id ? res.data : todo));
    setEditId(null);
    setEditText("");
  } catch (err) {
    console.error("Error editing todo:", err);
  }
};

  const deleteTodo = async (id) => {
    await api.delete(`/${id}`);
    setTodos(todos.filter(todo => todo._id !== id));
  };


  return (
    <div className="todo-container">
      <h1>📝 To-Do List</h1>
      <div className="input-section">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            {editId === todo._id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => editTodo(todo._id)}>💾 Save</button>
                <button onClick={() => setEditId(null)}>❌ Cancel</button>
              </>
            ) : (
              <>
                <span
                  onClick={() => toggleTodo(todo._id)}
                  style={{
                    textDecoration: todo.completed ? "line-through" : "",
                    cursor: "pointer"
                  }}
                >
                  {todo.text}
                </span>
                <div>
                  <button onClick={() => { setEditId(todo._id); setEditText(todo.text); }}>✏️ Edit</button>
                  <button onClick={() => deleteTodo(todo._id)}>🗑️ Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
