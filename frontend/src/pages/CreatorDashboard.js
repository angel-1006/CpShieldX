import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UploadForm from "../features/creator/UploadForm";
import UploadHistory from "../features/creator/UploadHistory";
import api from "../api/api";
import "../styles/creatorDashboard.css"

export default function CreatorDashboard() {
  const [newUpload, setNewUpload] = useState(null);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  // Fetch stats for creator
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/content/stats/creator/");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch creator stats", err);
      }
    };
    fetchStats();
  }, [newUpload]); // refresh stats when a new upload succeeds

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar role="CREATOR" />
        <main>
          <h1 className="page-title">Creator Dashboard</h1>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="card pending animate-card">
              <h2>Pending Reviews</h2>
              <p className="stat-number">{stats.pending}</p>
            </div>
            <div className="card approved animate-card">
              <h2>Approved Files</h2>
              <p className="stat-number">{stats.approved}</p>
            </div>
            <div className="card rejected animate-card">
              <h2>Rejected Files</h2>
              <p className="stat-number">{stats.rejected}</p>
            </div>
          </div>

          {/* Upload Form */}
          <div className="card animate-card">
            <UploadForm onUploadSuccess={setNewUpload} />
          </div>

          {/* Upload History */}
          <div className="card animate-card">
            <UploadHistory newUpload={newUpload} />
          </div>
        </main>
      </div>
    </div>
  );
}