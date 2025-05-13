import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const HomePage = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskStatus, setTaskStatus] = useState("New Task");
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [userName, setUserName] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim() || !taskDesc.trim()) {
      return showToast("error", "Please fill all fields!");
    }

    const payload = { taskName, taskDesc, status: taskStatus };

    try {
      if (editTaskId) {
        await axios.put(`${BASE_URL}/task/${editTaskId}`, payload, axiosConfig);
        showToast("success", "Task updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/task`, payload, axiosConfig);
        showToast("success", "Task added successfully!");
      }

      setTaskName("");
      setTaskDesc("");
      setTaskStatus("New Task");
      setEditTaskId(null);
      getTasks();
    } catch (error) {
      console.error("Submit Error:", error);
      showToast("error", "Something went wrong!");
    }
  };

  const getTasks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks`, axiosConfig);
      setTasks(res.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This task will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/task/${id}`, axiosConfig);
        showToast("success", "Task deleted!");
        getTasks();
      } catch (error) {
        console.error("Delete Error:", error);
        showToast("error", "Delete failed!");
      }
    }
  };

  const handleEditTask = (task) => {
    setTaskName(task.taskName);
    setTaskDesc(task.taskDesc);
    setTaskStatus(task.status || "New Task");
    setEditTaskId(task._id);
  };

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/profile`, axiosConfig);
        setUserName(res.data.username || "User");
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        handleLogout();
      }
    };

    fetchProfile();
    getTasks();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen px-6 py-6">
      <div className="max-w-5xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome, {userName} 🎯</h1>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-3xl px-2 py-1 focus:outline-none"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <button onClick={() => navigate("/MyProfile")} className="block w-full px-4 py-2 text-left hover:bg-gray-100">My Profile</button>
                <button onClick={() => navigate("/Changepassword")} className="block w-full px-4 py-2 text-left hover:bg-gray-100">Change Password</button>
                <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:bg-red-100 text-red-600">Logout</button>
              </div>
            )}
          </div>
        </div>

        {/* Task Form */}
        <form onSubmit={handleSubmitTask} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="col-span-2 border px-4 py-2 rounded"
          />
          <textarea
            placeholder="Task Description"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            className="col-span-2 border px-4 py-2 rounded"
          />
          <select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            className="col-span-2 border px-4 py-2 rounded"
          >
            <option value="New Task">New Task</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button type="submit" className="col-span-2 bg-green-600 text-white px-10 py-2 rounded">
            {editTaskId ? "Update Task" : "Add Task"}
          </button>
        </form>

        {/* Task Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => (
                <tr key={task._id} className="border-t">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{task.taskName}</td>
                  <td className="p-3">{task.taskDesc}</td>
                  <td className="p-3">{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(task.createdAt).toLocaleTimeString()}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      task.status === "Completed" ? "bg-green-200 text-green-800"
                      : task.status === "Pending" ? "bg-yellow-200 text-yellow-800"
                      : task.status === "Cancelled" ? "bg-red-300 text-red-800"
                      : "bg-blue-200 text-blue-800"
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleEditTask(task)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => handleDeleteTask(task._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">No tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
