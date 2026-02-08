import axios from "axios";

const api = axios.create({
  baseURL: "https://todo-demo-backend-oyhf.onrender.com/api/todos",
});

export default api;
