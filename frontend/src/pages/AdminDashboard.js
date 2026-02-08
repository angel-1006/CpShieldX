import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/admin.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Admin stats
        const statsRes = await api.get("content/stats/admin/");
        setStats(statsRes.data);

        // Global audit logs
        const logsRes = await api.get("/audit/logs/");
        setLogs(logsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar role="ADMIN" />
        <main className="dashboard-main">
          <h1 className="page-title">Admin Dashboard</h1>

          {/* Stats Cards */}
          <div className="stats-grid">
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

          {/* Global Timeline Table */}
          <div className="timeline-container">
            <h2>System Activity Timeline</h2>
            <table className="timeline-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>File</th>
                  <th>Action</th>
                  <th>Result</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 20).map((log) => (
                  <tr key={log.id}>
                    <td>{log.user}</td>
                    <td>{log.file_name || "Unnamed File"}</td>
                    <td>{log.action}</td>
                    <td>{log.result || "N/A"}</td>
                    <td>
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && <p>No activity found.</p>}
          </div>
        </main>
      </div>
    </div>
  );
}