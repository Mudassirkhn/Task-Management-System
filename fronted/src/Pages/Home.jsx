import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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
        await axios.put(
          `${BASE_URL}/api/task/${editTaskId}`,
          payload,
          axiosConfig
        );
        showToast("success", "Task updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/api/task`, payload, axiosConfig);
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
      const res = await axios.get(`${BASE_URL}/api/tasks`, axiosConfig);
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
        await axios.delete(`${BASE_URL}/api/task/${id}`, axiosConfig);
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
        const res = await axios.get(
          `${BASE_URL}/api/user/profile`,
          axiosConfig
        );
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
    <div className="bg-gray-900 min-h-screen px-4 sm:px-6 py-6">
      <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Welcome, {userName} 🎯
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-3xl px-2 py-1 focus:outline-none"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                <button
                  onClick={() => navigate("/MyProfile")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                >
                  My Profile
                </button>
                <button
                  onClick={() => navigate("/Changepassword")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                >
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left hover:bg-red-100 text-red-600 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Task Form */}
        <form
          onSubmit={handleSubmitTask}
          className="grid grid-cols-1 gap-4 mb-8"
        >
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="border px-4 py-2 rounded text-sm"
          />
          <textarea
            placeholder="Task Description"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            className="border px-4 py-2 rounded text-sm"
          />
          <select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            className="border px-4 py-2 rounded text-sm"
          >
            <option value="New Task">New Task</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm sm:text-base"
          >
            {editTaskId ? "Update Task" : "Add Task"}
          </button>
        </form>

        {/* Task Table */}
        <div className="w-full overflow-x-auto">
  <table className="min-w-full text-xs sm:text-sm md:text-base border-collapse">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        <th className="p-2 sm:p-3 whitespace-nowrap">#</th>
        <th className="p-2 sm:p-3 whitespace-nowrap">Name</th>
        <th className="p-2 sm:p-3 whitespace-nowrap">Description</th>
        <th className="p-2 sm:p-3 whitespace-nowrap">Date</th>
        <th className="p-2 sm:p-3 whitespace-nowrap">Time</th>
        <th className="p-2 sm:p-3 whitespace-nowrap">Status</th>
        <th className="p-2 sm:p-3 whitespace-nowrap">Actions</th>
      </tr>
    </thead>
    <tbody>
      {tasks.length > 0 ? (
        tasks.map((task, idx) => (
          <tr key={task._id} className="border-t text-gray-800">
            <td className="p-2 sm:p-3">{idx + 1}</td>
            <td className="p-2 sm:p-3">{task.taskName}</td>
            <td className="p-2 sm:p-3">{task.taskDesc}</td>
            <td className="p-2 sm:p-3">
              {new Date(task.createdAt).toLocaleDateString()}
            </td>
            <td className="p-2 sm:p-3">
              {new Date(task.createdAt).toLocaleTimeString()}
            </td>
            <td className="p-2 sm:p-3">
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-sm font-medium ${
                  task.status === "Completed"
                    ? "bg-green-200 text-green-800"
                    : task.status === "Pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : task.status === "Cancelled"
                    ? "bg-red-300 text-red-800"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {task.status}
              </span>
            </td>
            <td className="p-2 sm:p-3">
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <button
                  onClick={() => handleEditTask(task)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7" className="text-center py-6 text-gray-500">
            No tasks found.
          </td>
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
