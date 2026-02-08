import { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Get JWT tokens
      const res = await api.post("/users/token/", { username, password });
      localStorage.setItem("access_token", res.data.access);

      // Step 2: Fetch user profile to get role
      const profile = await api.get("/users/me/");
      const role = profile.data.role;

    

      localStorage.setItem("userRole", role);   // <-- add this line

      setMessage("Login successful!");

      // Step 3: Redirect based on role
      if (role === "CREATOR") {
        navigate("/creator");
      } else if (role === "VERIFIER") {
        navigate("/verifier");
      } else if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/"); // fallback
      }
    } catch {
      setMessage("Invalid credentials!");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-card">
        <h1 className="logo">CopyShieldX</h1>
        <p className="tagline">Secure Your Digital Footprints</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-gradient">Login</button>
        </form>
        <p className={`message ${message.includes("success") ? "success" : "error"}`}>
          {message}
        </p>
        <p className="register-link">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}