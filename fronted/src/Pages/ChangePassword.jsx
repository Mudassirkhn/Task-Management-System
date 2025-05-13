import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  const resetFields = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    const trimmedOld = oldPassword.trim();
    const trimmedNew = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedOld || !trimmedNew || !trimmedConfirm) {
      showToast("error", "All fields are required");
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      showToast("error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        oldPassword: trimmedOld,
        newPassword: trimmedNew,
        confirmPassword: trimmedConfirm,
      };

      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/user/password`, // Using environment variable
        payload,
        axiosConfig
      );

      showToast("success", res.data.message || "Password updated successfully");
      setIsEditing(false);
      resetFields();

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Password update failed:", error);
      const msg = error.response?.data?.message || "Failed to update password";
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-10 text-white">
      <div className="max-w-xl mx-auto bg-white text-black p-8 rounded-2xl shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Change Password</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
          >
            Back
          </button>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block font-semibold">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={!isEditing}
              className={`w-full border px-4 py-2 rounded ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
              placeholder="Enter Old Password"
            />
          </div>

          <div>
            <label className="block font-semibold">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!isEditing}
              className={`w-full border px-4 py-2 rounded ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
              placeholder="Enter New Password"
            />
          </div>

          <div>
            <label className="block font-semibold">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isEditing}
              className={`w-full border px-4 py-2 rounded ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
              placeholder="Confirm New Password"
            />
          </div>

          {isEditing ? (
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetFields();
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

export default ChangePassword;
