import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmpassword } = formData;

    if (!username || !email || !password || !confirmpassword) {
      setMessage("Please fill all fields!");
      return;
    }

    if (password !== confirmpassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const BASE_URL = process.env.REACT_APP_BASE_URL;
      const response = await axios.post(
        `${BASE_URL}/user/signup`,
        { username, email, password }
      );

      if (response.status === 201 || response.data.success) {
        setMessage("Sign-up successful! Redirecting to login...");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmpassword: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(response.data.message || "Sign-up failed!");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setMessage(error.response?.data?.message || "Something went wrong during signup.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-200 p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up 🎯</h1>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-black mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-black mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-black mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-black mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmpassword"
              value={formData.confirmpassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-gray-700 hover:bg-gray-900 py-2 rounded-md transition duration-300"
          >
            Sign Up
          </button>
        </form>

        {message && <p className="text-center mt-4 text-red-500">{message}</p>}

        <p className="text-center mt-4">
          Already have an account?{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
