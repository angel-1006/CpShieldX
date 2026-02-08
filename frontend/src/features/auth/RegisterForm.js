import { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("CREATOR");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
      await api.post("/users/register/", {
        username,
        email,
        password,
        role,
      });
      setMessage("Registration successful!");
      navigate("/login");
    } catch {
      setMessage("Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-card">
        <h1 className="logo">CopyShieldX</h1>
        <p className="tagline">Join and Protect Your Content</p>
        <form onSubmit={handleRegister}>
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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="CREATOR">Creator</option>
              <option value="VERIFIER">Verifier</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-gradient">Register</button>
        </form>
        <p className={`message ${message.includes("successful") ? "success" : "error"}`}>
          {message}
        </p>
        <p className="register-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}