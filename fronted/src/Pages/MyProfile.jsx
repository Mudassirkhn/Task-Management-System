import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const MyProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/profile`, axiosConfig);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setNewUsername(res.data.username);
      setNewEmail(res.data.email);
    } catch (error) {
      console.error("Failed to fetch profile", error);
      showToast("error", "Session expired, please login again.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { username: newUsername, email: newEmail };
      await axios.put(`${BASE_URL}/api/user/profile`, payload, axiosConfig);

      showToast("success", "Profile updated successfully");
      setUsername(newUsername);
      setEmail(newEmail);
      setIsEditing(false);

      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      console.error("Profile update failed", error);
      showToast("error", "Failed to update profile");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchProfile();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-10 text-white">
      <div className="max-w-xl mx-auto bg-white text-black p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Profile</h2>
          <button
            onClick={() => navigate("/home")}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block font-semibold">Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              disabled={!isEditing}
              className={`w-full border px-4 py-2 rounded ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={!isEditing}
              className={`w-full border px-4 py-2 rounded ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          {isEditing ? (
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewUsername(username);
                  setNewEmail(email);
                  setIsEditing(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded"
            >
              Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
