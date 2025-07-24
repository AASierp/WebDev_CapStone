import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";


function App() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("http://localhost:3000/api/session", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.isLoggedIn) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log("error with session data");
      }
    }

    checkSession();
  }, [navigate]);

  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </main>
  );
}

export default App;
