import { Routes, Route } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import axios from "axios";

// Pages
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Privateroutes from "./Component/Privateroutes";
import LandingPage from "./Pages/LandingPage";
import MyProfile from "./Pages/MyProfile"; // ✅ Update the path based on where MyProfile.jsx is located
import ChangePassword from "./Pages/ChangePassword";

function App() {
  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/MyProfile" element={<MyProfile />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element= {<Login />} />
       <Route path="/home" element={<Home/>}/>
      <Route path="/Changepassword" element={<ChangePassword />} />

        {/* Private/protected route */}

        <Route path="/home"element={<Privateroutes>
              <Home/>
            </Privateroutes>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
