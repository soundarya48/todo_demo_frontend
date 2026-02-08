import React, { useEffect, useState } from "react";
import api from "../api";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // 🔹 Fetch all todos
  useEffect(() => {
    api.get("")
      .then(res => {
        // backend returns { todos: [...] }
        setTodos(res.data.todos || []);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setTodos([]);
      });
  }, []);

  // 🔹 Add todo
  const addTodo = async () => {
    if (!text.trim()) return;

    try {
      const res = await api.post("", { text });
      setTodos(prev => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // 🔹 Toggle complete
  const toggleTodo = async (id) => {
    try {
      const res = await api.put(`/${id}`);
      setTodos(prev =>
        prev.map(todo => (todo._id === id ? res.data : todo))
      );
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // 🔹 Edit todo
  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const res = await api.put(`/edit/${id}`, { text: editText });
      setTodos(prev =>
        prev.map(todo => (todo._id === id ? res.data : todo))
      );
      setEditId(null);
      setEditText("");
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  // 🔹 Delete todo
  const deleteTodo = async (id) => {
    try {
      await api.delete(`/${id}`);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
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
        {Array.isArray(todos) && todos.map(todo => (
          <li key={todo._id}>
            {editId === todo._id ? (
              <>
                <input
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo._id)}>💾 Save</button>
                <button onClick={() => setEditId(null)}>❌ Cancel</button>
              </>
            ) : (
              <>
                <span
                  onClick={() => toggleTodo(todo._id)}
                  style={{
                    cursor: "pointer",
                    textDecoration: todo.completed ? "line-through" : "none"
                  }}
                >
                  {todo.text}
                </span>
                <div>
                  <button
                    onClick={() => {
                      setEditId(todo._id);
                      setEditText(todo.text);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button onClick={() => deleteTodo(todo._id)}>
                    🗑️ Delete
                  </button>
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
