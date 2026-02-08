import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/home.css";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      
    <div className="home-layout">
      
      <section className="hero">
        <h1 className="hero-title">Welcome to CopyShieldX</h1>
        <p className="hero-subtitle">
          Protect your digital content with secure uploads, verification, and timelines.
        </p>
        <div className="hero-buttons">
          <Link to="/login" className="btn-gradient">Login</Link>
          <Link to="/register" className="btn-secondary">Register</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card animate-card">
          <h2>🔒 Secure Uploads</h2>
          <p>Upload files with cryptographic protection and unique SHA‑256 fingerprints.</p>
        </div>
        <div className="feature-card animate-card">
          <h2>✅ Verification</h2>
          <p>Verify originality, detect copies, and track modifications instantly.</p>
        </div>
        <div className="feature-card animate-card">
          <h2>📜 Timeline</h2>
          <p>View the complete history of your content across creators and verifiers.</p>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} CopyShieldX. All rights reserved.</p>
      </footer>
      </div>
    </div>
    
  );
}