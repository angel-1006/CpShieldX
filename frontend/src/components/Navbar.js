import { Link } from "react-router-dom";
import "../styles/layout.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">CopyShieldX</div>
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/login" className="nav-item">Login</Link>
        <Link to="/register" className="nav-item">Register</Link>
      </div>
    </nav>
  );
}