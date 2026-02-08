import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/stats.css";

export default function SystemStatsPage() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/content/users/systemstats/");
        setStats(res.data || {});
      } catch (err) {
        console.error("Failed to fetch system stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar role="ADMIN" />
        <main className="dashboard-main">
          <h1 className="page-title">System Statistics</h1>

          <div className="stats-grid">
            <div className="stats-card">
              <h3>Total Users</h3>
              <p>{stats.total_users || 0}</p>
            </div>
            <div className="stats-card">
              <h3>Creators</h3>
              <p>{stats.creators || 0}</p>
            </div>
            <div className="stats-card">
              <h3>Verifiers</h3>
              <p>{stats.verifiers || 0}</p>
            </div>
            <div className="stats-card">
              <h3>Admins</h3>
              <p>{stats.admins || 0}</p>
            </div>
            <div className="stats-card">
              <h3>Total Uploads</h3>
              <p>{stats.total_uploads || 0}</p>
            </div>
            <div className="stats-card">
              <h3>Originals</h3>
              <p>{stats.originals || 0}</p>
            </div>
            <div className="stats-card">
              <h3>Copies</h3>
              <p>{stats.copies || 0}</p>
            </div>
            <div className="stats-card">
              <h3>Modified</h3>
              <p>{stats.modified || 0}</p>
            </div>
            <div className="stats-card">
              <h3>Pending Reviews</h3>
              <p>{stats.pending_reviews || 0}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}