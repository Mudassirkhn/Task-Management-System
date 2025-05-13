import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Task Management System 🎯</h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Login
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center p-6">
        <div className="mb-8">
          <img
            src="/logo2.png"
            alt="Task Manager"
            className="w-1/2 max-w-[900px] mx-auto rounded-xl"
          />
        </div>

        <div>
          <h2 className="text-4xl font-semibold text-gray-800 mb-4">
            Welcome to Task Management System 🎯
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take control of your tasks, stay organized, and boost your
            productivity with our easy-to-use Task Management System.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-4 relative text-center">
        <p className="text-sm">Copyright © 2025
          <br /> Author: Mudassir Khan</p>

        {/* Social Icons */}
        <div className="absolute bottom-4 right-4 flex space-x-4">
          <a
            href="https://www.linkedin.com/in/mudassir-khan-0a91862b7/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            <FaLinkedin size={28} />
          </a>
          <a
            href="https://github.com/Mudassirkhn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400"
          >
            <FaGithub size={28} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
